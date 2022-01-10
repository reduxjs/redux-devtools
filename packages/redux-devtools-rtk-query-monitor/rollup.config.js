import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/redux-devtools-rtk-query-monitor.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-rtk-query-monitor.esm.js',
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
      /@reduxjs\/toolkit/,
      'jss',
      'jss-preset-default',
      'react-base16-styling',
      'hex-rgba',
      'redux-devtools-themes',
      '@redux-devtools/ui',
      'lodash.debounce',
      'immutable',
      'react-json-tree',
    ],
  },
];

export default config;
