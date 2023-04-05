module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [{
    name: '@storybook/addon-essentials',
    options: {
      backgrounds: false
    }
  }],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  }
};