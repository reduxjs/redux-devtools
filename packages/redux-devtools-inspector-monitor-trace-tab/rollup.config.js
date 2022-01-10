import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const config = [
  {
    input: 'src/StackTraceTab.tsx',
    output: [
      {
        file: 'dist/redux-devtools-inspector-monitor-trace-tab.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/redux-devtools-inspector-monitor-trace-tab.esm.js',
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
      nodePolyfills(),
    ],
    external: [
      /@babel\/runtime/,
      'react',
      'redux-devtools-themes',
      'source-map',
      '@babel/code-frame',
      'anser',
      'html-entities',
    ],
  },
];

export default config;
