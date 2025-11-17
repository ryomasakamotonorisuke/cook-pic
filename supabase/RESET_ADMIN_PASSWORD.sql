-- システム管理者のパスワードをリセット
-- このファイルをSupabaseのSQL Editorで実行してください

-- ステップ1: 現在のパスワードハッシュを確認
SELECT 
  username, 
  name,
  LEFT(password_hash, 20) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE username = 'admin';

-- ステップ2: パスワードをリセット（パスワード: admin123）
-- このハッシュは 'admin123' のbcryptハッシュです
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
    updated_at = NOW()
WHERE username = 'admin';

-- ステップ3: 確認
SELECT 
  username, 
  name,
  LEFT(password_hash, 20) || '...' AS password_hash_preview,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ステップ4: 成功メッセージ
DO $$
BEGIN
  RAISE NOTICE '✅ パスワードをリセットしました！';
  RAISE NOTICE '';
  RAISE NOTICE 'ログイン情報:';
  RAISE NOTICE '  ユーザー名: admin';
  RAISE NOTICE '  パスワード: admin123';
END $$;

