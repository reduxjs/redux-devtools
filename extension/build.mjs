import * as fs from 'node:fs';
import * as esbuild from 'esbuild';
import pug from 'pug';

const args = process.argv.slice(2);
const prod = !args.includes('--dev');

await esbuild.build({
  bundle: true,
  logLevel: 'info',
  outdir: 'dist',
  minify: prod,
  sourcemap: !prod,
  define: {
    'process.env.NODE_ENV': prod ? '"production"' : '"development"',
    'process.env.BABEL_ENV': prod ? '"production"' : '"development"',
  },
  entryPoints: [
    { out: 'background.bundle', in: 'src/background/index.ts' },
    { out: 'options.bundle', in: 'src/options/index.tsx' },
    { out: 'remote.bundle', in: 'src/remote/index.tsx' },
    { out: 'devpanel.bundle', in: 'src/devpanel/index.tsx' },
    { out: 'devtools.bundle', in: 'src/devtools/index.ts' },
    { out: 'content.bundle', in: 'src/contentScript/index.ts' },
    { out: 'page.bundle', in: 'src/pageScript/index.ts' },
  ],
  loader: {
    '.woff2': 'file',
  },
});

console.log();

console.log('Creating HTML files...');
const htmlFiles = ['devpanel', 'devtools', 'options', 'remote'];
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

console.log('Copying dist for each browser...');
fs.cpSync('dist', 'chrome/dist', { recursive: true });
fs.copyFileSync('chrome/manifest.json', 'chrome/dist/manifest.json');
fs.cpSync('dist', 'edge/dist', { recursive: true });
fs.copyFileSync('edge/manifest.json', 'edge/dist/manifest.json');
fs.cpSync('dist', 'firefox/dist', { recursive: true });
fs.copyFileSync('firefox/manifest.json', 'firefox/dist/manifest.json');
