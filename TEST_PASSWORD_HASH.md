# パスワードハッシュのテスト方法

## 🔍 問題

システム管理者が存在するのにログインできない場合、パスワードハッシュが正しくない可能性があります。

## 🛠️ 解決方法

### 方法1: パスワードをリセット

SupabaseのSQL Editorで以下を実行：

```sql
-- supabase/RESET_ADMIN_PASSWORD.sql の内容を実行
```

または、直接実行：

```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
    updated_at = NOW()
WHERE username = 'admin';
```

### 方法2: 新しいパスワードハッシュを生成

Node.jsで新しいハッシュを生成：

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => {
  console.log('新しいパスワードハッシュ:', hash);
  console.log('');
  console.log('Supabase SQL Editorで以下を実行:');
  console.log(`UPDATE system_admins SET password_hash = '${hash}' WHERE username = 'admin';`);
});
```

生成したハッシュで更新：

```sql
UPDATE system_admins 
SET password_hash = '生成したハッシュ'
WHERE username = 'admin';
```

### 方法3: パスワードハッシュを確認

現在のパスワードハッシュを確認：

```sql
SELECT 
  username,
  LEFT(password_hash, 30) || '...' AS password_hash_preview,
  LENGTH(password_hash) AS hash_length
FROM system_admins 
WHERE username = 'admin';
```

**正しいハッシュの特徴**:
- 長さ: 60文字
- 形式: `$2a$10$...` で始まる
- 例: `$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.`

## 🔍 デバッグ方法

### Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」→ 最新のデプロイ → 「Functions」タブ
4. `/api/auth/system-admin/login` のログを確認

以下のログを確認：

```
Admin found: admin システム管理者
Comparing password...
Password valid: true / false
```

`Password valid: false` と表示される場合、パスワードハッシュが間違っています。

## ✅ 確認手順

1. **パスワードハッシュをリセット**
   ```sql
   UPDATE system_admins 
   SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
   WHERE username = 'admin';
   ```

2. **ログインを再試行**
   - ユーザー名: `admin`
   - パスワード: `admin123`

3. **Vercelのログを確認**
   - `Password valid: true` と表示されるか確認

## 🆘 それでも解決しない場合

1. **データベースの接続を確認**
   - Supabaseのプロジェクトがアクティブか確認
   - Service Role Keyが正しいか確認

2. **環境変数を確認**
   - Vercelの環境変数を確認
   - `SUPABASE_SERVICE_ROLE_KEY` が正しいか確認

3. **bcryptのバージョンを確認**
   - `bcryptjs` が正しくインストールされているか確認

