import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/redux-devtools-serialize.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-serialize.esm.js',
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
    external: [/@babel\/runtime/, 'jsan'],
  },
];

export default config;
