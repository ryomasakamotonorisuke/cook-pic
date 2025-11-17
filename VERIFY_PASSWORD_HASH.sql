-- パスワードハッシュの検証と修正
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在の状態を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 正しい長さ'
    ELSE '❌ 長さが間違っています（60文字である必要があります）'
  END AS length_check,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 正しい形式'
    WHEN password_hash LIKE '$2b$10$%' THEN '✅ 正しい形式（$2b$）'
    ELSE '❌ 形式が間違っています（$2a$10$...または$2b$10$...で始まる必要があります）'
  END AS format_check,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ2: パスワードハッシュを修正
-- パスワード: admin123
-- ============================================
UPDATE system_admins 
SET 
  password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  updated_at = NOW()
WHERE username = 'admin';

-- ============================================
-- ステップ3: 修正後の確認
-- ============================================
SELECT 
  username, 
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 AND password_hash LIKE '$2a$10$%' THEN '✅ 正しく設定されました'
    ELSE '❌ 設定に問題があります'
  END AS verification_status
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ4: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  hash_length INTEGER;
  hash_format BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  
  IF admin_exists THEN
    SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
    SELECT password_hash LIKE '$2a$10$%' OR password_hash LIKE '$2b$10$%' INTO hash_format FROM system_admins WHERE username = 'admin';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ パスワードハッシュを修正しました！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ログイン情報:';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 パスワードハッシュ情報:';
    RAISE NOTICE '  長さ: % 文字', hash_length;
    IF hash_length = 60 THEN
      RAISE NOTICE '  ✅ パスワードハッシュの長さは正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
      RAISE NOTICE '  ⚠️ COMPLETE_RESET.sql を実行してください';
    END IF;
    
    IF hash_format THEN
      RAISE NOTICE '  ✅ パスワードハッシュの形式は正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの形式が正しくありません';
      RAISE NOTICE '  ⚠️ COMPLETE_RESET.sql を実行してください';
    END IF;
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '❌ システム管理者が見つかりませんでした。';
    RAISE NOTICE '⚠️ COMPLETE_RESET.sql を実行してください。';
  END IF;
END $$;

