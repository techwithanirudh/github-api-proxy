import type { Context } from 'hono';
import ky from 'ky';

import { cssVarsToCss } from './css-transformer';
import { type RegistryItem, registryItemSchema } from './validators';

const THEME_START = '/* ==UI-THEME-VARS:START== */';
const THEME_END = '/* ==UI-THEME-VARS:END== */';

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
  const theme = c.req.query('theme');
  const asset = c.req.query('asset') || 'main.user.css';

  if (theme && asset === 'main.user.css') {
    const css = await getThemeCss(theme);
    const wrappedCss = `${THEME_START}\n${css}\n${THEME_END}`;

    const themeRegex = new RegExp(
      `${THEME_START.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}[\\s\\S]*?${THEME_END.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}`,
      'm'
    );

    if (themeRegex.test(content)) {
      return content.replace(themeRegex, wrappedCss);
    }
  }

  return content;
}
