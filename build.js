import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'es2020',
  external: ['preact'],
  plugins: [sassPlugin()],
};

// Build CSS only (for JSR publishing)
await esbuild.build({
  ...buildOptions,
  outExtension: { '.js': '.css-temp.js' },
});

// Clean up temporary JS file (we only need the CSS)
import { unlinkSync } from 'fs';
try {
  unlinkSync('dist/index.css-temp.js');
} catch (e) {
  // Ignore if file doesn't exist
}

console.log('✓ CSS build complete!');
