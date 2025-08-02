-- プレゼン資料改善AI データベーススキーマ
-- PostgreSQL 15+ 対応

-- ============================================================================
-- Extensions
-- ============================================================================

-- UUID生成用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- JSON操作用
CREATE EXTENSION IF NOT EXISTS "jsonb_plpgsql";

-- 全文検索用
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- Enums
-- ============================================================================

CREATE TYPE processing_status AS ENUM (
    'uploaded',
    'validating', 
    'scanning',
    'extracting',
    'analyzing',
    'completed',
    'failed',
    'expired'
);

CREATE TYPE audience_type AS ENUM (
    'executive',
    'engineer', 
    'student',
    'sales',
    'other'
);

CREATE TYPE file_type AS ENUM (
    'image',
    'pdf',
    'text'
);

CREATE TYPE improvement_category AS ENUM (
    'title',
    'content',
    'structure',
    'clarity',
    'engagement',
    'visual',
    'audience_fit'
);

CREATE TYPE severity_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE log_level AS ENUM (
    'debug',
    'info',
    'warn',
    'error'
);

-- ============================================================================
-- Users テーブル（将来の認証機能用）
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Files テーブル
-- ============================================================================

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type file_type NOT NULL,
    size_bytes BIGINT NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    checksum VARCHAR(64), -- SHA-256ハッシュ
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- 制約
    CONSTRAINT chk_file_size CHECK (size_bytes > 0 AND size_bytes <= 10485760), -- 10MB制限
    CONSTRAINT chk_mime_type CHECK (
        mime_type IN (
            'image/png', 'image/jpeg', 'image/jpg',
            'application/pdf',
            'text/plain'
        )
    )
);

-- ============================================================================
-- Processing Sessions テーブル
-- ============================================================================

CREATE TABLE processing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    
    -- 処理状態
    status processing_status NOT NULL DEFAULT 'uploaded',
    audience_type audience_type NOT NULL,
    
    -- テキストデータ
    original_text TEXT,
    extracted_text TEXT,
    
    -- 処理結果（JSON形式で保存）
    analysis_result JSONB,
    
    -- メタデータ
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_message TEXT,
    error_details JSONB,
    
    -- LLM処理情報
    llm_model VARCHAR(100),
    llm_tokens_used INTEGER,
    llm_processing_time INTEGER, -- ミリ秒
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- IP制限用
    client_ip INET,
    user_agent TEXT
);

-- ============================================================================
-- Improvement Suggestions テーブル
-- ============================================================================

CREATE TABLE improvement_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES processing_sessions(id) ON DELETE CASCADE,
    
    -- 改善提案内容
    category improvement_category NOT NULL,
    severity severity_level NOT NULL,
    issue TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    example TEXT,
    reasoning TEXT NOT NULL,
    
    -- メタデータ
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- OCR Results テーブル
-- ============================================================================

CREATE TABLE ocr_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES processing_sessions(id) ON DELETE CASCADE,
    
    -- OCR結果
    extracted_text TEXT,
    confidence_score DECIMAL(5,2),
    language_detected VARCHAR(10),
    
    -- 処理情報
    ocr_engine VARCHAR(50),
    processing_time INTEGER, -- ミリ秒
    success BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Processing Logs テーブル
-- ============================================================================

CREATE TABLE processing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES processing_sessions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- ログ内容
    level log_level NOT NULL,
    event VARCHAR(100) NOT NULL,
    message TEXT,
    details JSONB,
    
    -- メタデータ
    client_ip INET,
    user_agent TEXT,
    processing_time INTEGER, -- ミリ秒
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- System Stats テーブル（運用監視用）
-- ============================================================================

CREATE TABLE system_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 統計データ
    date DATE NOT NULL,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    successful_sessions INTEGER NOT NULL DEFAULT 0,
    failed_sessions INTEGER NOT NULL DEFAULT 0,
    avg_processing_time INTEGER, -- ミリ秒
    total_files_processed INTEGER NOT NULL DEFAULT 0,
    total_storage_used BIGINT NOT NULL DEFAULT 0, -- バイト
    
    -- LLM使用統計
    total_llm_tokens INTEGER NOT NULL DEFAULT 0,
    total_llm_cost DECIMAL(10,4), -- USD想定
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 一日一レコード制約
    UNIQUE(date)
);

