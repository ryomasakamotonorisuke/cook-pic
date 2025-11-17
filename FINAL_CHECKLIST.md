# 最終チェックリスト - ログインできない原因を特定

## 🔍 現在の状況

- ✅ adminユーザーは存在している（確認済み）
- ❌ ログインできない（401エラー）

## 📋 確認手順

### ステップ1: パスワードハッシュを確認（最重要）

SupabaseのSQL Editorで以下を実行：

```sql
-- CHECK_PASSWORD_HASH.sql の内容を実行
```

または、直接実行：

```sql
-- パスワードハッシュを確認
SELECT 
  username,
  LENGTH(password_hash) AS hash_length,
  LEFT(password_hash, 10) AS hash_start
FROM system_admins 
WHERE username = 'admin';
```

**期待される結果**:
- `hash_length`: `60`
- `hash_start`: `$2a$10$`

**問題がある場合**:
```sql
-- パスワードハッシュをリセット
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

### ステップ2: ブラウザのコンソールで詳細を確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. `/system-admin/login` にアクセス
4. ユーザー名: `admin`、パスワード: `admin123` を入力
5. 「ログイン」をクリック
6. **以下のログを確認**:

```
Password hash length: ???
Password comparison result: ???
Test: Comparing "admin123" with stored hash: ???
```

**これらの値を共有してください**

### ステップ3: ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` を**右クリック**
5. 「Copy」→「Copy response」を選択
6. **レスポンスの内容をコピー**

**特に確認すべき情報**:
- `debug.hashLength` の値
- `debug.testWithAdmin123` の値

### ステップ4: ブラウザのキャッシュを完全にクリア

1. ブラウザの開発者ツールを開く（F12）
2. 「Application」タブを開く
3. 「Storage」→「Clear site data」をクリック
4. **すべてのチェックボックスにチェックを入れる**
5. 「Clear site data」をクリック
6. ページをリロード（Ctrl+F5 または Cmd+Shift+R）

## 🔍 考えられる原因

### 原因1: パスワードハッシュが正しくない（最も可能性が高い）

**確認方法**:
```sql
SELECT LENGTH(password_hash) AS len FROM system_admins WHERE username = 'admin';
```

**解決方法**:
```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

### 原因2: ブラウザのキャッシュが古い

**解決方法**: ステップ4を実行

### 原因3: 環境変数が設定されていない

**確認方法**: Vercelダッシュボードで環境変数を確認

### 原因4: パスワードの入力が間違っている

**確認方法**: 
- ユーザー名: `admin`（**正確に**、スペースなし）
- パスワード: `admin123`（**スペースなし**）

## ✅ 確認チェックリスト

- [ ] パスワードハッシュの長さが60文字である（`CHECK_PASSWORD_HASH.sql` を実行）
- [ ] パスワードハッシュが `$2a$10$...` で始まる
- [ ] ブラウザのコンソールで `Password hash length: 60` と表示される
- [ ] ブラウザのコンソールで `Test: Comparing "admin123" with stored hash: true` と表示される
- [ ] ブラウザのキャッシュを完全にクリアした
- [ ] ページをリロードした
- [ ] ユーザー名が `admin` である（正確に）
- [ ] パスワードが `admin123` である（スペースなし）

## 🆘 緊急時の完全リセット

すべてがうまくいかない場合：

```sql
-- 完全にリセット
DELETE FROM system_admins WHERE username = 'admin';

INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);

-- 確認
SELECT username, LENGTH(password_hash) AS len FROM system_admins WHERE username = 'admin';
```

その後、ブラウザのキャッシュをクリアしてログインを試してください。

---

**次のステップ**: `CHECK_PASSWORD_HASH.sql` を実行して、パスワードハッシュの長さと形式を確認してください。

