import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [
    { out: 'background.bundle', in: 'src/background/index.ts' },
    { out: 'options.bundle', in: 'src/options/index.tsx' },
    { out: 'window.bundle', in: 'src/window/index.tsx' },
    { out: 'remote.bundle', in: 'src/remote/index.tsx' },
    { out: 'devpanel.bundle', in: 'src/devpanel/index.tsx' },
    { out: 'devtools.bundle', in: 'src/devtools/index.ts' },
    { out: 'content.bundle', in: 'src/contentScript/index.ts' },
    { out: 'page.bundle', in: 'src/pageScript/index.ts' },
  ],
  bundle: true,
  logLevel: 'info',
  outdir: 'dist',
  minify: true,
  loader: {
    '.pug': 'empty',
    '.woff2': 'file',
  },
});
