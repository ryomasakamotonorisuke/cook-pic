# システム管理者ログイン問題の根本的解決方法

## 🎯 目標

システム管理者のログイン機能を一から再構築し、確実に動作するようにします。

## 📋 完全な解決手順

### ステップ1: データベースを完全にリセット

SupabaseのSQL Editorで以下を実行：

```sql
-- supabase/COMPLETE_RESET.sql の内容を実行
```

このSQLファイルは以下を実行します：
1. 既存のシステム管理者データを削除
2. テーブルを再作成
3. インデックスとRLSポリシーを設定
4. デフォルトのシステム管理者を作成

### ステップ2: 実行結果を確認

SQL Editorで以下のメッセージが表示されることを確認：

```
✅ システム管理者機能のリセットが完了しました！
📋 ログイン情報:
  URL: /system-admin/login
  ユーザー名: admin
  パスワード: admin123
```

### ステップ3: データベースの状態を確認

```sql
-- システム管理者が正しく作成されたか確認
SELECT 
  username, 
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE username = 'admin';
```

**期待される結果**:
- `username`: `admin`
- `hash_length`: `60`
- `hash_preview`: `$2a$10$TfL2YgEWStCa.70GOP75Se`

### ステップ4: ブラウザのキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. 「Application」タブを開く
3. 「Storage」→「Clear site data」をクリック
4. すべてのチェックボックスにチェックを入れる
5. 「Clear site data」をクリック
6. ページをリロード（Ctrl+F5 または Cmd+Shift+R）

### ステップ5: ログインを試す

1. `/system-admin/login` にアクセス
2. ユーザー名に `admin` を入力（**正確に**）
3. パスワードに `admin123` を入力（**スペースなし**）
4. 「ログイン」をクリック

## 🔍 トラブルシューティング

### 問題1: まだログインできない

#### 確認1: データベースの状態

```sql
SELECT 
  username,
  LENGTH(password_hash) AS len,
  LEFT(password_hash, 30) AS preview
FROM system_admins 
WHERE username = 'admin';
```

- `len` が `60` でない場合 → `COMPLETE_RESET.sql` を再実行
- `preview` が `$2a$10$...` で始まらない場合 → `COMPLETE_RESET.sql` を再実行

#### 確認2: ブラウザのコンソール

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. エラーメッセージを確認

**確認すべき情報**:
- `=== Login Error ===`
- `Error response:` の内容

#### 確認3: ネットワークタブ

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` をクリック
5. 「Response」タブでレスポンスを確認

**確認すべき情報**:
- ステータスコード（401, 404, 500など）
- レスポンスボディの内容

### 問題2: 環境変数が設定されていない

Vercelの環境変数を確認：

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下が設定されているか確認：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 問題3: パスワードが間違っている

パスワードを再確認：

- ユーザー名: `admin`（**大文字・小文字を正確に**）
- パスワード: `admin123`（**スペースなし**）

## ✅ 確認チェックリスト

- [ ] `COMPLETE_RESET.sql` を実行した
- [ ] テーブルが作成された（`SELECT * FROM system_admins;` で確認）
- [ ] システム管理者が作成された（`username = 'admin'`）
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ブラウザのキャッシュをクリアした
- [ ] ページをリロードした
- [ ] ユーザー名が `admin` である（正確に）
- [ ] パスワードが `admin123` である（スペースなし）
- [ ] Vercelの環境変数が設定されている

## 🆘 それでも解決しない場合

### 1. 完全なログを収集

以下の情報を収集してください：

1. **データベースの状態**
   ```sql
   SELECT * FROM system_admins WHERE username = 'admin';
   ```

2. **ブラウザのコンソールエラー**
   - `Error response:` の内容

3. **ネットワークタブのレスポンス**
   - `/api/auth/system-admin/login` のレスポンスボディ

4. **Vercelの環境変数**
   - `NEXT_PUBLIC_SUPABASE_URL` が設定されているか
   - `SUPABASE_SERVICE_ROLE_KEY` が設定されているか

### 2. 手動でパスワードをリセット

```sql
-- パスワードをリセット
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';

-- 確認
SELECT username, LENGTH(password_hash) AS len FROM system_admins WHERE username = 'admin';
```

これらの情報を元に、さらに詳しく調査できます。

