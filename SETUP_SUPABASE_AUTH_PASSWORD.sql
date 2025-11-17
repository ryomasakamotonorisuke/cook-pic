-- Supabase Authで作成したパスワードをsystem_adminsテーブルに設定
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
-- 注意: このハッシュは後で生成したものに置き換えてください
-- ============================================
-- UPDATE system_admins 
-- SET 
--   password_hash = '生成したbcryptハッシュをここに貼り付ける',
--   updated_at = NOW()
-- WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ3: 確認
-- ============================================
-- SELECT 
--   username,
--   LENGTH(password_hash) AS hash_length,
--   LEFT(password_hash, 30) AS preview
-- FROM system_admins 
-- WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

