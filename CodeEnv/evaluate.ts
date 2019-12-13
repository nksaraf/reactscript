const SCOPE_RESTRICTIONS: { [key: string]: boolean } = {
  default: true,
  this: true
};

export function evaluateCode(source: any, scope: any = {}) {
  const values: any[] = [];
  const keys: string[] = [];

  Object.keys(scope).forEach((key: string) => {
    if (!SCOPE_RESTRICTIONS[key]) {
      keys.push(key);
      values.push(scope[key]);
    }
  });

  return Function(
    ...Array.from(keys),
    `return eval(${JSON.stringify(source)})`
  ).apply(scope.this, values);
}