-- システム管理者機能の完全なリセットと再構築
-- このファイルをSupabaseのSQL Editorで実行してください
-- ⚠️ 注意: 既存のシステム管理者データが削除されます

-- ============================================
-- ステップ1: 既存のデータを完全に削除
-- ============================================

-- 既存のシステム管理者を削除
DELETE FROM system_admins WHERE username = 'admin' OR username = 'admin@admin';

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS update_system_admins_updated_at ON system_admins;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "System admins can read all system_admins" ON system_admins;
DROP POLICY IF EXISTS "System admins can manage system_admins" ON system_admins;

-- テーブルを削除（存在する場合）
DROP TABLE IF EXISTS system_admins CASCADE;

-- ============================================
-- ステップ2: updated_atを自動更新する関数を作成
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ステップ3: システム管理者テーブルを作成
-- ============================================

CREATE TABLE system_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ステップ4: インデックスを作成
-- ============================================

CREATE INDEX idx_system_admins_username ON system_admins(username);

-- ============================================
-- ステップ5: Row Level Security (RLS) ポリシー
-- ============================================

ALTER TABLE system_admins ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "System admins can read all system_admins" ON system_admins
  FOR SELECT USING (true);

-- 全員が管理可能（サービスロールキーを使用するため）
CREATE POLICY "System admins can manage system_admins" ON system_admins
  FOR ALL USING (true);

-- ============================================
-- ステップ6: トリガーを設定
-- ============================================

CREATE TRIGGER update_system_admins_updated_at BEFORE UPDATE ON system_admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ステップ7: デフォルトのシステム管理者を作成
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
-- ステップ8: 確認と検証
-- ============================================

-- テーブルが作成されたか確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- システム管理者が作成されたか確認
SELECT 
  id,
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 正しい長さ'
    ELSE '❌ 長さが間違っています（60文字である必要があります）'
  END AS hash_length_check,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 正しい形式'
    ELSE '❌ 形式が間違っています'
  END AS hash_format_check,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ9: 成功メッセージ
-- ============================================

DO $$
DECLARE
  table_exists BOOLEAN;
  admin_exists BOOLEAN;
  hash_length INTEGER;
  hash_format BOOLEAN;
BEGIN
  -- テーブルの存在確認
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'system_admins'
  ) INTO table_exists;
  
  -- システム管理者の存在確認
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  
  IF admin_exists THEN
    SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
    SELECT password_hash LIKE '$2a$10$%' INTO hash_format FROM system_admins WHERE username = 'admin';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ システム管理者機能のリセットが完了しました！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ログイン情報:';
    RAISE NOTICE '  URL: /system-admin/login';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 パスワードハッシュ情報:';
    RAISE NOTICE '  長さ: % 文字', hash_length;
    IF hash_length = 60 THEN
      RAISE NOTICE '  ✅ パスワードハッシュの長さは正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
    END IF;
    
    IF hash_format THEN
      RAISE NOTICE '  ✅ パスワードハッシュの形式は正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの形式が正しくありません（$2a$10$...で始まる必要があります）';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '❌ システム管理者アカウントの作成に失敗しました。';
  END IF;
END $$;

