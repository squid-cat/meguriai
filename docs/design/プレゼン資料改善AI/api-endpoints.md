# API エンドポイント仕様

## ベースURL

- 開発環境: `http://localhost:3000/api`
- 本番環境: `https://presentation-ai.example.com/api`

## 認証

現在は認証不要ですが、将来的にJWTトークンベースの認証を実装予定。

```http
Authorization: Bearer <jwt-token>
```

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  }
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報（オプション）"
  }
}
```

## エラーコード一覧

| コード | 説明 |
|--------|------|
| `INVALID_FILE_TYPE` | 対応していないファイル形式 |
| `FILE_TOO_LARGE` | ファイルサイズが10MBを超過 |
| `VIRUS_DETECTED` | ウイルスが検出された |
| `OCR_FAILED` | OCR処理に失敗 |
| `LLM_API_ERROR` | LLM API呼び出しエラー |
| `NETWORK_ERROR` | ネットワークエラー |
| `TIMEOUT_ERROR` | 処理タイムアウト |
| `SENSITIVE_CONTENT` | 機密情報が検出された |
| `SESSION_NOT_FOUND` | セッションが見つからない |
| `SESSION_EXPIRED` | セッションの有効期限切れ |
| `RATE_LIMIT_EXCEEDED` | レート制限に達した |

---

## 1. ファイルアップロード

### POST /upload

プレゼン資料をアップロードし、処理セッションを開始します。

#### リクエスト

**Content-Type**: `multipart/form-data`

| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `file` | File | No | 画像またはPDFファイル |
| `text` | string | No | 直接入力されたテキスト |
| `audienceType` | string | Yes | 聞き手属性 (`executive`, `engineer`, `student`, `sales`, `other`) |

**制約条件**:
- `file` または `text` のいずれかは必須
- ファイルサイズ: 最大10MB
- 対応形式: PNG, JPG, JPEG, PDF

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "uploaded"
  }
}
```

**エラー時 (400)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "対応していないファイル形式です。PNG、JPG、PDFのみサポートしています。"
  }
}
```

#### cURLサンプル

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@presentation.png" \
  -F "audienceType=executive"
```

---

## 2. 処理状況確認

### GET /process/{sessionId}/status

アップロードしたファイルの処理状況を確認します。

#### パラメータ

| パラメータ | 型 | 説明 |
|------------|-----|------|
| `sessionId` | string | セッションID（UUID） |

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "analyzing",
    "progress": 75,
    "message": "LLMによる解析を実行中です..."
  }
}
```

**処理完了時 (200)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "progress": 100,
    "message": "解析が完了しました"
  }
}
```

**エラー時 (404)**:
```json
{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "指定されたセッションが見つかりません"
  }
}
```

#### 処理状況の種類

| ステータス | 説明 |
|------------|------|
| `uploaded` | アップロード完了 |
| `validating` | ファイル検証中 |
| `scanning` | ウイルススキャン中 |
| `extracting` | テキスト抽出中（OCR処理） |
| `analyzing` | LLM解析中 |
| `completed` | 処理完了 |
| `failed` | 処理失敗 |
| `expired` | セッション期限切れ |

---

## 3. 解析結果取得

### GET /result/{sessionId}

処理完了後の解析結果を取得します。

#### パラメータ

| パラメータ | 型 | 説明 |
|------------|-----|------|
| `sessionId` | string | セッションID（UUID） |

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "originalText": "弊社の売上は前年同期比150%増となりました",
    "audienceType": "executive",
    "improvements": [
      {
        "category": "content",
        "severity": "high",
        "issue": "具体的な数値の根拠が不明確",
        "suggestion": "売上増加の要因と根拠となるデータを追加してください",
        "example": "新規顧客獲得数：200社、既存顧客単価向上：平均25%アップ",
        "reasoning": "経営者は数値の裏付けとなる具体的な要因を重視します"
      }
    ],
    "comparison": {
      "before": {
        "title": "売上報告",
        "content": "弊社の売上は前年同期比150%増となりました",
        "keyPoints": ["売上150%増"]
      },
      "after": {
        "title": "売上成長とその要因分析",
        "content": "弊社の売上は前年同期比150%増を達成しました。この成長は新規顧客獲得200社（前年80社）と既存顧客単価25%向上によるものです。",
        "keyPoints": [
          "売上150%増（具体的要因付き）",
          "新規顧客獲得200社",
          "既存顧客単価25%向上"
        ],
        "improvements": [
          "具体的な数値根拠を追加",
          "タイトルをより説明的に変更",
          "成長要因を明確化"
        ]
      },
      "changes": [
        {
          "type": "modification",
          "before": "売上報告",
          "after": "売上成長とその要因分析",
          "reason": "より具体的で魅力的なタイトルに変更"
        }
      ]
    },
    "confidence": 0.87,
    "processingTime": 15430,
    "createdAt": "2025-08-02T10:30:00Z"
  }
}
```

**エラー時 (404)**:
```json
{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "指定されたセッションが見つかりません"
  }
}
```

---

## 4. テキスト直接解析

### POST /analyze/text

ファイルアップロードせずに、テキストを直接解析します。

#### リクエスト

**Content-Type**: `application/json`

```json
{
  "text": "弊社の新サービスについて説明いたします",
  "audienceType": "engineer"
}
```

| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `text` | string | Yes | 解析対象のテキスト（最大10,000文字） |
| `audienceType` | string | Yes | 聞き手属性 |

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "result": {
      // 解析結果データ（/result/{sessionId}と同じ形式）
    }
  }
}
```

