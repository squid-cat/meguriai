# CLAUDE.md

## プロジェクト基本情報

**Meguriai** - Next.js + Hono + PrismaのWebアプリケーション

- **技術スタック**: Next.js (React 19), Hono, Prisma, PostgreSQL, TypeScript
- **パッケージマネージャー**: pnpm
- **コードフォーマッター**: Biome
- **データベース**: PostgreSQL (Docker)

## 共通コマンド

```bash
# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# コードチェック（型検査とlint）
pnpm run check

# コード自動修正
pnpm run fix

# Prisma Studio（DB管理画面）
pnpm run prisma:studio

# DBマイグレーション実行
pnpm run prisma:migrate

# Prisma Client再生成
pnpm run prisma:generate
```

## コードスタイル

- **コードフォーマッター**: Biome設定に従う
- **型安全性**: TypeScript strict mode
- **言語**: 全てのコメント、メッセージ、ユーザー向けテキストは日本語
- **UIコンポーネント**: shadcnを使用し、shadcnの思想に沿って実装する

## ワークフロー

1. コード変更前に `pnpm run check` で型検査とlintを実行
2. DBスキーマ変更時は `prisma:migrate` → `prisma:generate`
3. コミット前に `pnpm run fix` で自動修正


## 開発ルール
- **仕様駆動開発**で実装をおこなう
- **いきなり実装は開始せず、まずはspecsディレクトリを読み込み、以下3ファイルの作成をおこなう**
  1. requirements.md ---要件定義書
  2. design.md ---設計書
  3. tasks.md ---実装計画
- **start task** とコマンドが打たれたら、実装計画に沿って実装をおこなう
- 実装が完了するたび実装計画にチェックを入れて、現在の開発進捗が開発者が一目でわかるようにする

## 重要事項

- **ユーザーとのコミュニケーションは常に日本語で行うこと**
- **いきなり実装をするのではなく、仕様作成→実装のフローを徹底すること**
