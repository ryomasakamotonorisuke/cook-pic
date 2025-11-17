# 新しいパスワードでログインする方法

## 🔍 新しい管理者の情報

- **UID**: `c096fc40-82c0-4051-bc4a-b9ed2404c1b0`
- **Email**: `admin@admin.com`
- **パスワード**: `Sys%ngf6299!`

## 🛠️ パスワードを設定する

### ステップ1: SupabaseのSQL Editorを開く

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 「SQL Editor」を開く

### ステップ2: パスワードハッシュを設定

`SETUP_NEW_ADMIN_PASSWORD.sql` の内容を実行してください。

または、直接実行：

```sql
-- パスワードハッシュを設定（パスワード: Sys%ngf6299!）
UPDATE system_admins 
SET 
  password_hash = '$2a$10$1IEZIpeKVXxTdW2L0d75Iev06/NW3WjdsV65mGSrqEelD1mERI3W2',
  updated_at = NOW()
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- 確認
SELECT 
  username,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### ステップ3: ユーザー名を確認（重要）

```sql
SELECT username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

**重要**: ログイン時に使用するユーザー名を確認してください。

## ✅ ログイン方法

### ステップ1: ログインページにアクセス

- URL: `/system-admin/login`

### ステップ2: ログイン情報を入力

- **ユーザー名**: ステップ3で確認したユーザー名（`username`フィールドの値）
- **パスワード**: `Sys%ngf6299!`

### ステップ3: ログインを試す

「ログイン」をクリック

## 🔍 確認方法

パスワードハッシュが正しく設定されたか確認：

```sql
SELECT 
  username,
  LENGTH(password_hash) AS len,
  LEFT(password_hash, 30) AS preview
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

**期待される結果**:
- `len`: `60`
- `preview`: `$2a$10$1IEZIpeKVXxTdW2L0d75Iev...`

## ⚠️ 重要な注意事項

1. **ユーザー名を確認**: ログインAPIは`username`フィールドで検索します。ユーザー名が`admin`でない場合、ログイン時にそのユーザー名を使用してください。

2. **パスワード**: `Sys%ngf6299!`（**正確に**、大文字・小文字、記号を含む）

3. **Supabase Authとの違い**: 
   - Supabase Authで作成したユーザーと`system_admins`テーブルのユーザーは別物です
   - 現在のログインAPIは`system_admins`テーブルを使用しています
   - Supabase Authのユーザーでログインするには、APIを変更する必要があります

## 📝 確認チェックリスト

- [ ] `SETUP_NEW_ADMIN_PASSWORD.sql` を実行した
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ユーザー名を確認した
- [ ] ログイン時に正しいユーザー名を使用している
- [ ] パスワードが `Sys%ngf6299!` である（正確に）

## 🆘 それでもログインできない場合

### 1. ユーザー名を確認

```sql
SELECT username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### 2. ブラウザのコンソールでエラーを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. エラーメッセージを確認

### 3. ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のレスポンスを確認

