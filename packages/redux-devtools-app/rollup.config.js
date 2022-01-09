import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const config = [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/redux-devtools-app.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-app.esm.js',
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
      'react-redux',
      'redux',
      'localforage',
      /redux-persist/,
      '@redux-devtools/ui',
      'socketcluster-client',
      'jsan',
      /react-icons/,
      'styled-components',
      '@redux-devtools/slider-monitor',
      'prop-types',
      /lodash/,
      '@redux-devtools/core',
      '@redux-devtools/log-monitor',
      '@redux-devtools/rtk-query-monitor',
      '@redux-devtools/chart-monitor',
      '@redux-devtools/inspector-monitor',
      '@redux-devtools/inspector-monitor-trace-tab',
      '@redux-devtools/inspector-monitor-test-tab',
      'javascript-stringify',
      'jsondiffpatch',
      'd3-state-visualizer',
    ],
  },
];

export default config;
