Redux DevTools
=========================

A better README is coming. But if you insist...

<img src='http://i.imgur.com/HMW2pjP.png' width='700'>

### Installation

It's out on NPM as `react-devtools@0.1.0`.  

[This commit](https://github.com/gaearon/redux-devtools/commit/0a2a97556e252bfad822ca438923774bc8b932a4) should give you an idea about how to add Redux DevTools for your app **but make sure to only apply `devTools()` in development!** In production, this will be terribly slow because actions just accumulate forever. (We'll need to implement a rolling window for dev too.)

### Running Examples

You can do this:

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

Oh, and you can do the same with the TodoMVC example as well.

### It's Ugly!

The design or usability is not the point. (Although we'll have better design in the future :-)  

**You can build a completely custom UI for it** because `<DevTools>` accepts a `monitor` React component prop. The included `LogMonitor` is just an example.

**[In fact I challenge you to build a custom monitor for Redux DevTools!](https://github.com/gaearon/redux-devtools/issues/3)**

Some crazy ideas for custom monitors:

* A slider that lets you jump between computed states just by dragging it
* An in-app layer that shows the last N states right in the app (e.g. for animation)
* A time machine like interface where the last N states of your app reside on different Z layers
* Feel free to come up with and implement your own! Check `LogMonitor` propTypes to see what you can do.


### License

MIT
