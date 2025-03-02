import path from 'node:path';
import {
  fileURLToPath,
} from 'node:url';

import {
  defineConfig,
} from 'vite';
import dtsPlugin from 'vite-plugin-dts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'BemModifierClasses',
      formats: ['cjs', 'es', 'umd'],
      fileName: 'index',
    },
  },
});
