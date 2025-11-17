# 1から確認するデバッグ手順

## 📋 このガイドの使い方

このガイドに従って、**1つずつ**確認してください。各ステップで問題が見つかった場合は、そのステップで止まって解決してください。

---

## ステップ1: データベースにテーブルが存在するか確認

### 確認方法

SupabaseのSQL Editorで以下を実行：

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;
```

### 期待される結果

```
table_exists: true
```

### 問題がある場合

**結果が `false` の場合**:
- `supabase/COMPLETE_RESET.sql` を実行してください
- または `supabase/migration_add_system_admin_complete.sql` を実行してください

---

## ステップ2: システム管理者が存在するか確認

### 確認方法

```sql
SELECT 
  id,
  username, 
  name,
  email
FROM system_admins 
WHERE username = 'admin';
```

### 期待される結果

1行の結果が表示される：
- `username`: `admin`
- `name`: `システム管理者` または類似の値
- `email`: `admin@pic-cul.com` または類似の値

### 問題がある場合

**結果が空の場合**:
```sql
-- システム管理者を作成
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

---

## ステップ3: パスワードハッシュが正しいか確認

### 確認方法

```sql
SELECT 
  username,
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start
FROM system_admins 
WHERE username = 'admin';
```

### 期待される結果

- `hash_length`: **60**（重要！）
- `hash_start`: **`$2a$10$`** で始まる（重要！）

### 問題がある場合

**`hash_length` が 60 でない場合**:
```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

**`hash_start` が `$2a$10$` で始まらない場合**:
```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

---

## ステップ4: 環境変数が設定されているか確認

### 確認方法

Vercelダッシュボードで確認：

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下が設定されているか確認：
   - `NEXT_PUBLIC_SUPABASE_URL` - 値が設定されている
   - `SUPABASE_SERVICE_ROLE_KEY` - 値が設定されている

### 期待される結果

両方の環境変数が設定されている

### 問題がある場合

**環境変数が設定されていない場合**:
- Supabaseダッシュボードから値を取得
- Vercelの環境変数に設定
- 新しいデプロイを実行

---

## ステップ5: ブラウザのコンソールでエラーを確認

### 確認方法

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. `/system-admin/login` にアクセス
4. ユーザー名: `admin`、パスワード: `admin123` を入力
5. 「ログイン」をクリック
6. コンソールに表示されるログを確認

### 確認すべきログ

以下のログが表示されるはずです：

```
=== System Admin Login Attempt ===
Username: admin
Password provided: ***
Supabase URL: Set
Service Role Key: Set
Querying system_admins table for username: admin
Admin found: admin システム管理者
Password hash length: 60
Starting bcrypt.compare...
Password comparison result: true
```

### 問題がある場合

**`Supabase URL: Missing` または `Service Role Key: Missing` と表示される場合**:
- ステップ4に戻って環境変数を確認

**`Admin found` が表示されない場合**:
- ステップ2に戻ってシステム管理者が存在するか確認

**`Password hash length: 60` でない場合**:
- ステップ3に戻ってパスワードハッシュを確認

**`Password comparison result: false` と表示される場合**:
- ステップ3に戻ってパスワードハッシュをリセット

---

## ステップ6: ネットワークタブでレスポンスを確認

### 確認方法

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のリクエストをクリック
5. 「Response」タブでレスポンスを確認

### 期待される結果（成功時）

```json
{
  "token": "...",
  "admin": {
    "id": "...",
    "username": "admin",
    "name": "システム管理者",
    "email": "admin@pic-cul.com"
  }
}
```

### 問題がある場合

**401エラーの場合**:
- レスポンスボディに `debug` フィールドが含まれているか確認
- `debug.hashLength` が `60` であるか確認
- `debug.testWithAdmin123` が `true` であるか確認

**500エラーの場合**:
- エラーメッセージを確認
- ステップ1-4に戻って確認

---

## ステップ7: ログイン情報を確認

### 確認事項

- **URL**: `/system-admin/login`（正確に）
- **ユーザー名**: `admin`（**大文字・小文字を正確に**、スペースなし）
- **パスワード**: `admin123`（**スペースなし**）

### よくある間違い

- ユーザー名にスペースが含まれている
- パスワードにスペースが含まれている
- 大文字・小文字が間違っている（`Admin` ではなく `admin`）

---

## 📝 チェックリスト

各ステップを確認して、チェックを入れましょう：

- [ ] ステップ1: テーブルが存在する
- [ ] ステップ2: システム管理者が存在する
- [ ] ステップ3: パスワードハッシュが正しい（長さ60、`$2a$10$`で始まる）
- [ ] ステップ4: 環境変数が設定されている
- [ ] ステップ5: ブラウザのコンソールにエラーがない
- [ ] ステップ6: ネットワークタブでレスポンスを確認
- [ ] ステップ7: ログイン情報が正しい

---

## 🆘 各ステップで問題が見つかった場合

### ステップ1で問題がある場合

```sql
-- COMPLETE_RESET.sql を実行
```

### ステップ2で問題がある場合

```sql
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### ステップ3で問題がある場合

```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

### ステップ4で問題がある場合

- Vercelの環境変数を設定
- 新しいデプロイを実行

### ステップ5-7で問題がある場合

- 上記のステップ1-4を再確認
- ブラウザのキャッシュをクリア
- ページをリロード

---

## 📊 問題の報告方法

問題が見つかった場合、以下の情報を共有してください：

1. **どのステップで問題が見つかったか**
2. **ステップの確認結果**（SQLの結果、コンソールのログなど）
3. **エラーメッセージ**（あれば）

これらの情報を元に、さらに詳しく調査できます。

