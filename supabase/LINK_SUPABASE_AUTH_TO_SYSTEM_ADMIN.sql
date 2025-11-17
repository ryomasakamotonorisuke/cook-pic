-- Supabase Authのユーザーをsystem_adminsテーブルに関連付ける
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
-- ステップ3: Supabase AuthのユーザーIDを取得
-- ============================================
-- 以下のSQLでSupabase Authのユーザーを確認できます
-- （Supabaseの管理APIを使用する必要があります）
-- 
-- または、Supabaseダッシュボードの「Authentication」→「Users」で
-- admin@admin.com のユーザーIDを確認してください

-- ============================================
-- ステップ4: system_adminsテーブルのIDをSupabase AuthのユーザーIDに更新
-- ============================================
-- 注意: 以下のSQLを実行する前に、Supabase AuthのユーザーIDを確認してください
-- 
-- 例: Supabase AuthのユーザーIDが 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' の場合
-- 
-- 方法1: 既存のレコードのIDを更新
-- UPDATE system_admins 
-- SET id = 'Supabase AuthのユーザーID'
-- WHERE email = 'admin@admin.com';
--
-- 方法2: 既存のレコードを削除して新しいIDで作成
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
-- ステップ5: 確認
-- ============================================
-- SELECT * FROM system_admins WHERE email = 'admin@admin.com';

