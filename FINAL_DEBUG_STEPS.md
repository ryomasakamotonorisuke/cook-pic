# 最終デバッグ手順

## 🔍 現在の状況

`COMPLETE_RESET.sql` を実行した後でも、まだ「ユーザー名またはパスワードが正しくありません」というエラーが出ています。

## 🛠️ 解決手順

### ステップ1: パスワードハッシュを検証

SupabaseのSQL Editorで以下を実行：

```sql
-- VERIFY_PASSWORD_HASH.sql の内容を実行
```

または、直接実行：

```sql
-- 現在の状態を確認
SELECT 
  username, 
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start
FROM system_admins 
WHERE username = 'admin';

-- パスワードハッシュを修正
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';

-- 確認
SELECT 
  username,
  LENGTH(password_hash) AS len,
  LEFT(password_hash, 30) AS preview
FROM system_admins 
WHERE username = 'admin';
```

### ステップ2: 確認ポイント

実行後、以下を確認してください：

1. **hash_length が 60 であること**
2. **hash_start が `$2a$10$` で始まること**
3. **preview が `$2a$10$TfL2YgEWStCa.70GOP75Se` で始まること**

### ステップ3: ブラウザのコンソールで詳細を確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. 以下のログを確認：
   - `Password hash length:`
   - `Password comparison result:`
   - `Test: Comparing "admin123" with stored hash:`

### ステップ4: ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` をクリック
5. 「Response」タブでレスポンスを確認

**確認すべき情報**:
- `debug.hashLength` が `60` であること
- `debug.testWithAdmin123` が `true` であること

### ステップ5: まだエラーが出る場合

#### 5-1: パスワードハッシュを再生成

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

#### 5-2: システム管理者を完全に再作成

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

## ✅ 確認チェックリスト

- [ ] `VERIFY_PASSWORD_HASH.sql` を実行した
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ブラウザのコンソールで `Password comparison result: true` が表示される
- [ ] ネットワークタブで `debug.testWithAdmin123: true` が表示される
- [ ] ブラウザのキャッシュをクリアした
- [ ] ページをリロードした

## 🆘 それでも解決しない場合

以下の情報を収集してください：

1. **データベースの状態**
   ```sql
   SELECT username, password_hash, LENGTH(password_hash) AS len FROM system_admins WHERE username = 'admin';
   ```

2. **ブラウザのコンソールログ**
   - `Password hash length:`
   - `Password comparison result:`
   - `Test: Comparing "admin123" with stored hash:`

3. **ネットワークタブのレスポンス**
   - `debug.hashLength`
   - `debug.testWithAdmin123`

これらの情報を元に、さらに詳しく調査できます。

