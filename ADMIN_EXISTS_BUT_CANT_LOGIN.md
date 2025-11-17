# adminユーザーは存在するがログインできない場合

## 🔍 現在の状況

`admin`ユーザーは既にSupabase上に存在していますが、ログインできません。

**原因**: パスワードハッシュが正しくない可能性が高いです。

## 🛠️ 解決方法

### ステップ1: adminユーザーの状態を確認

SupabaseのSQL Editorで以下を実行：

```sql
SELECT 
  username, 
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start
FROM system_admins 
WHERE username = 'admin';
```

**確認ポイント**:
- `hash_length` が `60` であること
- `hash_start` が `$2a$10$` で始まること

### ステップ2: パスワードハッシュをリセット

`CHECK_AND_FIX_ADMIN.sql` の内容を実行してください。

または、直接実行：

```sql
-- パスワードハッシュをリセット（パスワード: admin123）
UPDATE system_admins 
SET 
  password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  updated_at = NOW()
WHERE username = 'admin';

-- 確認
SELECT 
  username,
  LENGTH(password_hash) AS len,
  LEFT(password_hash, 30) AS preview
FROM system_admins 
WHERE username = 'admin';
```

### ステップ3: 確認

実行後、以下を確認してください：
- `len` が `60` であること
- `preview` が `$2a$10$TfL2YgEWStCa.70GOP75Se` で始まること

### ステップ4: ログインを試す

1. ブラウザのキャッシュをクリア（F12 → Application → Clear site data）
2. `/system-admin/login` にアクセス
3. ユーザー名: `admin`
4. パスワード: `admin123`
5. 「ログイン」をクリック

## 🔍 デバッグ方法

### ブラウザのコンソールで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. 以下のログを確認：
   - `Password hash length:` - 60である必要があります
   - `Test: Comparing "admin123" with stored hash:` - `true` である必要があります

### ネットワークタブで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` をクリック
5. 「Response」タブでレスポンスを確認

**確認すべき情報**:
- `debug.hashLength` が `60` であること
- `debug.testWithAdmin123` が `true` であること

## ✅ 確認チェックリスト

- [ ] adminユーザーが存在する（`SELECT * FROM system_admins WHERE username = 'admin';`）
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] `CHECK_AND_FIX_ADMIN.sql` を実行した
- [ ] ブラウザのキャッシュをクリアした
- [ ] ログインを試した

## 🆘 それでも解決しない場合

### 1. パスワードハッシュを再生成

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

### 2. adminユーザーを完全に再作成

```sql
-- 既存のadminを削除
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

## 📝 ログイン情報

- **URL**: `/system-admin/login`
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

