# 401エラーの詳細確認手順

## 🔍 現在の状況

`POST /api/auth/system-admin/login 401 (Unauthorized)` エラーが発生しています。

## 📋 確認手順

### ステップ1: ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のリクエストをクリック
5. 「Response」タブを開く
6. **レスポンスボディの内容をコピーしてください**

レスポンスは以下のような形式になっているはずです：

```json
{
  "error": "エラーメッセージ",
  "details": "詳細情報"
}
```

### ステップ2: データベースを確認

SupabaseのSQL Editorで以下を実行：

```sql
-- システム管理者が存在するか確認
SELECT username, name, email, created_at 
FROM system_admins 
WHERE username = 'admin';
```

**結果が空の場合**: システム管理者が作成されていません

### ステップ3: システム管理者を作成

SupabaseのSQL Editorで以下を実行：

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
SELECT username, name FROM system_admins WHERE username = 'admin';
```

### ステップ4: Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」→ 最新のデプロイ → 「Functions」タブ
4. `/api/auth/system-admin/login` のログを確認

以下のようなログが表示されるはずです：

```
=== System Admin Login Attempt ===
Username: admin
Password provided: ***
Supabase URL: Set / Missing
Service Role Key: Set / Missing
Querying system_admins table for username: admin
```

## 🛠️ よくある原因

### 原因1: システム管理者が存在しない

**症状**: 401エラー、レスポンスに「ユーザー名が見つかりません」

**解決方法**:
```sql
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### 原因2: パスワードが間違っている

**症状**: 401エラー、レスポンスに「パスワードが正しくありません」

**解決方法**:
- パスワードが `admin123` であることを確認
- 必要に応じてパスワードをリセット

### 原因3: 環境変数が設定されていない

**症状**: 500エラー、レスポンスに「Supabase環境変数が設定されていません」

**解決方法**:
- Vercelの環境変数を確認
- `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を設定

## 📝 次のステップ

1. **ネットワークタブのレスポンスボディを確認**
   - エラーメッセージの内容を確認
   - `error` と `details` フィールドを確認

2. **データベースを確認**
   - システム管理者が存在するか確認
   - 存在しない場合は作成

3. **Vercelのログを確認**
   - サーバー側のログを確認
   - エラーの詳細を確認

これらの情報を元に、問題を特定できます。

