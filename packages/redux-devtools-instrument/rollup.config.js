import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/instrument.ts',
    output: [
      { file: 'dist/redux-devtools-instrument.cjs.js', format: 'cjs' },
      { file: 'dist/redux-devtools-instrument.esm.js', format: 'esm' },
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [/@babel\/runtime/, /lodash/],
  },
];

export default config;
