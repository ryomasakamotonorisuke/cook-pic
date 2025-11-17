-- システム管理者の確認と再作成
-- このファイルをSupabaseのSQL Editorで実行してください

-- 1. 現在のシステム管理者を確認
SELECT id, username, name, email, created_at FROM system_admins;

-- 2. 既存のadminユーザーを削除（存在する場合）
DELETE FROM system_admins WHERE username = 'admin';

-- 3. 新しいadminユーザーを作成（パスワード: admin123）
-- パスワードハッシュ: $2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- 4. 確認メッセージ
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  IF admin_exists THEN
    RAISE NOTICE '✅ システム管理者アカウントを作成しました:';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
  ELSE
    RAISE NOTICE '❌ システム管理者アカウントの作成に失敗しました。';
  END IF;
END $$;

-- 5. 最終確認
SELECT username, name, email, created_at FROM system_admins WHERE username = 'admin';

