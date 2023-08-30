import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/window/index.tsx'],
  bundle: true,
  minify: true,
  outfile: 'dist/window.bundle.js',
  loader: {
    '.pug': 'empty',
    '.woff2': 'file',
  },
  logLevel: 'info',
});
