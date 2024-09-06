import * as esbuild from 'esbuild';

const args = process.argv.slice(2);
const prod = !args.includes('--dev');

await esbuild.build({
  bundle: true,
  logLevel: 'info',
  format: 'iife',
  globalName: 'ReduxDevToolsApp',
  outfile: prod ? 'umd/redux-devtools-app.min.js' : 'umd/redux-devtools-app.js',
  minify: prod,
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': prod ? '"production"' : '"development"',
  },
  entryPoints: ['src/index.tsx'],
  loader: {
    '.woff2': 'dataurl',
  },
  plugins: [
    importAsGlobals({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
  ],
});

// https://github.com/evanw/esbuild/issues/337#issuecomment-954633403
function importAsGlobals(mapping) {
  // https://stackoverflow.com/a/3561711/153718
  const escRe = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const filter = new RegExp(
    Object.keys(mapping)
      .map((mod) => `^${escRe(mod)}$`)
      .join('|'),
  );

  return {
    name: 'global-imports',
    setup(build) {
      build.onResolve({ filter }, (args) => {
        if (!mapping[args.path]) {
          throw new Error('Unknown global: ' + args.path);
        }
        return {
          path: args.path,
          namespace: 'external-global',
        };
      });

      build.onLoad(
        {
          filter,
          namespace: 'external-global',
        },
        async (args) => {
          const global = mapping[args.path];
          return {
            contents: `module.exports = ${global};`,
            loader: 'js',
          };
        },
      );
    },
  };
}
