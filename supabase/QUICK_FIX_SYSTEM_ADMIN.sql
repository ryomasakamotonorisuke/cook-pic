-- システム管理者のクイックフィックス
-- このファイルをSupabaseのSQL Editorで実行してください

-- ステップ1: テーブルが存在するか確認
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- ステップ2: 既存のadminユーザーを削除（存在する場合）
DELETE FROM system_admins WHERE username = 'admin';

-- ステップ3: 新しいadminユーザーを作成（パスワード: admin123）
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- ステップ4: 確認
SELECT 
  username, 
  name, 
  email, 
  created_at,
  CASE 
    WHEN password_hash IS NOT NULL THEN 'パスワード設定済み'
    ELSE 'パスワード未設定'
  END AS password_status
FROM system_admins 
WHERE username = 'admin';

-- ステップ5: 成功メッセージ
DO $$
BEGIN
  RAISE NOTICE '✅ システム管理者アカウントを作成しました！';
  RAISE NOTICE '';
  RAISE NOTICE 'ログイン情報:';
  RAISE NOTICE '  ユーザー名: admin';
  RAISE NOTICE '  パスワード: admin123';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
END $$;

