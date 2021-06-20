# rtk-query polling example

## Description

A copy of https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/polling that
adds a connection via `remote-redux-devtools` to a devtools server.

## Run example

Runs the example at `localhost:3002`, `devtools-app` at `localhost:3000` and remote server at `8000`.

1. Install local dependencies

```bash
yarn exec --cwd 'packages/redux-devtools/examples/rtk-query-polling' yarn
```

2. Start example

```bash
yarn exec --cwd 'packages/redux-devtools/examples/rtk-query-polling' yarn start
```

3. Start devtools in another shell

```bash
yarn lerna run --parallel start  --scope '@redux-devtools/app' --scope '@redux-devtools/cli'
```
