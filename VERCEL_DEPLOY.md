# Vercelデプロイ手順

このガイドでは、Pic_culアプリケーションをVercelにデプロイする手順を説明します。

## 📋 前提条件

- GitHubアカウント
- Vercelアカウント（[vercel.com](https://vercel.com)で無料登録可能）
- Supabaseプロジェクト（データベースとストレージ用）

## 🚀 デプロイ手順

### 1. GitHubリポジトリへのプッシュ

まず、コードをGitHubリポジトリにプッシュします：

```bash
git add .
git commit -m "Vercelデプロイ準備"
git push origin main
```

### 2. Vercelプロジェクトの作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択（またはインポート）
4. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出される場合があります）
   - **Root Directory**: `frontend` を選択
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 3. 環境変数の設定

Vercelダッシュボードで、プロジェクトの「Settings」→「Environment Variables」に以下の環境変数を追加します：

#### 必須環境変数

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_API_URL=/api
```

#### 環境変数の取得方法

1. **SupabaseプロジェクトのURLとキー**:
   - Supabaseダッシュボードにログイン
   - プロジェクトを選択
   - 「Settings」→「API」を開く
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`（⚠️ 機密情報）

2. **環境変数の設定**:
   - Vercelダッシュボードで各環境変数を追加
   - 「Production」「Preview」「Development」すべてに適用することを推奨

### 4. デプロイの実行

1. 設定が完了したら「Deploy」をクリック
2. ビルドが完了するまで待機（通常2-5分）
3. デプロイが成功すると、URLが表示されます

### 5. 動作確認

デプロイ後、以下の機能を確認してください：

- ✅ トップページが表示される
- ✅ `/admin/login`でログインできる
- ✅ メニューの作成・編集ができる
- ✅ 画像のアップロードが動作する
- ✅ `/feed/[storeId]`でメニューが表示される

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合

1. **ログを確認**:
   - Vercelダッシュボードの「Deployments」タブでログを確認
   - エラーメッセージを確認

2. **環境変数の確認**:
   - すべての環境変数が正しく設定されているか確認
   - 値に余分なスペースや引用符がないか確認

3. **依存関係の確認**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   ローカルでビルドが成功するか確認

### 画像が表示されない場合

1. **Supabase Storageの設定確認**:
   - Supabaseダッシュボードで「Storage」を開く
   - `images`バケットが存在し、公開設定になっているか確認
   - Storageポリシーが正しく設定されているか確認

2. **環境変数の確認**:
   - `NEXT_PUBLIC_SUPABASE_URL`が正しく設定されているか確認

### APIエラーが発生する場合

1. **Next.js API Routesの確認**:
   - `/api`配下のルートが正しく動作しているか確認
   - Vercelの関数ログを確認

2. **CORS設定の確認**:
   - SupabaseのCORS設定を確認

## 📝 継続的なデプロイ

VercelはGitHubリポジトリと連携しているため、以下の場合に自動的にデプロイされます：

- `main`ブランチへのプッシュ → 本番環境にデプロイ
- その他のブランチへのプッシュ → プレビュー環境にデプロイ
- プルリクエストの作成 → プレビュー環境にデプロイ

## 🔐 セキュリティのベストプラクティス

1. **環境変数の保護**:
   - `SUPABASE_SERVICE_ROLE_KEY`は機密情報のため、GitHubにコミットしない
   - Vercelの環境変数設定のみで管理

2. **Supabase RLS（Row Level Security）**:
   - データベースのセキュリティポリシーを適切に設定
   - 公開データと非公開データを適切に分離

3. **API Routesの認証**:
   - 管理者機能のAPI Routesで適切な認証チェックを実装

## 📚 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)

## 🆘 サポート

問題が解決しない場合は、以下を確認してください：

1. Vercelのデプロイログ
2. Supabaseのログ
3. ブラウザのコンソールエラー
4. ネットワークタブのエラー

