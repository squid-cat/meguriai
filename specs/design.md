# 設計書

## 概要
Next.js + React 19をベースとしたチーム感謝アプリのフロントエンド設計。
MSWを使用したモックAPIでバックエンドを模擬し、リアルタイム通知機能を持つSPAとして構築する。

## アーキテクチャ

### システム構成図
```
[ブラウザ] 
    ↓
[Next.js Frontend (React 19)]
    ↓
[MSW (Mock Service Worker)]
    ↓
[モックデータ]
```

### データフロー
1. **感謝メッセージ送信フロー**
   - ユーザーがメッセージ作成画面で対象者とメッセージを入力
   - MSWモックAPIに送信リクエスト
   - 成功時、受信者のページでポップアップ表示

2. **リアルタイム通知フロー**
   - MSWのイベント機能またはポーリングで新着メッセージをチェック
   - 新着メッセージ検出時、Toast/Modalでポップアップ表示

### コンポーネントとインターフェース

#### メインコンポーネント
- `MessageSendForm`: 感謝メッセージ送信フォーム
- `NotificationPopup`: 感謝メッセージ受信ポップアップ
- `MemberSelector`: チームメンバー選択UI
- `MessageList`: 送受信履歴表示

#### データ型
```typescript
interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface GratitudeMessage {
  id: string;
  from: TeamMember;
  to: TeamMember[];
  message: string;
  createdAt: Date;
}
```

## エラーハンドリング

### エラーケースと対応

|エラーケース|対応|
|--|--|
|メッセージ送信失敗|エラートーストで再送を促す|
|対象者未選択|フォームバリデーションでエラー表示|
|メッセージ空文字|フォームバリデーションでエラー表示|

### ログ出力
**ログレベル:** console.log（開発用）
**ログ形式:** `[TIMESTAMP] [LEVEL] [COMPONENT] message`

## テスト戦略

### 単体テスト
- コンポーネントのレンダリング確認
- フォームバリデーション動作確認
- MSWモック動作確認

### 統合テスト
- 感謝メッセージ送信〜受信までの一連の流れ
- 複数ユーザー間でのメッセージやりとり

## セキュリティ考慮事項
- CSRFトークン（MSWモック内で模擬）
- XSS対策（React標準のエスケープ処理）
- メッセージ内容のサニタイズ
