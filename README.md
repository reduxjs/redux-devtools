![GitHub Workflow Status](https://img.shields.io/github/workflow/status/reduxjs/redux-devtools/CI)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=round-square)](https://github.com/reduxjs/redux-devtools/pulls)
[![OpenCollective](https://opencollective.com/redux-devtools-extension/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/redux-devtools-extension/sponsors/badge.svg)](#sponsors)

# Redux DevTools

Developer Tools to power-up [Redux](https://redux.js.org/) development workflow or any other architecture which handles the state change (see [integrations](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/Integrations.md)).

It can be used as a browser extension (for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd), [Edge](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)), as [a standalone app](https://github.com/reduxjs/redux-devtools/tree/main/packages/redux-devtools-app) or as [a React component](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools) integrated in the client app.

![image](https://user-images.githubusercontent.com/7957859/48663602-3aac4900-ea9b-11e8-921f-97059cbb599c.png)

## Documentation

- [Browser Extension Installation and Configuration](https://github.com/reduxjs/redux-devtools/tree/main/extension#installation)
- [Manual Integration as a React Component](./docs/Walkthrough.md#manual-integration)
- [Extension Options (Arguments)](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md)
- [Extension Methods (Advanced API)](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Methods.md)
- [Remote monitoring](./docs/Integrations/Remote.md)
- [Troubleshooting](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/Troubleshooting.md)
- [Recipes](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/Recipes.md)
- [FAQ](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/FAQ.md)

## Development

This is a monorepo powered by [pnpm](https://pnpm.io/). [Install pnpm](https://pnpm.io/installation) and run `pnpm install` to get started. Each package's dependencies need to be built before the package itself can be built. You can either build all the packages (i.e., `pnpm run build:all`) or use pnpm workspace commands to build only the packages necessary for the packages you're working on (i.e., `pnpm --filter "remotedev-redux-devtools-extension" build`).

## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/redux-devtools-extension#backer)]

<a href="https://opencollective.com/redux-devtools-extension/backer/0/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/1/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/2/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/3/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/4/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/5/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/6/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/7/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/8/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/9/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/10/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/11/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/12/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/13/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/14/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/15/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/16/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/17/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/18/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/19/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/20/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/21/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/22/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/23/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/24/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/25/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/26/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/27/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/28/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/29/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/29/avatar.svg"></a>

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/redux-devtools-extension#sponsor)]

<a href="https://opencollective.com/redux-devtools-extension/sponsor/0/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/1/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/2/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/3/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/4/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/5/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/6/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/7/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/8/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/9/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/10/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/11/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/12/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/13/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/14/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/15/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/16/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/17/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/18/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/19/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/20/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/21/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/22/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/23/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/24/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/25/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/26/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/27/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/28/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/29/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/29/avatar.svg"></a>

### License

MIT
