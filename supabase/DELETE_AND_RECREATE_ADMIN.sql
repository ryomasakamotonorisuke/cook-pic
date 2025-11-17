-- 既存のadminユーザーを削除して再作成する（シンプル版）
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 既存のadminユーザーをすべて削除
-- ============================================
DELETE FROM system_admins 
WHERE username = 'admin' 
   OR email = 'admin@admin.com'
   OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- ============================================
-- ステップ2: 新しいadminユーザーを作成
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
-- ステップ3: 確認
-- ============================================
SELECT 
  id,
  username, 
  name,
  email,
  created_at
FROM system_admins 
WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

