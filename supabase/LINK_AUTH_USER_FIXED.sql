-- Supabase Authのユーザーをsystem_adminsテーブルに関連付ける（修正版）
-- ユーザーID: c096fc40-82c0-4051-bc4a-b9ed2404c1b0
-- メールアドレス: admin@admin.com
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在の状態を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  created_at
FROM system_admins 
WHERE email = 'admin@admin.com' 
   OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0'
   OR username = 'admin';

-- ============================================
-- ステップ2: 既存のレコードをすべて削除
-- ============================================
-- メールアドレス、ユーザーID、またはusername='admin'のレコードをすべて削除
DELETE FROM system_admins 
WHERE email = 'admin@admin.com' 
   OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0'
   OR username = 'admin';

-- ============================================
-- ステップ3: 削除確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email
FROM system_admins 
WHERE email = 'admin@admin.com' 
   OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0'
   OR username = 'admin';
-- このクエリが何も返さないことを確認してください

-- ============================================
-- ステップ4: Supabase AuthのユーザーIDで新規作成
-- ============================================
INSERT INTO system_admins (id, username, password_hash, name, email)
VALUES (
  'c096fc40-82c0-4051-bc4a-b9ed2404c1b0',
  'admin',
  '', -- password_hashは不要（Supabase Authを使用するため）
  'システム管理者',
  'admin@admin.com'
);

-- ============================================
-- ステップ5: 確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  password_hash,
  created_at,
  updated_at
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ6: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  admin_username VARCHAR;
  admin_email VARCHAR;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0') INTO admin_exists;
  SELECT username INTO admin_username FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  SELECT email INTO admin_email FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  
  IF admin_exists THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ システム管理者をSupabase Authのユーザーに関連付けました！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ログイン情報:';
    RAISE NOTICE '  URL: /system-admin/login';
    RAISE NOTICE '  メールアドレス: %', admin_email;
    RAISE NOTICE '  パスワード: Sys%ngf6299!';
    RAISE NOTICE '  ユーザー名: %', admin_username;
    RAISE NOTICE '';
    RAISE NOTICE '🔗 関連付けられたユーザーID: c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
  ELSE
    RAISE NOTICE '❌ システム管理者の作成に失敗しました。';
  END IF;
END $$;

