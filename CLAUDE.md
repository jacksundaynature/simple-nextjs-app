# Text Rewriter App

Gemini APIを使ったテキスト改善（リライト）アプリ。

## アーキテクチャ

- **フロントエンド**: Next.js 16 静的エクスポート（`output: 'export'` → `out/`）
- **バックエンド**: Cloudflare Pages Functions（`functions/`ディレクトリ）
- **AI**: Gemini 2.5 Flash REST API（SDKなし、`fetch`で直接呼び出し）
- **ホスティング**: Cloudflare Pages

## ディレクトリ構成

```
src/app/page.tsx       # メインUI（"use client"コンポーネント）
src/app/layout.tsx     # レイアウト・メタデータ
functions/api/rewrite.ts  # POST /api/rewrite - Gemini API呼び出し
functions/tsconfig.json   # Workers用TypeScript設定（メインtsconfigとは分離）
wrangler.toml          # Cloudflare Pages設定
.dev.vars              # ローカル用環境変数（git除外）
```

## コマンド

- `npm run dev` — Next.js開発サーバー（Pages Functionsは動かない）
- `npm run build` — 静的ビルド（`out/`に出力）
- `npm run preview` — ビルド後、wrangler pages devでローカル確認（Functions含む）
- `npm run lint` — ESLint

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `GEMINI_API_KEY` | Gemini API キー |

### 設定方法

- **ローカル**: `.dev.vars`に記載
- **Cloudflare Pages**: `wrangler pages secret put GEMINI_API_KEY --project-name simple-nextjs-app` で設定
  - Production/Preview両方に設定が必要（`--env preview`でPreview側を指定）
  - ダッシュボードの場合: Settings → Functions → Environment variables（トップレベルの「変数とシークレット」はビルド時変数なので注意）

## デプロイ

- GitHubリポジトリ: `jacksundaynature/simple-nextjs-app`
- `main`ブランチ → Production環境
- `develop`ブランチ → Preview環境
- pushで自動デプロイ

## TypeScript設定の注意点

- メインの`tsconfig.json`で`functions/`をexcludeしている（Workers型とNext.js型が競合するため）
- `functions/tsconfig.json`で`@cloudflare/workers-types`を使用

## 経緯

1. 元はデプロイ確認用のシンプルなNext.jsアプリだった
2. Gemini APIを使ったText Rewriterアプリに変更
3. 静的エクスポート（`output: 'export'`）は維持し、API処理はCloudflare Pages Functionsで実装
4. 環境変数をProductionにのみ設定していたが、developブランチはPreview環境にデプロイされるため、Preview側にも設定が必要だった
