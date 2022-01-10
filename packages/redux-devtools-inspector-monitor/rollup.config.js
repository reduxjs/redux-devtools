import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/redux-devtools-inspector-monitor.cjs.js', format: 'cjs' },
      { file: 'dist/redux-devtools-inspector-monitor.esm.js', format: 'esm' },
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
      'react-base16-styling',
      '@redux-devtools/core',
      'jss',
      'jss-preset-default',
      'hex-rgba',
      'redux-devtools-themes',
      'immutable',
      'jsondiffpatch',
      'react-dragula',
      'react-json-tree',
      'dateformat',
      'lodash.debounce',
      'javascript-stringify',
    ],
  },
];

export default config;
