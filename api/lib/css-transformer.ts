import postcss from 'postcss';

const LEADING_DASHES_REGEX = /^--/;

export function cssVarsToCss(cssVars: Record<string, Record<string, string>>) {
  const root = postcss.root();

  const baseLayer = postcss.atRule({
    name: 'layer',
    params: 'base',
    nodes: [],
    raws: {
      semicolon: true,
      before: '\n',
      between: ' ',
    },
  });

  root.append(baseLayer);

  for (const [themeKey, vars] of Object.entries(cssVars)) {
    const selector = themeKey === 'light' ? ':root' : `.${themeKey}`;

    const ruleNode = postcss.rule({
      selector,
      raws: { between: ' ', before: '\n  ' },
    });

    for (const [key, value] of Object.entries(vars)) {
      const prop = `--${key.replace(LEADING_DASHES_REGEX, '')}`;
      ruleNode.append(
        postcss.decl({
          prop,
          value,
          raws: { semicolon: true },
        })
      );
    }

    baseLayer.append(ruleNode);
  }

  return root.toString();
}