-- ============================================================================
-- インデックス
-- ============================================================================

-- Files テーブル
CREATE INDEX idx_files_expires_at ON files(expires_at);
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at DESC);

-- Processing Sessions テーブル
CREATE INDEX idx_sessions_status ON processing_sessions(status);
CREATE INDEX idx_sessions_user_id ON processing_sessions(user_id);
CREATE INDEX idx_sessions_created_at ON processing_sessions(created_at DESC);
CREATE INDEX idx_sessions_expires_at ON processing_sessions(expires_at);
CREATE INDEX idx_sessions_audience_type ON processing_sessions(audience_type);
CREATE INDEX idx_sessions_client_ip ON processing_sessions(client_ip);

-- 複合インデックス
CREATE INDEX idx_sessions_status_created ON processing_sessions(status, created_at DESC);
CREATE INDEX idx_sessions_user_status ON processing_sessions(user_id, status);

-- Improvement Suggestions テーブル
CREATE INDEX idx_improvements_session_id ON improvement_suggestions(session_id);
CREATE INDEX idx_improvements_category ON improvement_suggestions(category);
CREATE INDEX idx_improvements_severity ON improvement_suggestions(severity);
CREATE INDEX idx_improvements_order ON improvement_suggestions(session_id, order_index);

-- OCR Results テーブル
CREATE INDEX idx_ocr_session_id ON ocr_results(session_id);
CREATE INDEX idx_ocr_success ON ocr_results(success);
CREATE INDEX idx_ocr_engine ON ocr_results(ocr_engine);

-- Processing Logs テーブル
CREATE INDEX idx_logs_session_id ON processing_logs(session_id);
CREATE INDEX idx_logs_level ON processing_logs(level);
CREATE INDEX idx_logs_event ON processing_logs(event);
CREATE INDEX idx_logs_created_at ON processing_logs(created_at DESC);
CREATE INDEX idx_logs_client_ip ON processing_logs(client_ip);

-- 複合インデックス（ログ検索用）
CREATE INDEX idx_logs_level_created ON processing_logs(level, created_at DESC);
CREATE INDEX idx_logs_session_level ON processing_logs(session_id, level);

-- System Stats テーブル
CREATE INDEX idx_stats_date ON system_stats(date DESC);

-- ============================================================================
-- 全文検索インデックス
-- ============================================================================

-- セッション内容の全文検索
CREATE INDEX idx_sessions_text_search ON processing_sessions 
    USING gin(to_tsvector('japanese', COALESCE(original_text, '')));

-- 改善提案の全文検索
CREATE INDEX idx_improvements_text_search ON improvement_suggestions 
    USING gin(to_tsvector('japanese', issue || ' ' || suggestion || ' ' || COALESCE(reasoning, '')));

-- ============================================================================
-- パーティショニング（ログテーブル用）
-- ============================================================================

-- 月次パーティション設定（PostgreSQL 13+）
-- CREATE TABLE processing_logs_template (LIKE processing_logs INCLUDING ALL);
-- ALTER TABLE processing_logs_template ADD CONSTRAINT processing_logs_template_created_at_check 
--     CHECK ( created_at >= '2025-01-01'::timestamp AND created_at < '2025-02-01'::timestamp );

-- ============================================================================
-- トリガー関数
-- ============================================================================

-- updated_atの自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー設定
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON processing_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 完了時刻の自動設定
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('completed', 'failed') AND OLD.status != NEW.status THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_session_completed_at 
    BEFORE UPDATE ON processing_sessions 
    FOR EACH ROW EXECUTE FUNCTION set_completed_at();

-- ============================================================================
-- RLS (Row Level Security) 設定
-- ============================================================================

-- ユーザーは自分のセッションのみアクセス可能
ALTER TABLE processing_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_session_policy ON processing_sessions
    FOR ALL 
    TO web_user
    USING (user_id = current_user_id() OR user_id IS NULL);

-- ============================================================================
-- 権限設定
-- ============================================================================

-- アプリケーション用ロール作成
CREATE ROLE presentation_ai_app;

-- 基本権限
GRANT CONNECT ON DATABASE postgres TO presentation_ai_app;
GRANT USAGE ON SCHEMA public TO presentation_ai_app;

-- テーブル権限
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO presentation_ai_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO presentation_ai_app;

