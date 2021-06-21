# RTK Query Inspector monitor demo

## Running demo

### Working directory

Run the following commands from redux-devtools monorepo root directory.

### 1. Install monorepo depedencies

```bash
yarn
```

### 2. Install demo dependencies

```bash
yarn exec --cwd 'packages/redux-devtools-rtk-query-monitor/demo' yarn
```

### 3. Start demo

```bash
yarn lerna run --stream start --scope '@redux-devtools/rtk-query-monitor'
```
