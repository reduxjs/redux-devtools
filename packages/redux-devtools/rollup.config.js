import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/redux-devtools.cjs.js', format: 'cjs' },
      { file: 'dist/redux-devtools.esm.js', format: 'esm' },
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
      '@redux-devtools/instrument',
      /lodash/,
      'react',
      'prop-types',
      'react-redux',
    ],
  },
];

export default config;
