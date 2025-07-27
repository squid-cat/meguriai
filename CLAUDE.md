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

## 重要事項

**ユーザーとのコミュニケーションは常に日本語で行うこと**
