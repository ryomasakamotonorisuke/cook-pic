# 401エラーの最終解決方法

## 🔍 現在の状況

`/api/auth/system-admin/login 401 (Unauthorized)` エラーが発生しています。

## 📋 解決手順

### ステップ1: ネットワークタブでレスポンスを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` のリクエストを**右クリック**
5. 「Copy」→「Copy response」を選択
6. レスポンスの内容を確認

**期待されるレスポンス**:
```json
{
  "error": "パスワードが正しくありません",
  "details": "..."
}
```

### ステップ2: パスワードをリセット（必須）

SupabaseのSQL Editorで以下を実行：

```sql
-- パスワードをリセット（パスワード: admin123）
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
    updated_at = NOW()
WHERE username = 'admin';

-- 確認（パスワードハッシュが更新されたか確認）
SELECT 
  username, 
  name,
  LEFT(password_hash, 30) || '...' AS hash_preview,
  LENGTH(password_hash) AS hash_length,
  updated_at
FROM system_admins 
WHERE username = 'admin';
```

**確認ポイント**:
- `hash_length` が `60` であること
- `hash_preview` が `$2a$10$TfL2YgEWStCa.70GOP75Se...` で始まること
- `updated_at` が更新されていること

### ステップ3: システム管理者が存在するか確認

```sql
SELECT username, name, email, created_at 
FROM system_admins 
WHERE username = 'admin';
```

**結果が空の場合**: システム管理者を作成してください

```sql
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### ステップ4: ログインを再試行

- URL: `/system-admin/login`
- ユーザー名: `admin`（大文字・小文字を正確に）
- パスワード: `admin123`（スペースなし）

## 🔍 デバッグ方法

### ブラウザのコンソールで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを開く
3. ログインを試みる
4. 以下のログを確認：
   - `=== Login Error ===`
   - `Error response:` の内容

### ネットワークタブで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試みる
4. `/api/auth/system-admin/login` をクリック
5. 「Response」タブでレスポンスを確認

## 🛠️ よくある問題と解決方法

### 問題1: パスワードハッシュが正しくない

**症状**: 401エラー、レスポンスに「パスワードが正しくありません」

**解決方法**:
```sql
UPDATE system_admins 
SET password_hash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.'
WHERE username = 'admin';
```

### 問題2: システム管理者が存在しない

**症状**: 401エラー、レスポンスに「ユーザー名が見つかりません」

**解決方法**:
```sql
INSERT INTO system_admins (username, password_hash, name, email)
VALUES (
  'admin',
  '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.',
  'システム管理者',
  'admin@pic-cul.com'
);
```

### 問題3: テーブルが存在しない

**症状**: 500エラー、レスポンスに「システム管理者テーブルが存在しません」

**解決方法**:
```sql
-- supabase/migration_add_system_admin_complete.sql を実行
```

## ✅ 確認チェックリスト

- [ ] システム管理者が存在する（`SELECT * FROM system_admins WHERE username = 'admin';`）
- [ ] パスワードハッシュが正しい（60文字、`$2a$10$...`で始まる）
- [ ] パスワードをリセットした
- [ ] ログイン情報が正しい（ユーザー名: `admin`, パスワード: `admin123`）
- [ ] ブラウザのコンソールでエラーメッセージを確認した
- [ ] ネットワークタブでレスポンスを確認した

## 🆘 それでも解決しない場合

以下の情報を収集してください：

1. **ネットワークタブのレスポンス**
   - `/api/auth/system-admin/login` のレスポンスボディ
   - ステータスコード

2. **ブラウザのコンソールエラー**
   - `Error response:` の内容

3. **データベースの確認結果**
   - システム管理者が存在するか
   - パスワードハッシュの長さと形式

これらの情報を元に、さらに詳しく調査できます。

