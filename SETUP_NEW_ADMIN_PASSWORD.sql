-- 新しいシステム管理者のパスワードを設定
-- パスワード: Sys%ngf6299!
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在の状態を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  created_at,
  updated_at
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ2: パスワードハッシュを設定
-- パスワード: Sys%ngf6299!
-- ============================================
UPDATE system_admins 
SET 
  password_hash = '$2a$10$1IEZIpeKVXxTdW2L0d75Iev06/NW3WjdsV65mGSrqEelD1mERI3W2',
  updated_at = NOW()
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ3: 確認
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
  updated_at
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ4: ユーザー名を確認（重要）
-- ============================================
SELECT 
  username,
  name,
  email
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ5: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  admin_username VARCHAR;
  hash_length INTEGER;
  hash_format BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0') INTO admin_exists;
  SELECT username INTO admin_username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  SELECT password_hash LIKE '$2a$10$%' OR password_hash LIKE '$2b$10$%' INTO hash_format FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  
  IF admin_exists THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ 新しいシステム管理者のパスワードを設定しました！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ログイン情報:';
    RAISE NOTICE '  URL: /system-admin/login';
    RAISE NOTICE '  ユーザー名: %', admin_username;
    RAISE NOTICE '  パスワード: Sys%ngf6299!';
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
    RAISE NOTICE '⚠️ ログイン時に使用するユーザー名: %', admin_username;
  ELSE
    RAISE NOTICE '❌ 指定されたUIDのシステム管理者が見つかりませんでした。';
  END IF;
END $$;

