-- パスワードハッシュを確認して修正する
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在のパスワードハッシュを確認
-- ============================================
SELECT 
  username,
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start,
  LEFT(password_hash, 30) AS hash_preview,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 長さは正しい'
    ELSE '❌ 長さが間違っています（' || LENGTH(password_hash) || '文字）'
  END AS length_status,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 形式は正しい'
    WHEN password_hash LIKE '$2b$10$%' THEN '✅ 形式は正しい（$2b$）'
    ELSE '❌ 形式が間違っています'
  END AS format_status
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ2: パスワードハッシュを強制的にリセット
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
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 AND password_hash LIKE '$2a$10$%' THEN '✅ 正しく設定されました'
    ELSE '❌ 設定に問題があります'
  END AS verification_status,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ4: 成功メッセージ
-- ============================================
DO $$
DECLARE
  hash_length INTEGER;
  hash_format BOOLEAN;
BEGIN
  SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
  SELECT password_hash LIKE '$2a$10$%' OR password_hash LIKE '$2b$10$%' INTO hash_format FROM system_admins WHERE username = 'admin';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ パスワードハッシュをリセットしました！';
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
  END IF;
  
  IF hash_format THEN
    RAISE NOTICE '  ✅ パスワードハッシュの形式は正しいです';
  ELSE
    RAISE NOTICE '  ❌ パスワードハッシュの形式が正しくありません';
  END IF;
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ ブラウザのキャッシュをクリアしてからログインを試してください。';
END $$;

