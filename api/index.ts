import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import ky from 'ky';
import mime from 'mime';
import { allowedOwners, headers as stripHeaders } from './config';

export const config = { runtime: 'edge' };

const app = new Hono().basePath('/api');
app.use('*', cors());

const isOwnerAllowed = (owner: string): boolean => {
  return allowedOwners.includes(owner);
};

app.get('/release/:owner/:repo/:tag/:asset', async (c) => {
  const owner = c.req.param('owner');
  const repo = c.req.param('repo');
  const tag = c.req.param('tag');
  const asset = c.req.param('asset');

  if (!isOwnerAllowed(owner)) {
    return c.json(
      {
        error: `Access denied: Owner '${owner}' is not in the allowed owners list`,
        allowedOwners
      },
      403
    );
  }

  const url = `https://github.com/${owner}/${repo}/releases/${encodeURIComponent(tag)}/download/${encodeURIComponent(asset)}`;

  try {
    const res = await ky.get(url, { throwHttpErrors: false, timeout: false });

    if (!res.ok) {
      return c.json(
        {
          error: `GitHub returned ${res.status}: ${res.statusText}`,
          url: `${owner}/${repo}/releases/tag/${tag}`,
          requestedTag: tag,
          resolvedTag: tag
        },
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

    const detected = mime.getType(asset);
    headersObj.set('Content-Type', detected || 'application/octet-stream');
    headersObj.set('X-Proxy-Host', 'github.com');

    return new Response(res.body, { status: res.status, headers: headersObj });
  } catch (error) {
    return c.json(
      {
        error: 'Failed to fetch release asset',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'github-releases-server',
    allowedOwners
  });
});

app.get('/', (c) => {
  return c.json({
    service: 'GitHub Releases Server',
    description: 'Proxies GitHub release assets from configured allowed owners',
    endpoints: {
      releases: '/api/release/:owner/:repo/:tag/:asset',
      health: '/api/health'
    },
    allowedOwners
  });
});

export default handle(app);
