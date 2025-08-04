# API設計書

## 概要
- **設計方針**: 機能設計書に基づくRESTful API設計
- **OpenAPI準拠**: OpenAPI 3.0仕様に基づく設計
- **認証方式**: Firebase Authentication IDトークン
- **フレームワーク**: Hono + TypeScript
- **バリデーション**: Zod スキーマファーストバリデーション

## ベースURL
- **開発環境**: `http://localhost:8000`
- **本番環境**: `https://api.offpath.app`

## 認証

### 認証方式
すべてのAPIエンドポイント（認証不要エンドポイント除く）でFirebase IDトークンによる認証が必要。

```
Authorization: Bearer <Firebase_ID_Token>
```

### 認証不要エンドポイント
- `GET /health` - ヘルスチェック
- `GET /docs` - OpenAPI仕様書
- `GET /swagger` - Swagger UI

## ユーザー認証API

### POST /api/v1/auth/verify
Firebase IDトークンを検証し、ユーザー情報を取得または作成する。

#### リクエスト
```json
{
  "idToken": "string"
}
```

#### レスポンス（200 OK）
```json
{
  "user": {
    "id": "uuid",
    "firebaseUid": "string",
    "name": "string | null",
    "email": "string | null",
    "isAnonymous": "boolean",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "isNewUser": "boolean"
}
```

#### エラーレスポンス（401 Unauthorized）
```json
{
  "error": {
    "code": "INVALID_ID_TOKEN",
    "message": "無効なIDトークンです",
    "details": []
  }
}
```

### POST /api/v1/auth/logout
ユーザーのログアウト処理（必要に応じてトークン無効化）。

#### 認証
必要（Bearer Token）

#### レスポンス（204 No Content）
レスポンスボディなし

## ユーザー管理API

### GET /api/v1/users/me
現在のユーザー情報を取得する。

#### 認証
必要

