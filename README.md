# Meguriai（めぐりあい）

## サービス概要

**仕事が楽しくなる仕組みを作るポモドーロタイマーアプリケーション**

Meguriaiは、みんなで協力して仲良く作業できることをコンセプトとした協働型ポモドーロタイマーです。全ユーザーが同じ「成長の木」を共有し、作業時間に応じて木を育てていく楽しさを体験できます。

### 主な機能

- **🌳 共有の成長の木**: 全ユーザーの作業時間が合計され、共有の木として可視化
- **⏲️ ポモドーロタイマー**: カスタマイズ可能な作業・休憩時間設定
- **👤 アバターシステム**: 10種類のアバターから選択、作業中ユーザーを表示
- **💧 水やりアニメーション**: ポモドーロ完了時に水やりエフェクト
- **📊 作業記録・分析**: 7日間の作業履歴をグラフで可視化
- **📝 手動作業記録**: ポモドーロ以外の作業時間も記録可能

### 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Hono (API Routes)
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Development**: Biome (Linter/Formatter)

## 開発工程

### 要件定義：1時間
- ベースと想像イメージを作って仕様書を作成
- `docs/README.md` に仕様書を取りまとめ
- ユーザーストーリーとUI要件の整理

### 機能作成：2時間
- アーキテクチャや詳細設計などは行わず、良い感じに作成してもらった
- デバッグは人間が実際に手を動かしながら、エラーを投げたりして解消してもらった
- プロトタイプからプロダクション品質まで一気通貫で開発

**総開発時間：3時間でMVP完成** 🚀

---

## 起動方法

.env.example から .env を作成
```bash
cp .env.example .env
```

Docker で postgres の起動
```bash
docker compose up -d
```

DB テーブルの作成とスキーマ更新 - prisma/migrations にある SQL が順次実行されます
```bash
pnpm run prisma:migrate && pnpm run prisma:generate
```

ライブラリのインストール
```bash
pnpm i
```

起動
```bash
pnpm run dev
```


## テーブルの更新方法

1. **スキーマを編集**
  prisma/schema.prisma を編集

2. **マイグレーションを生成・適用**
   ```bash
   pnpm run prisma:migrate
   ```

3. **Prisma Client を再生成**
   ```bash
   pnpm run prisma:generate
   ```

### よく使うコマンド

```bash
# データベースの状態や中身を Web 上から確認
pnpm run prisma:studio

# 開発環境でデータベースをリセット
pnpm run prisma:reset

```
