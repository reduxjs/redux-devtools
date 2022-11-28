import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: {
      name: 'd3-state-visualizer',
      file: 'lib/umd/d3-state-visualizer.js',
      format: 'umd',
    },
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'd3-state-visualizer',
      file: 'lib/umd/d3-state-visualizer.min.js',
      format: 'umd',
    },
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      terser(),
    ],
  },
];

export default config;
