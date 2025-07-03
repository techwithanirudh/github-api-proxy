import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import ky from 'ky';
import { repo, headers as stripHeaders } from './config';

export const config = { runtime: 'edge' };

const app = new Hono().basePath('/api');
app.use('*', cors());

app.get('/release/:tag/:asset', async (c) => {
  const tag = c.req.param('tag');
  const asset = c.req.param('asset');
  const url = `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  const res = await ky.get(url, {
    throwHttpErrors: false,
    timeout: false,
  });

  if (!res.ok) {
    return c.json(
      { error: `GitHub returned ${res.status}: ${res.statusText}` },
      res.status as ContentfulStatusCode
    );
  }

  const headersObj = new Headers(res.headers);
  for (const bad of stripHeaders) {
    for (const key of Array.from(headersObj.keys())) {
      if (key.toLowerCase().startsWith(bad)) {
        headersObj.delete(key);
      }
    }
  }
  headersObj.set('X-Proxy-Host', 'github.com');

  return new Response(res.body, { status: res.status, headers: headersObj });
});

export default handle(app);
