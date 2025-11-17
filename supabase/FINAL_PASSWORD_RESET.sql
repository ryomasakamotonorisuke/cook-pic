-- システム管理者のパスワードを最終的にリセット
-- このファイルをSupabaseのSQL Editorで実行してください

-- ============================================
-- ステップ1: 現在の状態を確認
-- ============================================
SELECT 
  username, 
  name,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  created_at,
  updated_at
FROM system_admins 
WHERE username = 'admin';

-- ============================================
-- ステップ2: 既存のadminユーザーを完全に削除
-- ============================================
DELETE FROM system_admins WHERE username = 'admin';

-- ============================================
-- ステップ3: 新しいadminユーザーを作成
-- パスワード: admin123
-- このハッシュは 'admin123' のbcryptハッシュです
-- ============================================
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- ============================================
-- ステップ4: 確認（重要）
-- ============================================
SELECT 
  username, 
  name,
  email,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS password_hash_length,
  CASE 
    WHEN LENGTH(password_hash) = 60 THEN '✅ 正しい長さ'
    ELSE '❌ 長さが間違っています（60文字である必要があります）'
  END AS hash_length_check,
  CASE 
    WHEN password_hash LIKE '$2a$10$%' THEN '✅ 正しい形式'
    ELSE '❌ 形式が間違っています'
  END AS hash_format_check,
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
  hash_format BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM system_admins WHERE username = 'admin') INTO admin_exists;
  
  IF admin_exists THEN
    SELECT LENGTH(password_hash) INTO hash_length FROM system_admins WHERE username = 'admin';
    SELECT password_hash LIKE '$2a$10$%' INTO hash_format FROM system_admins WHERE username = 'admin';
    
    RAISE NOTICE '✅ システム管理者アカウントをリセットしました！';
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
      RAISE NOTICE '  ❌ パスワードハッシュの長さが正しくありません（60文字である必要があります）';
    END IF;
    
    IF hash_format THEN
      RAISE NOTICE '  ✅ パスワードハッシュの形式は正しいです';
    ELSE
      RAISE NOTICE '  ❌ パスワードハッシュの形式が正しくありません（$2a$10$...で始まる必要があります）';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 本番環境では必ずパスワードを変更してください。';
  ELSE
    RAISE NOTICE '❌ システム管理者アカウントの作成に失敗しました。';
  END IF;
END $$;

