// プレゼン資料改善AI TypeScript型定義

// ============================================================================
// 基本エンティティ
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessingSession {
  id: string;
  userId?: string;
  status: ProcessingStatus;
  fileInfo?: FileInfo;
  audienceType: AudienceType;
  originalText?: string;
  analysisResult?: AnalysisResult;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface FileInfo {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: Date;
}

// ============================================================================
// 列挙型・定数
// ============================================================================

export enum ProcessingStatus {
  UPLOADED = 'uploaded',
  VALIDATING = 'validating',
  SCANNING = 'scanning',
  EXTRACTING = 'extracting',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum AudienceType {
  EXECUTIVE = 'executive',        // 経営者
  ENGINEER = 'engineer',          // エンジニア
  STUDENT = 'student',            // 学生
  SALES = 'sales',               // 営業担当
  OTHER = 'other'                // その他
}

export enum FileType {
  IMAGE = 'image',
  PDF = 'pdf',
  TEXT = 'text'
}

export enum ErrorCode {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  VIRUS_DETECTED = 'VIRUS_DETECTED',
  OCR_FAILED = 'OCR_FAILED',
  LLM_API_ERROR = 'LLM_API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SENSITIVE_CONTENT = 'SENSITIVE_CONTENT'
}

// ============================================================================
// API リクエスト・レスポンス型
// ============================================================================

export interface UploadRequest {
  file?: File;
  text?: string;
  audienceType: AudienceType;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    sessionId: string;
    status: ProcessingStatus;
  };
  error?: ApiError;
}

export interface ProcessStatusResponse {
  success: boolean;
  data?: {
    sessionId: string;
    status: ProcessingStatus;
    progress?: number;
    message?: string;
  };
  error?: ApiError;
}

export interface AnalysisResultResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: ApiError;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: string;
}

// ============================================================================
// 解析結果関連
// ============================================================================

export interface AnalysisResult {
  sessionId: string;
  originalText: string;
  audienceType: AudienceType;
  improvements: ImprovementSuggestion[];
  comparison: ComparisonData;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

export interface ImprovementSuggestion {
  category: ImprovementCategory;
  severity: SeverityLevel;
  issue: string;
  suggestion: string;
  example?: string;
  reasoning: string;
}

export enum ImprovementCategory {
  TITLE = 'title',              // タイトル
  CONTENT = 'content',          // 内容
  STRUCTURE = 'structure',      // 構成
  CLARITY = 'clarity',          // 明確性
  ENGAGEMENT = 'engagement',    // 興味・関心
  VISUAL = 'visual',           // 視覚的要素
  AUDIENCE_FIT = 'audience_fit' // 聞き手への適合性
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ComparisonData {
  before: {
    title?: string;
    content: string;
    keyPoints: string[];
  };
  after: {
    title?: string;
    content: string;
    keyPoints: string[];
    improvements: string[];
  };
  changes: ChangeHighlight[];
}

export interface ChangeHighlight {
  type: ChangeType;
  before: string;
  after: string;
  reason: string;
}

export enum ChangeType {
  ADDITION = 'addition',
  DELETION = 'deletion',
  MODIFICATION = 'modification',
  REORDER = 'reorder'
}

// ============================================================================
// OCR・ファイル処理関連
// ============================================================================

export interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  language?: string;
  error?: string;
  processingTime: number;
}

export interface FileValidationResult {
  isValid: boolean;
  fileType?: FileType;
  mimeType?: string;
  size?: number;
  errors: ValidationError[];
}

export interface ValidationError {
  code: ErrorCode;
  message: string;
  field?: string;
}

export interface VirusScanResult {
  isClean: boolean;
  threats?: string[];
  scanTime: number;
}

// ============================================================================
// LLM統合関連
// ============================================================================

export interface LLMRequest {
  text: string;
  audienceType: AudienceType;
  instructions?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  success: boolean;
  analysis?: {
    improvements: ImprovementSuggestion[];
    revisedContent: string;
    confidence: number;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: {
    type: string;
    message: string;
  };
  processingTime: number;
}

// ============================================================================
// フロントエンド状態管理
// ============================================================================

export interface AppState {
  currentSession?: ProcessingSession;
  uploadProgress: number;
  processingStatus: ProcessingStatus;
  analysisResult?: AnalysisResult;
  error?: ApiError;
  isLoading: boolean;
}

export interface UploadState {
  file?: File;
  text?: string;
  audienceType?: AudienceType;
  isDragActive: boolean;
  validationErrors: ValidationError[];
}

// ============================================================================
// 設定・構成
// ============================================================================

export interface AppConfig {
  maxFileSize: number;
  supportedMimeTypes: string[];
  ocrTimeout: number;
  llmTimeout: number;
  maxRetries: number;
  sessionExpiryHours: number;
}

export interface SecurityConfig {
  enableVirusScanning: boolean;
  enableSensitiveContentDetection: boolean;
  allowedFileTypes: FileType[];
  maxConcurrentUsers: number;
}

// ============================================================================
// ログ・監視
// ============================================================================

export interface ProcessingLog {
  sessionId: string;
  timestamp: Date;
  level: LogLevel;
  event: string;
  details?: Record<string, any>;
  userId?: string;
  ip?: string;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    storage: ServiceStatus;
    llmApi: ServiceStatus;
    ocrService: ServiceStatus;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  error?: string;
}

// ============================================================================
// ユーティリティ型
// ============================================================================

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ApiError;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// ============================================================================
// React Components Props
// ============================================================================

export interface FileUploadProps {
  onUpload: (request: UploadRequest) => void;
  isLoading: boolean;
  error?: ApiError;
  maxFileSize: number;
  supportedTypes: string[];
}

export interface AudienceSelectProps {
  value?: AudienceType;
  onChange: (type: AudienceType) => void;
  disabled?: boolean;
}

export interface ProgressDisplayProps {
  status: ProcessingStatus;
  progress?: number;
  message?: string;
}

export interface ResultComparisonProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export interface ImprovementListProps {
  improvements: ImprovementSuggestion[];
  onToggleDetails: (index: number) => void;
  expandedItems: number[];
}

// ============================================================================
// Hook型定義
// ============================================================================

export interface UseUploadReturn {
  upload: (request: UploadRequest) => Promise<void>;
  progress: number;
  isUploading: boolean;
  error?: ApiError;
  reset: () => void;
}

export interface UseProcessingReturn {
  sessionId?: string;
  status: ProcessingStatus;
  progress?: number;
  error?: ApiError;
  result?: AnalysisResult;
  startPolling: (sessionId: string) => void;
  stopPolling: () => void;
}

export interface UseFileValidationReturn {
  validateFile: (file: File) => FileValidationResult;
  validateText: (text: string) => ValidationError[];
  isValidating: boolean;
}

export default {};