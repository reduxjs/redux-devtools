import * as fs from 'node:fs';
import * as esbuild from 'esbuild';
import pug from 'pug';

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
  // TODO Define process.env.NODE_ENV and process.env.BABEL_ENV
});

console.log('Creating HTML files...');
const htmlFiles = ['devpanel', 'devtools', 'options', 'remote', 'window'];
for (const htmlFile of htmlFiles) {
  fs.writeFileSync(
    `dist/${htmlFile}.html`,
    pug.renderFile(`src/${htmlFile}/${htmlFile}.pug`),
  );
}

console.log('Copying manifest.json...');
fs.copyFileSync('chrome/manifest.json', 'dist/manifest.json');

console.log('Copying assets...');
fs.cpSync('src/assets', 'dist', { recursive: true });

// TODO Babel?

// TODO Remember ot run TypeScript
