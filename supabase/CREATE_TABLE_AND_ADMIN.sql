-- システム管理者テーブルの作成と管理者アカウントの作成
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: updated_atを自動更新する関数を作成
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ステップ2: システム管理者テーブルを作成
-- ============================================
CREATE TABLE IF NOT EXISTS system_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ステップ3: インデックスを作成
-- ============================================
CREATE INDEX IF NOT EXISTS idx_system_admins_username ON system_admins(username);

-- ============================================
-- ステップ4: Row Level Security (RLS) ポリシー
-- ============================================
ALTER TABLE system_admins ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "System admins can read all system_admins" ON system_admins;
DROP POLICY IF EXISTS "System admins can manage system_admins" ON system_admins;

-- 新しいポリシーを作成
CREATE POLICY "System admins can read all system_admins" ON system_admins
  FOR SELECT USING (true);

CREATE POLICY "System admins can manage system_admins" ON system_admins
  FOR ALL USING (true);

-- ============================================
-- ステップ5: トリガーを設定
-- ============================================
DROP TRIGGER IF EXISTS update_system_admins_updated_at ON system_admins;
CREATE TRIGGER update_system_admins_updated_at BEFORE UPDATE ON system_admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ステップ6: 既存のadminユーザーを削除（存在する場合）
-- ============================================
DELETE FROM system_admins WHERE username = 'admin';

-- ============================================
-- ステップ7: 新しいadminユーザーを作成
-- パスワード: admin123
-- ============================================
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- ============================================
-- ステップ8: 確認
-- ============================================
SELECT 
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ9: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  hash_length INTEGER;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
  
  IF admin_exists THEN
    RAISE NOTICE '✅ システム管理者テーブルとアカウントを作成しました！';
    RAISE NOTICE '';
    RAISE NOTICE 'ログイン情報:';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'パスワードハッシュ情報:';
    RAISE NOTICE '  長さ: % 文字', hash_length;
    IF hash_length = 60 THEN
      RAISE NOTICE '  ✅ パスワードハッシュの長さは正しいです';
    ELSE
      RAISE NOTICE '  ⚠️ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
  ELSE
    RAISE NOTICE '❌ システム管理者アカウントの作成に失敗しました。';
  END IF;
END $$;

