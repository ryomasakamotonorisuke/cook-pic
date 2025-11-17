# エラー「relation "system_admins" does not exist」の解決方法

## 🔍 問題

`system_admins`テーブルが存在しないため、エラーが発生しています。

## 🛠️ 解決方法

### ステップ1: SupabaseのSQL Editorを開く

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 「SQL Editor」を開く

### ステップ2: テーブルと管理者アカウントを作成

`supabase/CREATE_TABLE_AND_ADMIN.sql` の内容をコピー＆ペーストして実行してください。

または、以下を直接実行：

```sql
-- 1. updated_atを自動更新する関数を作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. システム管理者テーブルを作成
CREATE TABLE IF NOT EXISTS system_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. インデックスを作成
CREATE INDEX IF NOT EXISTS idx_system_admins_username ON system_admins(username);

-- 4. Row Level Security (RLS) ポリシー
ALTER TABLE system_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System admins can read all system_admins" ON system_admins;
DROP POLICY IF EXISTS "System admins can manage system_admins" ON system_admins;

CREATE POLICY "System admins can read all system_admins" ON system_admins
  FOR SELECT USING (true);

CREATE POLICY "System admins can manage system_admins" ON system_admins
  FOR ALL USING (true);

-- 5. トリガーを設定
DROP TRIGGER IF EXISTS update_system_admins_updated_at ON system_admins;
CREATE TRIGGER update_system_admins_updated_at BEFORE UPDATE ON system_admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. adminユーザーを作成（パスワード: admin123）
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- 7. 確認
SELECT 
  username, 
  name,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE username = 'admin';
```

### ステップ3: 確認

実行後、以下を確認してください：
- エラーが表示されないこと
- `hash_length` が `60` であること
- `hash_preview` が `$2a$10$TfL2YgEWStCa.70GOP75Se...` で始まること

### ステップ4: ログインを再試行

- URL: `/system-admin/login`
- ユーザー名: `admin`
- パスワード: `admin123`

## ✅ 確認方法

テーブルが作成されたか確認：

```sql
-- テーブルが存在するか確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- システム管理者が存在するか確認
SELECT username, name, email FROM system_admins WHERE username = 'admin';
```

## 🆘 それでも解決しない場合

1. **エラーメッセージを確認**
   - SQL Editorでエラーメッセージを確認
   - どの行でエラーが発生したか確認

2. **段階的に実行**
   - 一度にすべてを実行せず、ステップごとに実行
   - 各ステップでエラーが出ないか確認

3. **Supabaseのログを確認**
   - Supabaseダッシュボードの「Logs」を確認
   - エラーメッセージを確認

