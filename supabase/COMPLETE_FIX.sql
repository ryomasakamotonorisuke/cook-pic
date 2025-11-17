-- システム管理者ログイン問題の完全な修正
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: テーブルが存在するか確認
-- ============================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'system_admins'
) AS table_exists;

-- ============================================
-- ステップ2: 既存のadminユーザーを削除
-- ============================================
DELETE FROM system_admins WHERE username = 'admin';

-- ============================================
-- ステップ3: 新しいadminユーザーを作成
-- パスワード: admin123
-- ============================================
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- ============================================
-- ステップ4: 確認
-- ============================================
SELECT 
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
-- ステップ5: 成功メッセージ
-- ============================================
DO $$
DECLARE
  admin_exists BOOLEAN;
  hash_length INTEGER;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
  
  IF admin_exists THEN
    RAISE NOTICE '✅ システム管理者アカウントを作成しました！';
    RAISE NOTICE '';
    RAISE NOTICE 'ログイン情報:';
    RAISE NOTICE '  ユーザー名: admin';
    RAISE NOTICE '  パスワード: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'パスワードハッシュ情報:';
    RAISE NOTICE '  長さ: % 文字', hash_length;
    IF hash_length = 60 THEN
      RAISE NOTICE '  ✅ パスワードハッシュの長さは正しいです';
    ELSE
      RAISE NOTICE '  ⚠️ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
  ELSE
    RAISE NOTICE '❌ システム管理者アカウントの作成に失敗しました。';
  END IF;
END $$;

