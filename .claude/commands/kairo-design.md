# 設計書の作成

## 目的
既存のフロントエンドデザインとサービス設計書に基づいて、機能設計書、DB設計書を作成し、システム全体のアーキテクチャとデータフローを設計する。

## 前提条件
- `packages/web/` 配下にフロントエンド実装が存在する
- `packages/documents/docs/service-design.md`（サービス設計書）が存在する
- `packages/documents/docs/api_development_guideline.md`（APIガイドライン）が存在する
- `packages/documents/docs/architecture_guideline.md`（アーキテクチャガイドライン）が存在する
- `packages/documents/docs/` ディレクトリが存在する（なければ作成）

## 実行内容

### フェーズ1: 機能設計

1. **既存実装とドキュメントの調査**
   - `packages/web/` 配下のフロントエンド実装を調査し、既存のUIデザインパターンとコンポーネント構成を把握する
   - `packages/documents/docs/service-design.md`（サービス設計書）を参照し、プロジェクトの背景情報を理解する
   - `packages/documents/docs/api_development_guideline.md`（APIガイドライン）を参照し、DB設計の方針を理解する
   - `packages/documents/docs/architecture_guideline.md`（アーキテクチャガイドライン）を参照し、アーキテクチャ設計の方針を理解する

2. **デザインとサービス設計の分析**
   - フロントエンドデザインから必要な機能を推定する
   - サービス設計書からビジネス要件を理解する
   - UIデザインパターンから機能要件と非機能要件を抽出する
   - システムの境界を明確にする

3. **機能設計書の作成**
   - **認証・認可の要否判定**：認証が必要かどうかを判断
   - **認証・認可設計**（必要な場合）：認証方式、フロー、権限管理
   - **ファイルアップロード設計**（該当する場合）：アップロードフロー、保存先、制限事項
   - **Firestore設計**（使用する場合）：コレクション構造、セキュリティルール、処理分担
   - **フロントエンド/バックエンド分担**：各機能の処理分担、状態管理、キャッシュ戦略

4. **DB設計書の作成**
   - **テーブル設計**：必要なテーブルの洗い出しと構造定義
   - **ER図**：Mermaid記法によるテーブル間の関係図
   - **インデックス設計**：パフォーマンスを考慮したインデックス設計
   - **マイグレーション計画**：テーブル作成順序とマイグレーション戦略
   - **APIガイドライン準拠**：`docs/api_development_guideline.md`の規約に基づく設計

### フェーズ2: 技術設計

1. **アーキテクチャ設計**
   - `docs/architecture_guideline.md`に基づくアーキテクチャパターンの選択
   - システム全体のアーキテクチャを決定
   - フロントエンド/バックエンドの分離
   - マイクロサービスの必要性を検討

2. **データフロー図の作成**
   - Mermaid記法でデータフローを可視化
   - ユーザーインタラクションの流れ
   - システム間のデータの流れ

## 成果物

### フェーズ1の成果物
- `packages/documents/docs/design/feature-design.md` - 機能設計書
- `packages/documents/docs/design/db-design.md` - DB設計書

### フェーズ2の成果物
- `packages/documents/docs/design/` ディレクトリに以下を作成：
  - `architecture.md` - アーキテクチャ概要
  - `dataflow.md` - データフロー図

## 出力フォーマット例

