# 401エラー「ユーザー名またはパスワードが正しくありません」の解決方法

## 🔍 問題の確認

エラーメッセージ: `{"error":"ユーザー名またはパスワードが正しくありません"}`

このエラーは、以下のいずれかが原因です：
1. パスワードハッシュが正しくない
2. パスワードが間違っている
3. データベースの接続に問題がある

## 🛠️ 解決手順

### ステップ1: データベースを確認

SupabaseのSQL Editorで以下を実行：

```sql
-- システム管理者が存在するか確認
SELECT 
  username, 
  name,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  updated_at
FROM system_admins 
WHERE username = 'admin';
```

**確認ポイント**:
- 結果が表示されるか（存在するか）
- `hash_length` が `60` であるか
- `hash_preview` が `$2a$10$...` で始まるか

### ステップ2: パスワードを完全にリセット

以下を**必ず実行**してください：

```sql
-- 既存のadminユーザーを完全に削除
DELETE FROM system_admins WHERE username = 'admin';

-- 新しいadminユーザーを作成（パスワード: admin123）
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- 確認
SELECT 
  username, 
  name,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE username = 'admin';
```

**重要**: 
- `hash_length` が `60` であることを確認
- `hash_preview` が `$2a$10$TfL2YgEWStCa.70GOP75Se...` で始まることを確認

### ステップ3: ログインを再試行

- URL: `/system-admin/login`
- ユーザー名: `admin`（**正確に**）
- パスワード: `admin123`（**スペースなし**）

### ステップ4: まだエラーが出る場合

#### 4-1: パスワードハッシュを再生成

Node.jsで新しいハッシュを生成：

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => {
  console.log('新しいパスワードハッシュ:', hash);
  console.log('');
  console.log('Supabase SQL Editorで以下を実行:');
  console.log(`UPDATE system_admins SET password_hash = '${hash}' WHERE username = 'admin';`);
});
```

生成したハッシュで更新：

```sql
UPDATE system_admins 
SET password_hash = '生成したハッシュ'
WHERE username = 'admin';
```

#### 4-2: システム管理者を完全に再作成

```sql
-- 完全に削除
DELETE FROM system_admins WHERE username = 'admin';

-- 再作成
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

## 🔍 デバッグ方法

### ブラウザのコンソールで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. 以下のログを確認：
   - `=== Login Error ===`
   - `Error response:` の内容

### ネットワークタブで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` をクリック
5. 「Response」タブでレスポンスを確認

## ✅ 確認チェックリスト

- [ ] システム管理者が存在する（`SELECT * FROM system_admins WHERE username = 'admin';`）
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] パスワードをリセットした
- [ ] ログイン情報が正しい（ユーザー名: `admin`, パスワード: `admin123`）
- [ ] ブラウザのキャッシュをクリアした
- [ ] ページをリロードした

## 🆘 それでも解決しない場合

以下の情報を収集してください：

1. **データベースの確認結果**
   ```sql
   SELECT username, LENGTH(password_hash) AS len, LEFT(password_hash, 30) AS preview
   FROM system_admins WHERE username = 'admin';
   ```

2. **ブラウザのコンソールエラー**
   - `Error response:` の内容

3. **ネットワークタブのレスポンス**
   - `/api/auth/system-admin/login` のレスポンスボディ

これらの情報を元に、さらに詳しく調査できます。