---

## 5. セッション削除

### DELETE /session/{sessionId}

処理セッションとファイルを手動で削除します。

#### パラメータ

| パラメータ | 型 | 説明 |
|------------|-----|------|
| `sessionId` | string | セッションID（UUID） |

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "message": "セッションが正常に削除されました"
  }
}
```

---

## 6. ヘルスチェック

### GET /health

システムの稼働状況を確認します。

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-02T10:30:00Z",
    "services": {
      "database": {
        "status": "up",
        "responseTime": 15
      },
      "redis": {
        "status": "up",
        "responseTime": 3
      },
      "storage": {
        "status": "up",
        "responseTime": 8
      },
      "llmApi": {
        "status": "up",
        "responseTime": 450
      },
      "ocrService": {
        "status": "up",
        "responseTime": 120
      }
    }
  }
}
```

---

## 7. システム統計

### GET /stats

システム利用統計を取得します（運用監視用）。

#### クエリパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|------------|-----|------------|------|
| `days` | number | 7 | 過去何日分の統計を取得するか |

#### レスポンス

**成功時 (200)**:
```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2025-07-26T00:00:00Z",
      "to": "2025-08-02T23:59:59Z"
    },
    "totalSessions": 1250,
    "successfulSessions": 1180,
    "failedSessions": 70,
    "successRate": 0.944,
    "averageProcessingTime": 18500,
    "topAudienceTypes": [
      {"type": "executive", "count": 450},
      {"type": "sales", "count": 380},
      {"type": "engineer", "count": 240},
      {"type": "student", "count": 180}
    ],
    "errorBreakdown": [
      {"code": "OCR_FAILED", "count": 35},
      {"code": "LLM_API_ERROR", "count": 20},
      {"code": "TIMEOUT_ERROR", "count": 15}
    ]
  }
}
```

---

## 8. WebSocket接続（リアルタイム進捗）

### WS /ws/process/{sessionId}

処理進捗をリアルタイムで受信します。

#### 接続

```javascript
const ws = new WebSocket('ws://localhost:3000/api/ws/process/550e8400-e29b-41d4-a716-446655440000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Progress:', data);
};
```

#### 受信メッセージ

```json
{
  "type": "progress",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "analyzing",
  "progress": 60,
  "message": "LLM解析中...",
  "timestamp": "2025-08-02T10:30:00Z"
}
```

```json
{
  "type": "completed",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": 100,
  "message": "解析完了",
  "timestamp": "2025-08-02T10:31:45Z"
}
```

```json
{
  "type": "error",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "error": {
    "code": "LLM_API_ERROR",
    "message": "LLM APIへの接続に失敗しました"
  },
  "timestamp": "2025-08-02T10:30:30Z"
}
```

---

## レート制限

同一IPアドレスからのリクエスト制限：

- `/upload`: 10リクエスト/分
- `/analyze/text`: 20リクエスト/分
- その他のGETエンドポイント: 100リクエスト/分

制限に達した場合の応答：

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト制限に達しました。しばらく待ってから再度お試しください。",
    "details": "リセット時刻: 2025-08-02T10:35:00Z"
  }
}
```

---

## SDK使用例

### JavaScript/TypeScript

```typescript
import { PresentationAI } from '@/lib/presentation-ai-client';

const client = new PresentationAI('http://localhost:3000/api');

// ファイルアップロード
const file = document.getElementById('file').files[0];
const session = await client.upload({
  file,
  audienceType: 'executive'
});

// 進捗監視
client.watchProgress(session.sessionId, (progress) => {
  console.log(`Progress: ${progress.progress}%`);
});

// 結果取得
const result = await client.getResult(session.sessionId);
console.log(result.improvements);
```

### Python

```python
import requests
import time

class PresentationAI:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def upload_file(self, file_path, audience_type):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'audienceType': audience_type}
            response = requests.post(
                f'{self.base_url}/upload',
                files=files,
                data=data
            )
        return response.json()
    
    def wait_for_completion(self, session_id):
        while True:
            response = requests.get(
                f'{self.base_url}/process/{session_id}/status'
            )
            data = response.json()
            
            if data['data']['status'] in ['completed', 'failed']:
                return data
            
            time.sleep(2)

# 使用例
client = PresentationAI('http://localhost:3000/api')
session = client.upload_file('slide.png', 'executive')
result = client.wait_for_completion(session['data']['sessionId'])
```

---

作成日: 2025-08-02  
バージョン: 1.0  
更新者: Claude Code