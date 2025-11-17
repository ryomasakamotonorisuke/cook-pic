# 401エラーのトラブルシューティング

## 🔍 問題

ログイン時に401エラーが発生しています。

## 📋 確認事項

### 1. 正しいエンドポイントを使用しているか

- **正しいエンドポイント**: `/api/auth/system-admin/login-supabase-auth`
- **エラーログに表示されているエンドポイント**: `/api/auth/system-admin/login`

**原因**: ブラウザのキャッシュや古いビルドが使用されている可能性があります。

### 2. Supabase Authの認証情報

- **メールアドレス**: `admin@admin.com`
- **パスワード**: `Sys%ngf6299!`

### 3. system_adminsテーブルの状態

- **ユーザーID**: `c096fc40-82c0-4051-bc4a-b9ed2404c1b0`
- **メールアドレス**: `admin@admin.com`
- **ユーザー名**: `admin`

## 🛠️ 解決方法

### ステップ1: ブラウザのキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. 「Disable cache」にチェックを入れる
4. ページをリロード（Ctrl+Shift+R または Cmd+Shift+R）

### ステップ2: 実際のリクエストを確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試す
4. `/api/auth/system-admin/login-supabase-auth` のリクエストを確認
5. レスポンスの内容を確認

### ステップ3: Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Functions」タブを開く
4. `/api/auth/system-admin/login-supabase-auth` のログを確認

### ステップ4: 環境変数を確認

Vercelの環境変数が正しく設定されているか確認：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### ステップ5: Supabase Authのユーザーを確認

1. Supabaseダッシュボードにログイン
2. 「Authentication」→「Users」を開く
3. `admin@admin.com` のユーザーが存在するか確認
4. ユーザーIDが `c096fc40-82c0-4051-bc4a-b9ed2404c1b0` であることを確認

## 🔍 デバッグ方法

### ブラウザのコンソールで確認

```javascript
// ログインを試す前に実行
console.log('Testing login endpoint...');
fetch('/api/auth/system-admin/login-supabase-auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@admin.com',
    password: 'Sys%ngf6299!'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### ネットワークタブで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. ログインを試す
4. `/api/auth/system-admin/login-supabase-auth` のリクエストをクリック
5. 「Response」タブでエラーメッセージを確認

## ⚠️ よくある問題

### 問題1: 古いエンドポイントにリクエストが送られている

**症状**: エラーログに `/api/auth/system-admin/login` が表示される

**解決方法**:
- ブラウザのキャッシュをクリア
- ハードリロード（Ctrl+Shift+R）
- Vercelで再デプロイ

### 問題2: Supabase Authの認証に失敗

**症状**: 401エラーが返される

**解決方法**:
- メールアドレスとパスワードが正しいか確認
- Supabase Authのユーザーが存在するか確認
- パスワードが `Sys%ngf6299!` であることを確認（大文字・小文字、記号を含む）

### 問題3: system_adminsテーブルにレコードが見つからない

**症状**: 403エラーが返される

**解決方法**:
- `system_admins`テーブルにレコードが存在するか確認
- ユーザーIDが `c096fc40-82c0-4051-bc4a-b9ed2404c1b0` であることを確認
- SQLスクリプトを再実行

## 📝 確認チェックリスト

- [ ] ブラウザのキャッシュをクリアした
- [ ] 正しいエンドポイントにリクエストが送られているか確認した
- [ ] Supabase Authのユーザーが存在するか確認した
- [ ] `system_admins`テーブルにレコードが存在するか確認した
- [ ] 環境変数が正しく設定されているか確認した
- [ ] Vercelのログを確認した

