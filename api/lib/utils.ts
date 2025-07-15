import ky from 'ky';
import type { Context } from 'hono';

import { cssVarsToCss } from './css-transformer';
import { registryItemSchema, type RegistryItem } from 'shadcn/registry';

export async function getThemeCss(themeId: string): Promise<string | null> {
  const url = `https://tweakcn.com/r/themes/${themeId}`;
  const theme = await ky
    .get(url, { throwHttpErrors: false, timeout: false })
    .json<RegistryItem>();

  const parsedRegistryItem = registryItemSchema.safeParse(theme);
  if (!parsedRegistryItem.success) {
    return null;
  }

  const registryItem = parsedRegistryItem.data;
  const themeCss = cssVarsToCss(registryItem.cssVars ?? {});

  return themeCss;
}

export async function processContent({
  content,
  c,
}: {
  content: string;
  c: Context;
}): Promise<string | null | undefined> {
  const themeId = c.req.query('theme');

  if (themeId) {
    const css = await getThemeCss(themeId);

    
    return css;
  }

  return content;
}
