import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/redux-devtools-log-monitor.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-log-monitor.esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [
      /@babel\/runtime/,
      'react',
      'prop-types',
      'redux-devtools-themes',
      '@redux-devtools/core',
      'lodash.debounce',
      'react-json-tree',
    ],
  },
];

export default config;