### 機能設計書 (feature-design.md)
```markdown
# 機能設計書

## 概要
- 設計方針: フロントエンドデザインとサービス設計書に基づく機能設計
- アーキテクチャ準拠: docs/architecture_guideline.md

## ユーザー認証機能

### 機能概要
- ユーザーの登録、ログイン、ログアウト機能
- セッション管理とアクセス制御

### 認証・認可設計
- **認証方式**: JWT
- **有効期限**: 24時間
- **リフレッシュトークン**: あり
- **権限管理**: ロールベースアクセス制御

### フロントエンド/バックエンド分担
- **フロントエンド**: ログインフォーム、認証状態管理、リダイレクト制御
- **バックエンド**: 認証処理、トークン発行・検証、セッション管理

### セキュリティ要件
- パスワードハッシュ化（bcrypt）
- CSRF対策
- ブルートフォース攻撃対策

## 案件管理機能

### 機能概要
- 案件の登録、編集、削除、一覧表示
- 案件ステータス管理と進捗追跡

### データ設計
- **主要エンティティ**: 案件、クライアント、ステータス
- **関連性**: ユーザー（1）：案件（多）

### フロントエンド/バックエンド分担
- **フロントエンド**: CRUD画面、フィルタリング、ソート機能
- **バックエンド**: ビジネスロジック、データ整合性、検索機能

### ビジネスルール
- 案件削除時の関連データ処理
- ステータス変更時の履歴記録
- 納期アラート機能

## ダッシュボード機能

### 機能概要
- 案件一覧の可視化
- 進捗状況の統計表示
- 納期アラート表示

### フロントエンド/バックエンド分担
- **フロントエンド**: グラフ表示、リアルタイム更新、レスポンシブ対応
- **バックエンド**: 統計データ生成、キャッシュ戦略、パフォーマンス最適化

### パフォーマンス要件
- 初期表示: 3秒以内
- データ更新: 1秒以内
- 同時アクセス: 50ユーザー

## ファイルアップロード機能

### 機能概要
- 案件関連ファイルのアップロード・管理
- プロフィール画像アップロード

### 実装方式
- **方式**: プリサインドURL方式
- **保存先**: AWS S3
- **最大サイズ**: 5MB
- **許可形式**: JPG, PNG, PDF

### フロントエンド/バックエンド分担
- **フロントエンド**: ファイル選択UI、プログレス表示、プレビュー機能
- **バックエンド**: URL生成、ファイル検証、メタデータ管理
```

### DB設計書 (db-design.md)
```markdown
# DB設計書

## 概要
- DBMS: PostgreSQL
- ORM: Prisma
- 設計方針: docs/api_development_guideline.md に準拠
- アーキテクチャ方針: docs/architecture_guideline.md に準拠

## テーブル設計

### users テーブル
| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | ユーザーID |
| email | VARCHAR(255) | UNIQUE NOT NULL | メールアドレス |
| name | VARCHAR(100) | NOT NULL | 氏名 |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 更新日時 |

### projects テーブル
| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | プロジェクトID |
| user_id | UUID | FOREIGN KEY NOT NULL | ユーザーID |
| title | VARCHAR(200) | NOT NULL | プロジェクト名 |
| description | TEXT | | 説明 |
| status | VARCHAR(50) | NOT NULL | ステータス |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 更新日時 |

## ER図

\`\`\`mermaid
erDiagram
    users ||--o{ projects : "1対多"
    
    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    projects {
        UUID id PK
        UUID user_id FK
        VARCHAR title
        TEXT description
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
\`\`\`

## インデックス設計

### users テーブル
- PRIMARY KEY: id
- UNIQUE INDEX: email

### projects テーブル
- PRIMARY KEY: id
- INDEX: user_id (外部キー参照用)
- INDEX: status (ステータス検索用)

## マイグレーション計画

1. users テーブル作成
2. projects テーブル作成
3. 外部キー制約追加
4. インデックス作成
```

### architecture.md
```markdown
# アーキテクチャ設計

## システム概要
{システムの概要説明}

## 設計方針
- ガイドライン: docs/architecture_guideline.md に準拠
- アーキテクチャパターン: {ガイドラインに基づく選択}

## アーキテクチャパターン
- パターン: {選択したパターン}
- 理由: {選択理由（ガイドラインとの整合性を含む）}

## コンポーネント構成
### フロントエンド
- フレームワーク: Next.js
- 状態管理: {状態管理方法}

### バックエンド
- フレームワーク: Hono
- 認証方式: {認証方法}

### データベース
- DBMS: PostgreSQL
- ORM: Prisma
- キャッシュ: {キャッシュ戦略}

## ガイドライン準拠確認
- アーキテクチャガイドライン準拠項目
  - {具体的な準拠項目}
  - {具体的な準拠項目}
```

### dataflow.md
```markdown
# データフロー図

## ユーザーインタラクションフロー
\`\`\`mermaid
flowchart TD
    A[ユーザー] --> B[フロントエンド]
    B --> C[API Gateway]
    C --> D[バックエンド]
    D --> E[データベース]
\`\`\`

## データ処理フロー
\`\`\`mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as バックエンド
    participant D as データベース
    
    U->>F: アクション
    F->>B: APIリクエスト
    B->>D: クエリ実行
    D-->>B: 結果返却
    B-->>F: レスポンス
    F-->>U: 画面更新
\`\`\`
```

## 実行後の確認
- 作成したファイルの一覧を表示
- 設計の主要なポイントをサマリーで表示
- ユーザに確認を促すメッセージを表示
