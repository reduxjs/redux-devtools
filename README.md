Redux DevTools
=========================

A live-editing time travel environment for [Redux](https://github.com/rackt/redux).  
**[See Dan's React Europe talk demoing it!](http://youtube.com/watch?v=xsSnOQynTHs)**  

### Table of Contents

- [Features](#features)
- [Overview](#overview)
- [Chrome Extension](#chrome-extension)
- [Setup Instructions](#setup-instructions)
- [Custom Monitors](#custom-monitors)
- [License](#license)

[![build status](https://img.shields.io/travis/gaearon/redux-devtools/master.svg?style=flat-square)](https://travis-ci.org/gaearon/redux-devtools)
[![npm version](https://img.shields.io/npm/v/redux-devtools.svg?style=flat-square)](https://www.npmjs.com/package/redux-devtools)
[![npm downloads](https://img.shields.io/npm/dm/redux-devtools.svg?style=flat-square)](https://www.npmjs.com/package/redux-devtools)
[![redux channel on discord](https://img.shields.io/badge/discord-redux@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bWb10Ma)

![](http://i.imgur.com/J4GeW0M.gif)

### Features

* Lets you inspect every state and action payload
* Lets you go back in time by “cancelling” actions
* If you change the reducer code, each “staged” action will be re-evaluated
* If the reducers throw, you will see during which action this happened, and what the error was
* With `persistState()` store enhancer, you can persist debug sessions across page reloads

### Overview

Redux DevTools is a development time package that provides power-ups for your Redux development workflow. Be careful to strip its code in production (see [walkthrough](./docs/Walkthrough.md) for instructions)! To use Redux DevTools, you need to choose a “monitor”—a React component that will serve as a UI for the DevTools. Different tasks and workflows require different UIs, so Redux DevTools is built to be flexible in this regard. We recommend using [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) for inspecting the state and time travel, and wrap it in a [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) to quickly move it across the screen. That said, when you’re comfortable rolling up your own setup, feel free to do this, and share it with us.

If you came here looking for what do the “Reset”, “Revert”, “Sweep” or “Commit” buttons do, check out [the `LogMonitor` documentation](https://github.com/gaearon/redux-devtools-log-monitor/blob/master/README.md#features).

### Chrome Extension

If you don’t want to bother with installing Redux DevTools and integrating it into your project, consider using [Redux DevTools Chrome Extension](https://github.com/zalmoxisus/redux-devtools-extension). It provides access to the most popular monitors, is easy to configure to filter actions, and doesn’t require installing any packages.

### Setup Instructions

Read the installation [walkthrough](./docs/Walkthrough.md) for integration instructions and usage examples (`<DevTools>` component, `DevTools.instrument()`, exclude from production builds, gotchas).

### Running Examples

Clone the project:

```
git clone https://github.com/gaearon/redux-devtools.git
cd redux-devtools
```

Run `npm install` in the root folder:

```
npm install
```

Now you can open an example folder and run `npm install` there:

```
cd examples/counter # or examples/todomvc
npm install
```

Finally, run the development server and open the page:

```
npm start
open http://localhost:3000
```

Try clicking on actions in the log, or changing some code inside the reducers. You should see the action log re-evaluate the state on every code change.

Also try opening `http://localhost:3000/?debug_session=123`, click around, and then refresh. You should see that all actions have been restored from the local storage.

### Custom Monitors

**DevTools accepts monitor components so you can build a completely custom UI.** [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) and [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) are just examples of what is possible.

**[I challenge you to build a custom monitor for Redux DevTools!](https://github.com/gaearon/redux-devtools/issues/3)**

Some crazy ideas for custom monitors:

* A slider that lets you jump between computed states just by dragging it
* An in-app layer that shows the last N states right in the app (e.g. for animation)
* A time machine like interface where the last N states of your app reside on different Z layers
* Feel free to come up with and implement your own! Check [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) `propTypes` to see what you can do.

In fact some of these are implemented already:

#### [Slider Monitor](https://github.com/calesce/redux-slider-monitor)

![](https://camo.githubusercontent.com/47a3f427c9d2e0c763b74e33417b3001fe8604b6/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f662e636c2e6c792f6974656d732f3149335032323243334e3252314d3279314b33622f53637265656e2532305265636f7264696e67253230323031352d31322d3232253230617425323030372e3230253230504d2e6769663f763d3162363236376537)

#### [Inspector](https://github.com/alexkuz/redux-devtools-inspector)

![](http://i.imgur.com/fYh8fk5.gif)

#### [Diff Monitor](https://github.com/whetstone/redux-devtools-diff-monitor)

![](https://camo.githubusercontent.com/c2c0ba1ad82d003b5386404ae09c00763d73510c/687474703a2f2f692e696d6775722e636f6d2f72764352394f512e706e67)

#### [Filterable Log Monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/)

![redux-devtools-filterable-log-monitor](https://cloud.githubusercontent.com/assets/29597/12440009/182bb31c-beec-11e5-8fd0-bdda48e646b2.gif)

#### [Chart Monitor](https://github.com/romseguy/redux-devtools-chart-monitor)

![redux-devtools-chart-monitor](http://i.imgur.com/MSgvU6l.gif)

#### [Filter Actions](https://github.com/zalmoxisus/redux-devtools-filter-actions)

(Does not have a UI but can wrap any other monitor)

<img src='http://i.imgur.com/TlqnU0J.png' width='400'>

#### [Dispatch](https://github.com/YoruNoHikage/redux-devtools-dispatch)

![redux-devtools-dispatch](https://cloud.githubusercontent.com/assets/969003/12874321/2c3624ec-cdd2-11e5-9856-fd7e24efb8d5.gif)

#### Keep them coming!

Create a PR to add your custom monitor.

### License

MIT
