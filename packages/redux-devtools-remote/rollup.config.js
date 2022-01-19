import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/redux-devtools-remote.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-remote.esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [
      /@babel\/runtime/,
      'jsan',
      'socketcluster-client',
      '@redux-devtools/utils',
      '@redux-devtools/instrument',
      'rn-host-detect',
    ],
  },
];

export default config;