#### レスポンス（200 OK）
```json
{
  "user": {
    "id": "uuid",
    "firebaseUid": "string",
    "name": "string | null",
    "email": "string | null",
    "isAnonymous": "boolean",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/v1/users/me
ユーザー情報を更新する。

#### 認証
必要

#### リクエスト
```json
{
  "name": "string | null"
}
```

#### レスポンス（200 OK）
```json
{
  "user": {
    "id": "uuid",
    "firebaseUid": "string",
    "name": "string | null",
    "email": "string | null",
    "isAnonymous": "boolean",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/v1/users/me/stats
ユーザーの統計情報を取得する。

#### 認証
必要

#### レスポンス（200 OK）
```json
{
  "stats": {
    "totalTrips": "number",
    "hiddenSpotsFound": "number",
    "countriesExplored": "number",
    "averageChaosScore": "number"
  }
}
```

## 旅行管理API

### GET /api/v1/trips
ユーザーの旅行一覧を取得する。

#### 認証
必要

#### クエリパラメータ
- `status`: string (optional) - ステータスフィルタ（"planning", "completed", "cancelled"）
- `page`: number (optional) - ページ番号（デフォルト: 1）
- `limit`: number (optional) - 取得件数（デフォルト: 10、最大: 50）
- `sort`: string (optional) - ソート順（"created_at_desc", "created_at_asc"）

#### レスポンス（200 OK）
```json
{
  "trips": [
    {
      "id": "uuid",
      "destination": "string",
      "duration": "string",
      "budget": "string",
      "chaosLevel": "number",
      "status": "string",
      "totalSpots": "number",
      "hiddenSpotsCount": "number",
      "localRatingAvg": "number | null",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### POST /api/v1/trips
新しい旅行を作成する。

#### 認証
必要

#### リクエスト
```json
{
  "destination": "string",
  "duration": "3-4days" | "5-7days" | "1-2weeks" | "3weeks+",
  "budget": "budget" | "standard" | "premium" | "luxury",
  "chaosLevel": "number", // 1-5
  "avoidTouristSpots": "boolean",
  "avoidJapaneseServices": "boolean",
  "avoidCrowdedAreas": "boolean"
}
```

#### レスポンス（201 Created）
```json
{
  "trip": {
    "id": "uuid",
    "destination": "string",
    "duration": "string",
    "budget": "string",
    "chaosLevel": "number",
    "avoidTouristSpots": "boolean",
    "avoidJapaneseServices": "boolean",
    "avoidCrowdedAreas": "boolean",
    "status": "planning",
    "totalSpots": 0,
    "hiddenSpotsCount": 0,
    "localRatingAvg": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### エラーレスポンス（400 Bad Request）
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "chaosLevel",
        "message": "カオス度は1から5の間で指定してください"
      }
    ]
  }
}
```

### GET /api/v1/trips/:id
特定の旅行の詳細情報を取得する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（200 OK）
```json
{
  "trip": {
    "id": "uuid",
    "destination": "string",
    "duration": "string",
    "budget": "string",
    "chaosLevel": "number",
    "avoidTouristSpots": "boolean",
    "avoidJapaneseServices": "boolean",
    "avoidCrowdedAreas": "boolean",
    "status": "string",
    "totalSpots": "number",
    "hiddenSpotsCount": "number",
    "localRatingAvg": "number | null",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### エラーレスポンス（404 Not Found）
```json
{
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "指定された旅行が見つかりません"
  }
}
```

### PUT /api/v1/trips/:id
旅行情報を更新する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### リクエスト
```json
{
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "chaosLevel": "number",
  "avoidTouristSpots": "boolean",
  "avoidJapaneseServices": "boolean",
  "avoidCrowdedAreas": "boolean"
}
```

#### レスポンス（200 OK）
旅行詳細と同じ形式

### DELETE /api/v1/trips/:id
旅行を削除する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（204 No Content）
レスポンスボディなし

## 隠れ名所発見API

### POST /api/v1/trips/:id/discover
AIを使用して隠れ名所を発見し、旅程を生成する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（202 Accepted）
```json
{
  "jobId": "uuid",
  "status": "processing",
  "estimatedTime": "number", // 秒
  "message": "隠れ名所を発見中です..."
}
```

### GET /api/v1/trips/:id/discover/status
隠れ名所発見処理の状況を確認する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（200 OK）
```json
{
  "jobId": "uuid",
  "status": "processing" | "completed" | "failed",
  "progress": "number", // 0-100
  "message": "string",
  "result": {
    "hiddenSpotsCount": "number",
    "totalSpots": "number",
    "averageRating": "number"
  } // status が completed の場合のみ
}
```

## 隠れ名所API

### GET /api/v1/trips/:id/hidden-spots
旅行の隠れ名所一覧を取得する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### クエリパラメータ
- `type`: string (optional) - スポットタイプフィルタ
- `sort`: string (optional) - ソート順（"rating_desc", "order_asc"）

#### レスポンス（200 OK）
```json
{
  "hiddenSpots": [
    {
      "id": "uuid",
      "name": "string",
      "nameLocal": "string | null",
      "type": "string",
      "description": "string | null",
      "descriptionLocal": "string | null",
      "localRating": "number | null",
      "reviewsCount": "number",
      "languageRequirement": "string | null",
      "priceRange": "string | null",
      "speciality": "string | null",
      "address": "string | null",
      "latitude": "number | null",
      "longitude": "number | null",
      "imageUrl": "string | null",
      "aiConfidenceScore": "number | null",
      "orderInTrip": "number | null"
    }
  ]
}
```

### GET /api/v1/trips/:id/hidden-spots/:spotId
特定の隠れ名所の詳細情報を取得する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）
- `spotId`: string - 隠れ名所ID（UUID）

#### レスポンス（200 OK）
隠れ名所詳細情報（上記と同じ形式）

## 旅程API

### GET /api/v1/trips/:id/itinerary
旅行の旅程を取得する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（200 OK）
```json
{
  "itinerary": [
    {
      "id": "uuid",
      "dayNumber": "number",
      "title": "string",
      "activities": [
        {
          "id": "uuid",
          "time": "14:00",
          "activity": "string",
          "type": "移動" | "食事" | "探索" | "体験" | "冒険" | "準備",
          "hiddenSpot": {
            "id": "uuid",
            "name": "string",
            "type": "string"
          } // 関連する隠れ名所がある場合
        }
      ]
    }
  ]
}
```

## 現地情報API

### GET /api/v1/trips/:id/local-info
旅行先の現地情報を取得する。

#### 認証
必要

#### パスパラメータ
- `id`: string - 旅行ID（UUID）

#### レスポンス（200 OK）
```json
{
  "localInfo": {
    "countryCode": "string",
    "languageCode": "string",
    "basicPhrases": {
      "hello": {
        "japanese": "こんにちは",
        "local": "Xin chào",
        "pronunciation": "シン チャオ"
      }
      // その他のフレーズ
    },
    "emergencyContacts": {
      "police": "113",
      "ambulance": "115",
      "fire": "114",
      "japanese_embassy": {
        "name": "ハノイ総領事館",
        "phone": "+84-24-3846-3000",
        "address": "string"
      }
    },
    "travelTips": {
      "tips": ["string"],
      "cultural_notes": ["string"]
    }
  }
}
```

## システムAPI

### GET /health
システムのヘルスチェック。

#### 認証
不要

#### レスポンス（200 OK）
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "ai": "healthy"
  }
}
```

### GET /docs
OpenAPI仕様書（JSON形式）を取得する。

#### 認証
不要

#### レスポンス（200 OK）
OpenAPI 3.0 JSON仕様書

### GET /swagger
Swagger UI を表示する。

#### 認証
不要

#### レスポンス（200 OK）
HTML（Swagger UI）

## エラーハンドリング

### 共通エラーレスポンス形式
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

### エラーコード一覧

#### 認証・認可エラー
- `AUTHENTICATION_ERROR` (401): 認証に失敗
- `INVALID_ID_TOKEN` (401): IDトークンが無効
- `TOKEN_EXPIRED` (401): トークンが期限切れ
- `AUTHORIZATION_ERROR` (403): 権限がない

#### バリデーションエラー
- `VALIDATION_ERROR` (400): リクエストデータが不正
- `MISSING_REQUIRED_FIELD` (400): 必須フィールドが不足
- `INVALID_FIELD_FORMAT` (400): フィールド形式が不正

#### リソースエラー
- `TRIP_NOT_FOUND` (404): 旅行が見つからない
- `HIDDEN_SPOT_NOT_FOUND` (404): 隠れ名所が見つからない
- `USER_NOT_FOUND` (404): ユーザーが見つからない

#### 業務エラー
- `TRIP_ALREADY_COMPLETED` (409): 旅行が既に完了済み
- `AI_PROCESSING_IN_PROGRESS` (409): AI処理が既に進行中
- `DISCOVERY_FAILED` (422): 隠れ名所発見に失敗

#### システムエラー
- `INTERNAL_SERVER_ERROR` (500): サーバー内部エラー
- `SERVICE_UNAVAILABLE` (503): サービス利用不可
- `AI_SERVICE_ERROR` (503): AIサービスエラー

### HTTPステータスコード

- **200 OK**: 成功
- **201 Created**: 作成成功
- **202 Accepted**: 非同期処理受付
- **204 No Content**: 成功（レスポンスボディなし）
- **400 Bad Request**: リクエストエラー
- **401 Unauthorized**: 認証エラー
- **403 Forbidden**: 認可エラー
- **404 Not Found**: リソースが見つからない
- **409 Conflict**: 競合状態
- **422 Unprocessable Entity**: 業務ロジックエラー
- **500 Internal Server Error**: サーバーエラー
- **503 Service Unavailable**: サービス利用不可

## レート制限

### 一般API
- **制限**: 1000リクエスト/1時間/ユーザー
- **ヘッダー**: 
  - `X-RateLimit-Limit`: 制限数
  - `X-RateLimit-Remaining`: 残り回数
  - `X-RateLimit-Reset`: リセット時刻

### AI処理API
- **制限**: 10リクエスト/1日/ユーザー
- **理由**: AI処理コストの管理

### 制限超過レスポンス（429 Too Many Requests）
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト制限を超えました",
    "details": [
      {
        "field": "reset_time",
        "message": "2024-01-01T12:00:00Z にリセットされます"
      }
    ]
  }
}
```

## バージョン管理

### APIバージョニング
- **形式**: URLパスによるバージョニング（`/api/v1/`）
- **互換性**: メジャーバージョン間での破壊的変更あり
- **サポート期間**: 旧バージョンは1年間サポート

### レスポンスヘッダー
```
API-Version: v1
```

## セキュリティ

### CORS設定
```javascript
{
  origin: ['https://offpath.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### セキュリティヘッダー
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### 入力検証
- **Zod**: スキーマベースバリデーション
- **サニタイゼーション**: HTMLタグエスケープ
- **SQLインジェクション対策**: ORMによるパラメータクエリ

## OpenAPI仕様書生成

### 自動生成
- **ツール**: Hono + OpenAPI生成ライブラリ
- **設定**: `pnpm run generate:openapi`
- **出力**: `packages/api/openapi.json`

### フロントエンド型生成
- **コマンド**: `pnpm run generate:api-client`
- **出力**: `packages/web/utils/api-types.ts`
- **クライアント**: openapi-fetch使用