import { parseCode } from './parse';
import { createCodeComponent } from './compile';

export const exportCode = (componentName: string, code: string) => {
  return createCodeComponent(componentName, parseCode(code));
}