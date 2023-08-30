import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [
    { out: 'remote.bundle', in: 'src/remote/index.tsx' },
    { out: 'window.bundle', in: 'src/window/index.tsx' },
  ],
  bundle: true,
  minify: true,
  splitting: true,
  format: 'esm',
  outdir: 'dist',
  loader: {
    '.pug': 'empty',
    '.woff2': 'file',
  },
  logLevel: 'info',
});
