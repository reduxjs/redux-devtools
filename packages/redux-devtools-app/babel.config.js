const test = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ...(test ? ['babel-plugin-transform-import-meta'] : []),
  ],
};
