---
'@redux-devtools/app': major
---

The UMD bundle now exports the same thing as the library and includes the CSS in a sperate file. Therfore, the new usage is:

```diff
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redux DevTools</title>
+   <link href="/redux-devtools-app.min.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script src="/react.production.min.js"></script>
    <script src="/react-dom.production.min.js"></script>
    <script src="/redux-devtools-app.min.js"></script>
    <script src="/port.js"></script>
    <script>
      const container = document.querySelector('#root');
-     const element = React.createElement(ReduxDevToolsApp, {
+     const element = React.createElement(ReduxDevToolsApp.Root, {
        socketOptions: {
          hostname: location.hostname,
          port: reduxDevToolsPort,
          autoReconnect: true,
        },
      });
      ReactDOM.createRoot(container).render(element);
    </script>
  </body>
</html>
```
