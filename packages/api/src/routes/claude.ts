import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

// Claude Codeからのタスク送信用スキーマ
const claudeTaskSchema = z.object({
  task_type: z.string().describe('タスクの種類（例: document_generation, code_review）'),
  prompt: z.string().describe('Claude Codeからの具体的な指示'),
  files: z.array(z.string()).optional().describe('対象ファイルパス（オプション）'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  metadata: z.record(z.unknown()).optional().describe('追加のメタデータ'),
});

// Claude Codeからn8nへタスク送信
app.post('/send-task', zValidator('json', claudeTaskSchema), async (c) => {
  const taskData = c.req.valid('json');
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    return c.json({ success: false, error: 'N8N_WEBHOOK_URL が設定されていません' }, 500);
  }

  try {
    // n8nに送信するペイロード
    const payload = {
      source: 'claude-code',
      timestamp: new Date().toISOString(),
      task_id: `task_${Date.now()}`,
      ...taskData,
    };

    console.log('🚀 n8nにタスクを送信中...', payload);

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    console.log('✅ n8nからの応答:', result);

    return c.json({
      success: true,
      task_id: payload.task_id,
      status: response.status,
      n8n_response: result,
    });
  } catch (error) {
    console.error('❌ n8nへのタスク送信エラー:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// タスク状況確認用（将来的な拡張）
app.get('/task/:taskId', (c) => {
  const taskId = c.req.param('taskId');
  return c.json({
    task_id: taskId,
    status: 'processing',
    message: 'タスク状況確認機能は開発中です',
  });
});

export default app;