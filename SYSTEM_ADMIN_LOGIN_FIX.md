# システム管理者ログインエラーの解決方法

## 🔍 エラー: 「ユーザー名またはパスワードが正しくありません」

システム管理者ログインページでこのエラーが表示される場合の対処法です。

## 📋 確認手順

### 1. データベースにシステム管理者が存在するか確認

SupabaseのSQL Editorで以下を実行：

```sql
-- システム管理者一覧を確認
SELECT username, name, email FROM system_admins;
```

**結果が空の場合**: システム管理者が作成されていません

### 2. システム管理者を再作成

SupabaseのSQL Editorで以下を実行：

```sql
-- supabase/fix_system_admin.sql の内容を実行
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
```

### 3. ログイン情報を確認

**デフォルトのログイン情報**:
- **URL**: `/system-admin/login`
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

### 4. パスワードをリセット（必要に応じて）

新しいパスワードのbcryptハッシュを生成（Node.jsで実行）：

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('新しいパスワード', 10).then(hash => console.log(hash));
```

生成したハッシュで更新：

```sql
UPDATE system_admins 
SET password_hash = '生成したbcryptハッシュ'
WHERE username = 'admin';
```

## 🛠️ よくある原因と解決方法

### 原因1: システム管理者が存在しない

**症状**: エラーメッセージが表示される

**解決方法**:
1. `supabase/fix_system_admin.sql` を実行
2. または、`supabase/migration_add_system_admin_complete.sql` を実行

### 原因2: パスワードが間違っている

**症状**: エラーメッセージが表示される

**解決方法**:
- パスワードが `admin123` であることを確認
- 大文字・小文字、スペースに注意
- 必要に応じてパスワードをリセット

### 原因3: データベース接続エラー

**症状**: エラーメッセージが表示される、またはページが読み込めない

**解決方法**:
1. Vercelの環境変数を確認：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Supabaseのプロジェクトがアクティブか確認
3. Service Role Keyが正しいか確認

### 原因4: テーブルが存在しない

**症状**: 「システム管理者テーブルが存在しません」というエラー

**解決方法**:
1. `supabase/migration_add_system_admin_complete.sql` を実行
2. または、`supabase/schema.sql` を実行してから `migration_add_system_admin.sql` を実行

## 🔍 デバッグ方法

### 1. ブラウザのコンソールを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを確認
3. エラーメッセージを確認

### 2. ネットワークタブを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のリクエストを確認
5. レスポンスの内容を確認

### 3. Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」→ 最新のデプロイ → 「Functions」タブ
4. `/api/auth/system-admin/login` のログを確認

ログに以下のような情報が表示されます：
- `Login attempt for username: admin`
- `Admin found: admin` または `Admin not found`
- `Invalid password` または `Supabase query error`

### 4. Supabaseのログを確認

1. Supabaseダッシュボードにログイン
2. 「Logs」→ 「Postgres Logs」を確認
3. エラーメッセージを確認

## ✅ 確認チェックリスト

- [ ] データベースにシステム管理者が存在する
- [ ] ユーザー名が `admin` である
- [ ] パスワードが `admin123` である
- [ ] Vercelの環境変数が正しく設定されている
- [ ] Supabaseのプロジェクトがアクティブ
- [ ] `system_admins` テーブルが存在する
- [ ] ブラウザのコンソールにエラーがない

## 🚀 クイックフィックス

最も簡単な解決方法：

1. **SupabaseのSQL Editorを開く**
2. **以下を実行**:

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

3. **ログインを再試行**:
   - ユーザー名: `admin`
   - パスワード: `admin123`

## 🆘 それでも解決しない場合

1. **Vercelのログを確認**
   - エラーメッセージの詳細を確認

2. **Supabaseのログを確認**
   - データベースクエリのエラーを確認

3. **エラーメッセージを記録**
   - ブラウザのコンソールエラー
   - ネットワークタブのエラーレスポンス
   - Vercelの関数ログ

これらの情報を元に、さらに詳しく調査できます。

