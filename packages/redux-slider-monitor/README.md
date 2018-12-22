## Redux Slider Monitor

[![npm version](https://img.shields.io/npm/v/redux-slider-monitor.svg?style=flat-square)](https://www.npmjs.com/package/redux-slider-monitor)

A custom monitor for use with [Redux DevTools](https://github.com/gaearon/redux-devtools).

It uses a slider based on [react-slider](https://github.com/mpowaga/react-slider) to slide between different recorded actions. It also features play/pause/step-through, which is inspired by some very cool [Elm](http://elm-lang.org/) [examples](http://elm-lang.org/blog/time-travel-made-easy).

[Try out the demo!](https://calesce.github.io/redux-slider-monitor/?debug_session=123)

<image src="https://s3.amazonaws.com/f.cl.ly/items/1I3P222C3N2R1M2y1K3b/Screen%20Recording%202015-12-22%20at%2007.20%20PM.gif?v=1b6267e7" width='800'>

### Installation

```npm install redux-slider-monitor```

### Recommended Usage

Use with [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor)
```javascript
<DockMonitor toggleVisibilityKey='ctrl-h'
             changePositionKey='ctrl-q'
             defaultPosition='bottom'
             defaultSize={0.15}>
  <SliderMonitor keyboardEnabled />
</DockMonitor>
```

Dispatch some Redux actions. Use the slider to navigate between the state changes.

Click the play/pause buttons to watch the state changes over time, or step backward or forward in state time with the left/right arrow buttons. Change replay speeds with the ```1x``` button, and "Live" will replay actions with the same time intervals in which they originally were dispatched.

## Keyboard shortcuts

Pass the ```keyboardEnabled``` prop to use these shortcuts

```ctrl+j```: play/pause

```ctrl+[```: step backward

```ctrl+]```: step forward


### Running Examples

You can do this:

```
git clone https://github.com/calesce/redux-slider-monitor.git
cd redux-slider-monitor
npm install

cd examples/todomvc
npm install
npm start
open http://localhost:3000
```

### License

MIT
