## 起動方法

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
