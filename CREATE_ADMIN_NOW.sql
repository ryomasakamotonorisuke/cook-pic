-- システム管理者（admin）を今すぐ作成する
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: テーブルが存在するか確認
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- ============================================
-- ステップ2: 既存のadminユーザーを削除（存在する場合）
-- ============================================
DELETE FROM system_admins WHERE username = 'admin';

-- ============================================
-- ステップ3: 新しいadminユーザーを作成
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
-- ステップ4: 確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 正しい長さ'
    ELSE '❌ 長さが間違っています'
  END AS length_check,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 正しい形式'
    ELSE '❌ 形式が間違っています'
  END AS format_check,
  created_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ5: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  
  IF admin_exists THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ システム管理者（admin）を作成しました！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ログイン情報:';
    RAISE NOTICE '  URL: /system-admin/login';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'これでログインできるようになりました！';
  ELSE
    RAISE NOTICE '❌ システム管理者の作成に失敗しました。';
    RAISE NOTICE 'テーブルが存在しない可能性があります。';
    RAISE NOTICE 'COMPLETE_RESET.sql を実行してください。';
  END IF;
END $$;

