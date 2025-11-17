-- 新しく作成されたシステム管理者の修正
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在のシステム管理者を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  created_at,
  updated_at
FROM system_admins;

-- ============================================
-- ステップ2: 新しい管理者のパスワードを設定
-- UID: 166d3617-5f9b-4055-9149-32e13e7ca58a
-- ユーザー名: admin@admin
-- パスワード: admin123
-- ============================================
UPDATE system_admins 
SET 
  password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  updated_at = NOW()
WHERE id = '166d3617-5f9b-4055-9149-32e13e7ca58a';

-- ============================================
-- ステップ3: 確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 正しい長さ'
    ELSE '❌ 長さが間違っています'
  END AS hash_length_check,
  updated_at
FROM system_admins 
WHERE id = '166d3617-5f9b-4055-9149-32e13e7ca58a';

-- ============================================
-- ステップ4: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  admin_username VARCHAR;
  hash_length INTEGER;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE id = '166d3617-5f9b-4055-9149-32e13e7ca58a') INTO admin_exists;
  SELECT username INTO admin_username FROM system_admins WHERE id = '166d3617-5f9b-4055-9149-32e13e7ca58a';
  SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE id = '166d3617-5f9b-4055-9149-32e13e7ca58a';
  
  IF admin_exists THEN
    RAISE NOTICE '✅ システム管理者のパスワードを設定しました！';
    RAISE NOTICE '';
    RAISE NOTICE 'ログイン情報:';
    RAISE NOTICE '  ユーザー名: %', admin_username;
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'パスワードハッシュ情報:';
    RAISE NOTICE '  長さ: % 文字', hash_length;
    IF hash_length = 60 THEN
      RAISE NOTICE '  ✅ パスワードハッシュの長さは正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
  ELSE
    RAISE NOTICE '❌ 指定されたUIDのシステム管理者が見つかりませんでした。';
  END IF;
END $$;

