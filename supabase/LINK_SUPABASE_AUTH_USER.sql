-- Supabase Authのユーザーをsystem_adminsテーブルに関連付ける
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在のsystem_adminsテーブルの状態を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  created_at
FROM system_admins 
WHERE email = 'admin@admin.com' OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ2: Supabase AuthのユーザーIDを確認
-- ============================================
-- Supabaseダッシュボードの「Authentication」→「Users」で
-- admin@admin.com のユーザーIDを確認してください
-- そのユーザーIDを以下に設定します

-- ============================================
-- ステップ3: system_adminsテーブルのIDをSupabase AuthのユーザーIDに更新
-- ============================================
-- 注意: 以下のSQLを実行する前に、Supabase AuthのユーザーIDを確認してください
-- Supabaseダッシュボードの「Authentication」→「Users」で確認できます

-- 例: Supabase AuthのユーザーIDが 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' の場合
-- UPDATE system_admins 
-- SET id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
-- WHERE email = 'admin@admin.com';

-- または、既存のレコードを削除して新しいIDで作成
-- DELETE FROM system_admins WHERE email = 'admin@admin.com';
-- INSERT INTO system_admins (id, username, password_hash, name, email)
-- VALUES (
--   'Supabase AuthのユーザーID',
--   'admin',
--   '', -- password_hashは不要（Supabase Authを使用するため）
--   'システム管理者',
--   'admin@admin.com'
-- );

-- ============================================
-- ステップ4: 確認
-- ============================================
-- SELECT * FROM system_admins WHERE email = 'admin@admin.com';

