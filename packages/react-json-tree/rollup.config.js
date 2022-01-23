import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
  {
    input: 'src/index.tsx',
    output: {
      name: 'ReactJsonTree',
      file: 'lib/umd/react-json-tree.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: ['react'],
  },
  {
    input: 'src/index.tsx',
    output: {
      name: 'ReactJsonTree',
      file: 'lib/umd/react-json-tree.min.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      terser(),
    ],
    external: ['react'],
  },
];

export default config;
