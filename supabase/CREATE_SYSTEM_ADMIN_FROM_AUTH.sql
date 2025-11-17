-- Supabase Authのユーザーをsystem_adminsテーブルに登録する
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: Supabase AuthのユーザーIDを確認
-- ============================================
-- Supabaseダッシュボードの「Authentication」→「Users」で
-- admin@admin.com のユーザーIDを確認してください
-- そのユーザーIDを以下に設定します

-- ============================================
-- ステップ2: 現在のsystem_adminsテーブルの状態を確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  created_at
FROM system_admins 
WHERE email = 'admin@admin.com';

-- ============================================
-- ステップ3: system_adminsテーブルに登録
-- ============================================
-- 注意: 以下のSQLを実行する前に、Supabase AuthのユーザーIDを確認してください
-- 
-- 例: Supabase AuthのユーザーIDが 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' の場合
-- 
-- 既存のレコードを削除してから新しいIDで作成
-- DELETE FROM system_admins WHERE email = 'admin@admin.com';
-- 
-- INSERT INTO system_admins (id, username, password_hash, name, email)
-- VALUES (
--   'Supabase AuthのユーザーID',  -- ここにSupabase AuthのユーザーIDを貼り付ける
--   'admin',
--   '', -- password_hashは不要（Supabase Authを使用するため）
--   'システム管理者',
--   'admin@admin.com'
-- );

-- ============================================
-- ステップ4: 確認
-- ============================================
-- SELECT * FROM system_admins WHERE email = 'admin@admin.com';

