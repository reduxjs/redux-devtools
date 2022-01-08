import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: {
      name: 'd3tooltip',
      file: 'dist/d3tooltip.umd.js',
      format: 'umd',
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'd3tooltip',
      file: 'dist/d3tooltip.umd.min.js',
      format: 'umd',
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/d3tooltip.cjs.js', format: 'cjs', exports: 'auto' },
      { file: 'dist/d3tooltip.esm.js', format: 'esm' },
    ],
    plugins: [
      typescript(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: ['ramda', /@babel\/runtime/],
  },
];

export default config;