-- 読み取り専用ロール（分析用）
CREATE ROLE presentation_ai_readonly;
GRANT CONNECT ON DATABASE postgres TO presentation_ai_readonly;
GRANT USAGE ON SCHEMA public TO presentation_ai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO presentation_ai_readonly;

-- ============================================================================
-- 初期データ
-- ============================================================================

-- システム統計の初期化
INSERT INTO system_stats (date) VALUES (CURRENT_DATE)
ON CONFLICT (date) DO NOTHING;

-- ============================================================================
-- メンテナンス用ビュー
-- ============================================================================

-- アクティブセッション一覧
CREATE VIEW active_sessions AS
SELECT 
    s.id,
    s.status,
    s.audience_type,
    s.created_at,
    s.updated_at,
    s.progress,
    f.original_name,
    f.size_bytes,
    f.file_type
FROM processing_sessions s
LEFT JOIN files f ON s.file_id = f.id
WHERE s.status NOT IN ('completed', 'failed', 'expired')
ORDER BY s.created_at DESC;

-- 処理統計ビュー
CREATE VIEW processing_statistics AS
SELECT 
    DATE(created_at) as date,
    status,
    audience_type,
    COUNT(*) as count,
    AVG(llm_processing_time) as avg_processing_time,
    AVG(progress) as avg_progress
FROM processing_sessions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), status, audience_type
ORDER BY date DESC, status;

-- エラー分析ビュー
CREATE VIEW error_analysis AS
SELECT 
    DATE(created_at) as date,
    error_message,
    COUNT(*) as occurrence_count,
    string_agg(DISTINCT client_ip::text, ', ') as affected_ips
FROM processing_sessions
WHERE status = 'failed' 
    AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), error_message
ORDER BY date DESC, occurrence_count DESC;

-- ============================================================================
-- ストアドプロシージャ
-- ============================================================================

-- 期限切れファイル削除
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- 期限切れセッションを削除
    UPDATE processing_sessions 
    SET status = 'expired' 
    WHERE expires_at < CURRENT_TIMESTAMP 
    AND status NOT IN ('expired', 'completed');
    
    -- 期限切れファイルを削除
    DELETE FROM files 
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- 古いログを削除（30日以上）
    DELETE FROM processing_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 統計更新
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS VOID AS $$
BEGIN
    INSERT INTO system_stats (
        date,
        total_sessions,
        successful_sessions, 
        failed_sessions,
        avg_processing_time,
        total_files_processed,
        total_llm_tokens
    )
    SELECT 
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'failed'),
        AVG(llm_processing_time) FILTER (WHERE llm_processing_time IS NOT NULL),
        COUNT(*) FILTER (WHERE file_id IS NOT NULL),
        SUM(COALESCE(llm_tokens_used, 0))
    FROM processing_sessions
    WHERE DATE(created_at) = CURRENT_DATE
    ON CONFLICT (date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        successful_sessions = EXCLUDED.successful_sessions,
        failed_sessions = EXCLUDED.failed_sessions,
        avg_processing_time = EXCLUDED.avg_processing_time,
        total_files_processed = EXCLUDED.total_files_processed,
        total_llm_tokens = EXCLUDED.total_llm_tokens;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- コメント
-- ============================================================================

COMMENT ON TABLE processing_sessions IS 'プレゼン資料の処理セッション情報';
COMMENT ON TABLE files IS 'アップロードされたファイル情報';
COMMENT ON TABLE improvement_suggestions IS 'LLMによる改善提案';
COMMENT ON TABLE ocr_results IS 'OCR処理結果';
COMMENT ON TABLE processing_logs IS 'システム処理ログ';
COMMENT ON TABLE system_stats IS 'システム統計情報';

COMMENT ON COLUMN processing_sessions.analysis_result IS 'LLM解析結果をJSON形式で保存';
COMMENT ON COLUMN processing_sessions.client_ip IS 'DOS攻撃対策用のIP記録';
COMMENT ON COLUMN files.checksum IS 'ファイル重複チェック用のSHA-256ハッシュ';

-- ============================================================================
-- 完了
-- ============================================================================

-- スキーマ作成完了ログ
INSERT INTO processing_logs (level, event, message, details)
VALUES ('info', 'SCHEMA_CREATED', 'Database schema created successfully', 
        jsonb_build_object('version', '1.0', 'created_at', CURRENT_TIMESTAMP));