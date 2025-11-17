-- デバッグ情報を収集するSQL
-- このファイルをSupabaseのSQL Editorで実行してください
-- 結果をコピーして共有してください

-- ============================================
-- 1. テーブルの存在確認
-- ============================================
SELECT 
  'テーブルの存在確認' AS check_item,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'system_admins'
  ) AS result;

-- ============================================
-- 2. adminユーザーの存在確認
-- ============================================
SELECT 
  'adminユーザーの存在確認' AS check_item,
  EXISTS (
    SELECT 1 FROM system_admins WHERE username = 'admin'
  ) AS result;

-- ============================================
-- 3. adminユーザーの詳細情報
-- ============================================
SELECT 
  'adminユーザーの詳細情報' AS check_item,
  id,
  username, 
  name,
  email,
  password_hash,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start,
  LEFT(password_hash, 30) AS hash_preview,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- 4. パスワードハッシュの検証
-- ============================================
SELECT 
  'パスワードハッシュの検証' AS check_item,
  username,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 長さは正しい（60文字）'
    ELSE '❌ 長さが間違っています（' || LENGTH(password_hash) || '文字）'
  END AS length_check,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 形式は正しい（$2a$10$...）'
    WHEN password_hash LIKE '$2b$10$%' THEN '✅ 形式は正しい（$2b$10$...）'
    ELSE '❌ 形式が間違っています（' || LEFT(password_hash, 10) || '...）'
  END AS format_check
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- 5. すべてのシステム管理者を確認
-- ============================================
SELECT 
  'すべてのシステム管理者' AS check_item,
  id,
  username,
  name,
  email,
  created_at
FROM system_admins
ORDER BY created_at DESC;

