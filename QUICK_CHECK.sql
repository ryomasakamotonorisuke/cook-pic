-- システム管理者ログイン問題のクイックチェック
-- このファイルをSupabaseのSQL Editorで実行してください
-- 各ステップの結果を確認してください

-- ============================================
-- チェック1: テーブルが存在するか
-- ============================================
SELECT 
  'チェック1: テーブルの存在確認' AS check_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'system_admins'
  ) AS result,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'system_admins'
    ) THEN '✅ テーブルが存在します'
    ELSE '❌ テーブルが存在しません → COMPLETE_RESET.sql を実行してください'
  END AS message;

-- ============================================
-- チェック2: システム管理者が存在するか
-- ============================================
SELECT 
  'チェック2: システム管理者の存在確認' AS check_name,
  EXISTS (
    SELECT 1 FROM system_admins WHERE username = 'admin'
  ) AS result,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM system_admins WHERE username = 'admin'
    ) THEN '✅ システム管理者が存在します'
    ELSE '❌ システム管理者が存在しません → システム管理者を作成してください'
  END AS message;

-- ============================================
-- チェック3: パスワードハッシュの確認
-- ============================================
SELECT 
  'チェック3: パスワードハッシュの確認' AS check_name,
  username,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start,
  CASE 
    WHEN LENGTH(password_hash) = 60 AND password_hash LIKE '$2a$10$%' THEN '✅ パスワードハッシュは正しいです'
    WHEN LENGTH(password_hash) != 60 THEN '❌ パスワードハッシュの長さが間違っています（60文字である必要があります）'
    WHEN password_hash NOT LIKE '$2a$10$%' THEN '❌ パスワードハッシュの形式が間違っています（$2a$10$...で始まる必要があります）'
    ELSE '❌ パスワードハッシュに問題があります'
  END AS message
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- チェック4: システム管理者の詳細情報
-- ============================================
SELECT 
  'チェック4: システム管理者の詳細情報' AS check_name,
  id,
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
-- 修正が必要な場合のSQL
-- ============================================
-- 以下のSQLを実行すると、パスワードをリセットできます：
-- UPDATE system_admins 
-- SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
-- WHERE username = 'admin';

