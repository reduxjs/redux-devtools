import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/redux-devtools-inspector-monitor-test-tab.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-inspector-monitor-test-tab.esm.js',
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
      '@redux-devtools/ui',
      /react-icons/,
      'javascript-stringify',
      'object-path',
      'jsan',
      'simple-diff',
      'es6template',
    ],
  },
];

export default config;
