# ✅ ログイン準備完了

## 🎯 Supabase AuthのユーザーID

- **ユーザーID**: `c096fc40-82c0-4051-bc4a-b9ed2404c1b0`
- **メールアドレス**: `admin@admin.com`
- **パスワード**: `Sys%ngf6299!`

## 🛠️ 設定手順

### ステップ1: SQLスクリプトを実行

SupabaseのSQL Editorで `supabase/LINK_AUTH_USER_NOW.sql` を実行してください。

または、直接実行：

```sql
-- 既存のレコードを削除
DELETE FROM system_admins 
WHERE email = 'admin@admin.com' OR id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';

-- Supabase AuthのユーザーIDで新規作成
INSERT INTO system_admins (id, username, password_hash, name, email)
VALUES (
  'c096fc40-82c0-4051-bc4a-b9ed2404c1b0',
  'admin',
  '', -- password_hashは不要（Supabase Authを使用するため）
  'システム管理者',
  'admin@admin.com'
);

-- 確認
SELECT * FROM system_admins WHERE id = 'c096fc40-82c0-4051-bc4a-b9ed2404c1b0';
```

### ステップ2: ログインを試す

1. `/system-admin/login` にアクセス
2. **メールアドレス**: `admin@admin.com`
3. **パスワード**: `Sys%ngf6299!`
4. 「ログイン」をクリック

## ✅ 確認チェックリスト

- [ ] SQLスクリプトを実行した
- [ ] `system_admins`テーブルにレコードが作成されたことを確認した
- [ ] ログインページでメールアドレスとパスワードを入力した
- [ ] ログインを試した

## 🔍 動作の仕組み

1. ログインAPIがSupabase Authで認証（`admin@admin.com` / `Sys%ngf6299!`）
2. 認証成功後、`system_admins`テーブルでユーザーID `c096fc40-82c0-4051-bc4a-b9ed2404c1b0` を検索
3. 見つかった場合、システム管理者トークンを返す
4. ログイン成功！

## 🆘 トラブルシューティング

### エラー: "システム管理者として登録されていません"

**原因**: `system_admins`テーブルにユーザーIDが登録されていない

**解決方法**: SQLスクリプトを再実行してください

### エラー: "メールアドレスまたはパスワードが正しくありません"

**原因**: Supabase Authの認証に失敗

**解決方法**:
- メールアドレスが `admin@admin.com` であることを確認
- パスワードが `Sys%ngf6299!` であることを確認（大文字・小文字、記号を含む）
- Supabase Authのユーザーが正しく作成されているか確認

