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

const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function writeManifest(browser, outPath) {
  const manifest = JSON.parse(
    fs.readFileSync(`${browser}/manifest.json`, 'utf8'),
  );
  manifest.version = version;
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
}

console.log(`Writing manifest.json (version ${version})...`);
writeManifest('chrome', 'dist/manifest.json');

console.log('Copying assets...');
fs.cpSync('src/assets', 'dist', { recursive: true });

console.log('Copying dist for each browser...');
for (const browser of ['chrome', 'edge', 'firefox']) {
  fs.cpSync('dist', `${browser}/dist`, { recursive: true });
  writeManifest(browser, `${browser}/dist/manifest.json`);
}
