# 401エラー「ユーザー名またはパスワードが正しくありません」の解決方法

## 🔍 問題

ログイン時に以下のエラーが表示されます：
```json
{"error":"ユーザー名またはパスワードが正しくありません"}
```

## 🛠️ 解決方法

### 方法1: システム管理者を再作成（推奨）

SupabaseのSQL Editorで以下を実行：

```sql
-- supabase/QUICK_FIX_SYSTEM_ADMIN.sql の内容を実行
```

または、直接実行：

```sql
-- 既存のadminユーザーを削除（存在する場合）
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
SELECT username, name, email FROM system_admins WHERE username = 'admin';
```

### 方法2: データベースを確認してから作成

1. **テーブルが存在するか確認**:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;
```

2. **システム管理者が存在するか確認**:

```sql
SELECT username, name, email FROM system_admins WHERE username = 'admin';
```

3. **存在しない場合、作成**:

```sql
-- テーブルが存在しない場合は、まずマイグレーションを実行
-- supabase/migration_add_system_admin_complete.sql を実行

-- その後、システム管理者を作成
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

## ✅ 確認手順

### 1. データベースを確認

```sql
SELECT username, name, email, created_at 
FROM system_admins 
WHERE username = 'admin';
```

**結果が表示される場合**: システム管理者が存在します
**結果が空の場合**: システム管理者を作成してください

### 2. ログインを試す

- **URL**: `/system-admin/login`
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

### 3. まだエラーが出る場合

パスワードをリセット：

```sql
-- 新しいパスワードのbcryptハッシュを生成（Node.jsで実行）
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('admin123', 10).then(hash => console.log(hash));

-- Supabase SQL Editorで実行（生成したハッシュに置き換える）
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

## 🔍 デバッグ方法

### Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」→ 最新のデプロイ → 「Functions」タブ
4. `/api/auth/system-admin/login` のログを確認

以下のようなログが表示されるはずです：

```
=== System Admin Login Attempt ===
Username: admin
Password provided: ***
Supabase URL: Set
Service Role Key: Set
Querying system_admins table for username: admin
Admin found: admin システム管理者
Comparing password...
Password valid: true / false
```

### よくある問題

1. **テーブルが存在しない**
   - 解決方法: `migration_add_system_admin_complete.sql` を実行

2. **システム管理者が存在しない**
   - 解決方法: `QUICK_FIX_SYSTEM_ADMIN.sql` を実行

3. **パスワードが間違っている**
   - 解決方法: `admin123` を正確に入力

4. **環境変数が設定されていない**
   - 解決方法: Vercelの環境変数を確認

## 📝 クイックリファレンス

### システム管理者を作成するSQL

```sql
DELETE FROM system_admins WHERE username = 'admin';

INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### ログイン情報

- **ユーザー名**: `admin`
- **パスワード**: `admin123`

## 🆘 それでも解決しない場合

1. **Vercelのログを確認**
   - エラーの詳細を確認

2. **Supabaseのログを確認**
   - Postgres Logsを確認

3. **データベースを直接確認**
   - SQL Editorで `SELECT * FROM system_admins;` を実行

これらの情報を元に、さらに詳しく調査できます。

