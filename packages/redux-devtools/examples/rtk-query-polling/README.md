# rtk-query polling example

## Description

A copy of https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react/polling that
adds a connection via `remote-redux-devtools` to a devtools server.

## Run example

```bash
yarn lerna run --parallel start \
  --scope 'rtk-query-polling' \
  --scope '@redux-devtools/app' \
  --scope '@redux-devtools/cli'
```

Runs the example at `localhost:3002`, `app` at `localhost:3000` and remote server at `8000`.
