# 詳細デバッグ手順 - なぜログインできないのか

## 🔍 段階的に確認する

### ステップ1: データベースの状態を完全に確認

SupabaseのSQL Editorで以下を実行：

```sql
-- 1. adminユーザーが存在するか確認
SELECT 
  id,
  username, 
  name,
  email,
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';
```

**確認ポイント**:
- 結果が1行表示されるか
- `hash_length` が `60` であるか
- `hash_start` が `$2a$10$` で始まるか

**結果をコピーして共有してください**

### ステップ2: パスワードハッシュを強制的にリセット

```sql
-- パスワードハッシュを強制的にリセット
UPDATE system_admins 
SET 
  password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  updated_at = NOW()
WHERE username = 'admin';

-- 確認（必ず実行）
SELECT 
  username,
  password_hash,
  LENGTH(password_hash) AS len,
  LEFT(password_hash, 30) AS preview
FROM system_admins 
WHERE username = 'admin';
```

**確認ポイント**:
- `len` が `60` であること
- `preview` が `$2a$10$TfL2YgEWStCa.70GOP75Se` で始まること

### ステップ3: ブラウザのコンソールで詳細を確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. `/system-admin/login` にアクセス
4. ユーザー名: `admin`、パスワード: `admin123` を入力
5. 「ログイン」をクリック
6. **コンソールに表示されるすべてのログをコピー**

**特に確認すべきログ**:
- `=== System Admin Login Attempt ===`
- `Username:`
- `Admin found:`
- `Password hash length:`
- `Password comparison result:`
- `Test: Comparing "admin123" with stored hash:`

### ステップ4: ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` を**右クリック**
5. 「Copy」→「Copy response」を選択
6. **レスポンスの内容をコピー**

**確認すべき情報**:
- ステータスコード（401, 404, 500など）
- `error` フィールドの内容
- `details` フィールドの内容（あれば）
- `debug` フィールドの内容（あれば）

### ステップ5: 環境変数を確認

Vercelダッシュボードで確認：

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下が設定されているか確認：
   - `NEXT_PUBLIC_SUPABASE_URL` - 値が設定されているか
   - `SUPABASE_SERVICE_ROLE_KEY` - 値が設定されているか

## 📊 情報を収集してください

以下の情報を共有してください：

1. **ステップ1の結果**（SQLの実行結果）
2. **ステップ3のログ**（ブラウザのコンソール）
3. **ステップ4のレスポンス**（ネットワークタブ）
4. **ステップ5の結果**（環境変数が設定されているか）

## 🔍 よくある原因

### 原因1: パスワードハッシュが正しくない

**症状**: `Password comparison result: false`

**解決方法**:
```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

### 原因2: 環境変数が設定されていない

**症状**: `Supabase URL: Missing` または `Service Role Key: Missing`

**解決方法**: Vercelの環境変数を設定

### 原因3: ユーザー名が間違っている

**症状**: `Admin not found`

**解決方法**: データベースでユーザー名を確認

### 原因4: パスワードが間違っている

**症状**: `Password comparison result: false` だが、`Test: Comparing "admin123" with stored hash: true`

**解決方法**: パスワードが `admin123` であることを確認（スペースなし）

## 🆘 緊急時の完全リセット

すべてがうまくいかない場合：

```sql
-- 完全にリセット
DELETE FROM system_admins WHERE username = 'admin';

INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- 確認
SELECT username, LENGTH(password_hash) AS len FROM system_admins WHERE username = 'admin';
```

---

**次のステップ**: 上記の情報を収集して共有してください。原因を特定します。

