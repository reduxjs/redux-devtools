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
      file: 'dist/react-json-tree.umd.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      typescript(),
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
      file: 'dist/react-json-tree.umd.min.js',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      typescript(),
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
  {
    input: 'src/index.tsx',
    output: [
      { file: 'dist/react-json-tree.cjs.js', format: 'cjs' },
      { file: 'dist/react-json-tree.esm.js', format: 'esm' },
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
    ],
  },
];

export default config;
