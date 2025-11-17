# Invalid API Key エラーの修正方法

## 🔍 問題

エラーメッセージ: `Invalid API key`

これは、Supabase AuthのAPIキー（Anon Key）が正しく設定されていないか、無効であることを示しています。

## 🛠️ 解決方法

### ステップ1: SupabaseのAnon Keyを確認

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「API」を開く
4. 「Project API keys」セクションで **anon/public** キーをコピー

### ステップ2: Vercelの環境変数を設定

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下の環境変数を確認・設定：

   - **名前**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **値**: ステップ1でコピーしたAnon Key
   - **Environment**: Production, Preview, Development すべてにチェック

5. 「Save」をクリック

### ステップ3: 他の環境変数も確認

以下の環境変数も正しく設定されているか確認：

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key（サーバーサイド用）

### ステップ4: 再デプロイ

環境変数を変更した後、**必ず再デプロイ**してください：

1. Vercelダッシュボードでプロジェクトを開く
2. 「Deployments」タブを開く
3. 最新のデプロイの「...」メニューをクリック
4. 「Redeploy」を選択
5. または、Gitにプッシュして自動デプロイをトリガー

## ✅ 確認方法

再デプロイ後、以下を確認：

1. ブラウザのコンソールでエラーメッセージを確認
2. 「Invalid API key」エラーが消えているか確認
3. ログインを再度試す

## 🔍 トラブルシューティング

### 問題1: 環境変数が設定されているのにエラーが出る

**原因**: 環境変数を変更した後に再デプロイしていない

**解決方法**: Vercelで再デプロイを実行

### 問題2: 正しいAnon Keyをコピーしたのにエラーが出る

**原因**: 
- 環境変数の名前が間違っている（`NEXT_PUBLIC_SUPABASE_ANON_KEY`である必要がある）
- 環境変数に余分なスペースや改行が含まれている

**解決方法**:
- 環境変数の名前を確認
- 値を再コピーして設定（余分なスペースを削除）

### 問題3: ローカルでは動くがVercelでは動かない

**原因**: Vercelの環境変数が設定されていない

**解決方法**: Vercelの環境変数を設定して再デプロイ

## 📝 環境変数の設定例

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxMjM0NTY3LCJleHAiOjE5NTY4MTA1Njd9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDEyMzQ1NjcsImV4cCI6MTk1NjgxMDU2N30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要**: 
- `NEXT_PUBLIC_` で始まる環境変数はクライアントサイドでも使用されます
- Service Role Keyは**絶対に**クライアントサイドに公開しないでください

