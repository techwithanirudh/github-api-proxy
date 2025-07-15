import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import ky from 'ky';
import mime from 'mime';
import { processContent } from './lib/utils';

const app = new Hono().basePath('/api');
app.use('*', cors());

app.get('/release/:tag', async (c) => {
  const owner = 'techwithanirudh';
  const repo = 'coolify-tweaks';
  const tag = c.req.param('tag');
  const asset = 'main.user.css';

  const url = `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  try {
    const res = await ky.get(url, { throwHttpErrors: false, timeout: false });

    if (!res.ok) {
      return c.json(
        {
          error: `GitHub returned ${res.status}: ${res.statusText}`,
          url,
          tag,
        },
        res.status as ContentfulStatusCode
      );
    }

    const headers = new Headers(res.headers);
    const detected = mime.getType(asset);

    const content = await res.text();
    const result = await processContent({
      content,
      c,
    });

    headers.delete('Content-Encoding');
    headers.delete('Content-Disposition');
    headers.set('Content-Type', detected || 'application/octet-stream');
    headers.set('X-Proxy-Host', 'github.com');

    return new Response(result, { status: res.status, headers });
  } catch (error) {
    return c.json(
      {
        error: 'Failed to fetch release asset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'coolify-tweaks',
  });
});

app.get('/', (c) => {
  return c.json({
    service: 'Coolify Tweaks',
    description: 'Proxies GitHub release assets for Coolify Tweaks',
    endpoints: {
      releases: '/api/release/:tag',
      health: '/api/health',
    },
  });
});

export default app;
