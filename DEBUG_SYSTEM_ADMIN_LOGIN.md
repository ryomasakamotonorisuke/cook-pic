# システム管理者ログイン デバッグガイド

## 🔍 詳細なデバッグ手順

### ステップ1: ブラウザのコンソールを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. エラーメッセージを確認

**確認すべき情報**:
- `Login error:` の後に表示されるエラー
- `Error response:` の後に表示される詳細情報

### ステップ2: ネットワークタブを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のリクエストをクリック
5. 「Response」タブでエラーメッセージを確認

**確認すべき情報**:
- ステータスコード（401, 404, 500など）
- レスポンスボディの内容
- `error` フィールド
- `details` フィールド（あれば）

### ステップ3: Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」→ 最新のデプロイ → 「Functions」タブ
4. `/api/auth/system-admin/login` のログを確認

**確認すべきログ**:
```
=== System Admin Login Attempt ===
Username: admin
Password provided: ***
Supabase URL: Set / Missing
Service Role Key: Set / Missing
Querying system_admins table for username: admin
```

**エラーの種類**:

#### エラー1: `Missing Supabase environment variables`
**原因**: 環境変数が設定されていない
**解決方法**:
- Vercelの環境変数を確認
- `NEXT_PUBLIC_SUPABASE_URL` が設定されているか
- `SUPABASE_SERVICE_ROLE_KEY` が設定されているか

#### エラー2: `システム管理者テーブルが存在しません`
**原因**: `system_admins` テーブルが作成されていない
**解決方法**:
```sql
-- Supabase SQL Editorで実行
-- supabase/migration_add_system_admin_complete.sql の内容を実行
```

#### エラー3: `ユーザー名が見つかりません`
**原因**: システム管理者が作成されていない
**解決方法**:
```sql
-- Supabase SQL Editorで実行
DELETE FROM system_admins WHERE username = 'admin';

INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

#### エラー4: `パスワードが正しくありません`
**原因**: パスワードが間違っている
**解決方法**:
- パスワードが `admin123` であることを確認
- 大文字・小文字、スペースに注意
- 必要に応じてパスワードをリセット

### ステップ4: Supabaseのログを確認

1. Supabaseダッシュボードにログイン
2. 「Logs」→ 「Postgres Logs」を確認
3. エラーメッセージを確認

### ステップ5: データベースを直接確認

SupabaseのSQL Editorで以下を実行：

```sql
-- 1. テーブルが存在するか確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- 2. システム管理者が存在するか確認
SELECT username, name, email, created_at 
FROM system_admins 
WHERE username = 'admin';

-- 3. すべてのシステム管理者を確認
SELECT * FROM system_admins;
```

## 🛠️ よくある問題と解決方法

### 問題1: 環境変数が設定されていない

**症状**: `Missing Supabase environment variables` エラー

**解決方法**:
1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下を確認・設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. 新しいデプロイを実行

### 問題2: テーブルが存在しない

**症状**: `システム管理者テーブルが存在しません` エラー

**解決方法**:
```sql
-- Supabase SQL Editorで実行
-- supabase/migration_add_system_admin_complete.sql の内容を実行
```

### 問題3: システム管理者が存在しない

**症状**: `ユーザー名が見つかりません` エラー

**解決方法**:
```sql
-- Supabase SQL Editorで実行
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### 問題4: パスワードが間違っている

**症状**: `パスワードが正しくありません` エラー

**解決方法**:
1. パスワードが `admin123` であることを確認
2. 必要に応じてパスワードをリセット：

```sql
-- 新しいパスワードのbcryptハッシュを生成（Node.jsで実行）
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('新しいパスワード', 10).then(hash => console.log(hash));

-- Supabase SQL Editorで実行
UPDATE system_admins 
SET password_hash = '生成したbcryptハッシュ'
WHERE username = 'admin';
```

## 📝 エラーメッセージの見方

### エラーレスポンスの構造

```json
{
  "error": "エラーメッセージ",
  "details": "詳細情報（オプション）",
  "code": "エラーコード（オプション）"
}
```

### ステータスコードの意味

- **400**: リクエストが不正（ユーザー名またはパスワードが空）
- **401**: 認証エラー（ユーザー名またはパスワードが間違っている）
- **404**: リソースが見つからない（ユーザー名が見つからない）
- **500**: サーバーエラー（データベースエラー、環境変数エラーなど）

## 🆘 それでも解決しない場合

以下の情報を収集してください：

1. **ブラウザのコンソールエラー**
   - 完全なエラーメッセージ
   - スタックトレース（あれば）

2. **ネットワークタブのレスポンス**
   - ステータスコード
   - レスポンスボディの内容

3. **Vercelの関数ログ**
   - 最新のデプロイのログ
   - `/api/auth/system-admin/login` のログ

4. **Supabaseのログ**
   - Postgres Logs
   - エラーメッセージ

これらの情報を元に、さらに詳しく調査できます。

