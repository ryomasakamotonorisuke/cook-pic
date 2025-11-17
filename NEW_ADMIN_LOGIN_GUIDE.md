# 新しいシステム管理者でログインする方法

## 🔍 新しい管理者の情報

- **UID**: `c096fc40-82c0-4051-bc4a-b9ed2404c1b0`
- **Email**: `admin@admin.com`

## 🛠️ パスワードを設定する

### ステップ1: SupabaseのSQL Editorを開く

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 「SQL Editor」を開く

### ステップ2: パスワードハッシュを設定

`SETUP_NEW_ADMIN.sql` の内容を実行してください。

または、直接実行：

```sql
-- パスワードハッシュを設定（パスワード: admin123）
UPDATE system_admins 
SET 
  password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  updated_at = NOW()
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- 確認
SELECT 
  username,
  name,
  email,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### ステップ3: ユーザー名を確認

```sql
SELECT username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

**重要**: ログイン時に使用するユーザー名を確認してください。

## ✅ ログイン方法

### ステップ1: ログインページにアクセス

- URL: `/system-admin/login`

### ステップ2: ログイン情報を入力

- **ユーザー名**: ステップ3で確認したユーザー名（`username`フィールドの値）
- **パスワード**: `admin123`

### ステップ3: ログインを試す

「ログイン」をクリック

## 🔍 ユーザー名がわからない場合

SupabaseのSQL Editorで以下を実行：

```sql
SELECT username, name, email FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

`username`フィールドの値がログイン時に使用するユーザー名です。

## 📝 確認チェックリスト

- [ ] `SETUP_NEW_ADMIN.sql` を実行した
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ユーザー名を確認した
- [ ] ログイン時に正しいユーザー名を使用している
- [ ] パスワードが `admin123` である（スペースなし）

## 🆘 それでもログインできない場合

### 1. ユーザー名を確認

```sql
SELECT username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### 2. パスワードハッシュを再設定

```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### 3. ブラウザのキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. 「Application」タブを開く
3. 「Storage」→「Clear site data」をクリック
4. すべてのチェックボックスにチェックを入れる
5. 「Clear site data」をクリック

### 4. ログインを再試行

- ユーザー名: 確認したユーザー名
- パスワード: `admin123`

