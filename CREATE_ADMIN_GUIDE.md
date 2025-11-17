# システム管理者（admin）を作成する方法

## 🔍 現在の状況

Supabase上に `admin` ユーザーが存在しないため、ログインできません。

**これは問題です。** システム管理者を作成する必要があります。

## 🛠️ 解決方法

### 方法1: 簡単な方法（推奨）

SupabaseのSQL Editorで以下を実行：

```sql
-- CREATE_ADMIN_NOW.sql の内容を実行
```

または、直接実行：

```sql
-- adminユーザーを作成（パスワード: admin123）
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

### 方法2: テーブルも作成する場合

テーブルが存在しない場合は、以下を実行：

```sql
-- COMPLETE_RESET.sql の内容を実行
```

これにより、テーブルとadminユーザーの両方が作成されます。

## ✅ 確認方法

### ステップ1: adminが作成されたか確認

```sql
SELECT 
  username, 
  name,
  email,
  created_at
FROM system_admins 
WHERE username = 'admin';
```

**期待される結果**:
- 1行の結果が表示される
- `username`: `admin`
- `name`: `システム管理者`

### ステップ2: パスワードハッシュが正しいか確認

```sql
SELECT 
  username,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start
FROM system_admins 
WHERE username = 'admin';
```

**期待される結果**:
- `hash_length`: `60`
- `hash_start`: `$2a$10$`

### ステップ3: ログインを試す

1. `/system-admin/login` にアクセス
2. ユーザー名: `admin`
3. パスワード: `admin123`
4. 「ログイン」をクリック

## 📋 手順まとめ

1. **SupabaseのSQL Editorを開く**
2. **`CREATE_ADMIN_NOW.sql` を実行**
3. **確認メッセージが表示されることを確認**
4. **ログインを試す**

## 🆘 エラーが出る場合

### エラー: "relation "system_admins" does not exist"

**原因**: テーブルが存在しない

**解決方法**:
```sql
-- COMPLETE_RESET.sql を実行
```

### エラー: "duplicate key value violates unique constraint"

**原因**: adminユーザーが既に存在する

**解決方法**:
```sql
-- 既存のadminを削除してから再作成
DELETE FROM system_admins WHERE username = 'admin';

INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

## ✅ 確認チェックリスト

- [ ] `CREATE_ADMIN_NOW.sql` を実行した
- [ ] adminユーザーが作成された（`SELECT * FROM system_admins WHERE username = 'admin';` で確認）
- [ ] パスワードハッシュの長さが60文字である
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ログインを試した

## 📝 ログイン情報

作成後、以下の情報でログインできます：

- **URL**: `/system-admin/login`
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

---

**重要**: adminユーザーが存在しないと、ログインできません。必ず作成してください。

