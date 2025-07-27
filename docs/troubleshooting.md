# 🔧 Troubleshooting Guide - Meguriai

## 🚨 認証問題の解決方法

### 問題: ログイン後に signin/dashboard を高速で行き来する（フリッカリング）

**原因**: 古いセッションデータとの競合、認証状態の不整合

**解決方法**:

#### 1. 期限切れセッションのクリーンアップ（推奨）
```bash
# ローカル環境
pnpm sessions:cleanup

# 本番環境 (Railway)
railway run pnpm sessions:cleanup
```

#### 2. 全セッションリセット（緊急時のみ）
⚠️ **注意**: 全ユーザーが強制ログアウトされます

```bash
# ローカル環境
pnpm sessions:reset

# 本番環境 (Railway)
railway run pnpm sessions:reset
```

### 問題: ログインできない

**確認項目**:

1. **環境変数の確認**
   ```bash
   # 必要な環境変数
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secret
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   DATABASE_URL=your-database-url
   ```

2. **Google OAuth設定**
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`
   - Authorized JavaScript origins: `https://your-domain.com`

3. **データベース接続**
   ```bash
   # 接続テスト
   railway run pnpm prisma studio
   ```

### 問題: API呼び出しエラー

**確認項目**:

1. **CORS設定** (`app/api/[...route]/route.ts`)
   ```javascript
   origin: [
     "http://localhost:3000",
     "https://your-production-domain.com"
   ]
   ```

2. **API クライアント設定** (`utils/api-client.ts`)
   - 本番環境で適切なベースURLが設定されているか確認

### 緊急対応手順

#### フリッカリング問題の即座解決

1. **本番環境でのセッションリセット**:
   ```bash
   railway run pnpm sessions:reset
   ```

2. **ブラウザキャッシュクリア**:
   - Chrome: DevTools > Application > Storage > Clear site data
   - 全ブラウザ: プライベートモードでテスト

3. **アプリケーション再起動**:
   ```bash
   railway redeploy
   ```

### 予防策

#### 定期メンテナンス
```bash
# 毎週実行（cron job推奨）
railway run pnpm sessions:cleanup
```

#### モニタリング
- セッションテーブルのサイズ監視
- エラーログの定期確認
- レスポンス時間の監視

### デバッグ情報の収集

#### ブラウザコンソールログ
```javascript
// 認証状態の確認
console.log('Session:', await fetch('/api/auth/session').then(r => r.json()));
console.log('Auth Status:', await fetch('/api/user/status').then(r => r.json()));
```

#### サーバーログ
```bash
# Railway logs
railway logs --tail

# ローカルログ
pnpm dev
```

### サポート

問題が解決しない場合:
1. ブラウザコンソールのエラーログを確認
2. サーバーログをチェック
3. 上記の手順を段階的に実行
4. 必要に応じて開発者に連絡 