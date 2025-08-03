import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

// Webhook送信用のスキーマ
const webhookSchema = z.object({
  url: z.string().url(),
  data: z.record(z.unknown()),
  method: z.enum(['GET', 'POST']).default('POST'),
});

// n8nへWebhook送信
app.post('/send', zValidator('json', webhookSchema), async (c) => {
  const { url, data, method } = c.req.valid('json');

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined,
    });

    const result = await response.text();

    return c.json({
      success: true,
      status: response.status,
      data: result,
    });
  } catch (error) {
    console.error('Webhook送信エラー:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default app;