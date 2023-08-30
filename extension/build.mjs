import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [
    { out: 'background.bundle', in: 'src/background/index.ts' },
    { out: 'remote.bundle', in: 'src/remote/index.tsx' },
    { out: 'window.bundle', in: 'src/window/index.tsx' },
  ],
  bundle: true,
  minify: true,
  outdir: 'dist',
  loader: {
    '.pug': 'empty',
    '.woff2': 'file',
  },
  logLevel: 'info',
});
