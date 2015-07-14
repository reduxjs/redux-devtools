Redux DevTools
=========================

Haha. README coming. Also not on NPM yet.

### Running Examples

In the meantime, you can do this:

```
git clone https://github.com/gaearon/redux-devtools.git
cd redux-devtools
npm install

cd examples/counter
npm install
npm start
open http://localhost:3000
```

Try clicking on actions in the log, or changing some code inside `examples/counter/reducers/counter`.  
For fun, you can also open `http://localhost:3000/?debug_session=123`, click around, and then refresh.

Oh, and you can do this with the TodoMVC example as well.

### It's Ugly!

The design or usability is not the point. (Although we'll have better design in the future :-)  

You can build a completely custom UI for it because `<DevTools>` accepts a `monitor` React component prop. You can build any UI you want for it. The included `LogMonitor` is just an example.
