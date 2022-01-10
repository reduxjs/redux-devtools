import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/redux-devtools-ui.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-ui.esm.js',
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
      /\.css/,
      'react',
      'prop-types',
      'styled-components',
      'color',
      'redux-devtools-themes',
      'base16',
      '@rjsf/core',
      /codemirror/,
      'react-select',
      /react-icons/,
      'simple-element-resize-detector',
    ],
  },
];

export default config;
