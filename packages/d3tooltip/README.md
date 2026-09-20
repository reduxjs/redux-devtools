# d3tooltip

This tooltip aims for a minimal yet highly configurable API. It has a long way to go, but the essentials are there.
It was created by [@romseguy](https://github.com/romseguy) and merged from [`romseguy/d3tooltip`](https://github.com/romseguy/d3tooltip).

## Installation

`npm install d3-state-visualizer`

## Quick usage

```javascript
import * as d3 from 'd3';
import { tooltip } from 'd3tooltip';

const DOMNode = document.getElementById('chart');
const root = d3.select(DOMNode);
const vis = root.append('svg');

const options = {
  offset: { left: 30, top: 10 },
  styles: { 'min-width': '50px', 'border-radius': '5px' },
};

vis
  .selectAll('circle')
  .data(someData)
  .enter()
  .append('circle')
  .attr('r', 10)
  .call(
    d3tooltip('tooltipClassName', {
      ...options,
      text: (d) => toStringOrHtml(d),
    }),
  )
  .on('mouseover', function () {
    d3.select(this).style('fill', 'skyblue');
  })
  .on('mouseout', function () {
    d3.select(this).style('fill', 'black');
  });
```

## API

| Option   | Type               | Default             | Description                                                                                                                                                      |
| -------- | ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`   | DOM.Element        | `body`              | The tooltip will be added as a child of that element. You can also use a D3 [selection](https://github.com/mbostock/d3/wiki/Selections#d3_select).               |
| `left`   | Number             | `undefined`         | Sets the tooltip `x` absolute position instead of the mouse `x` position, relative to the `root` element.                                                        |
| `top`    | Number             | `undefined`         | Sets the tooltip `y` absolute position instead of the mouse `y` position, relative to the `root` element.                                                        |
| `offset` | Object             | `{left: 0, top: 0}` | Sets the distance, starting from the cursor position, until the tooltip is rendered. **Warning**: only applicable if you don't provide a `left` or `top` option. |
| `styles` | Object             | `{}`                | Sets the styles of the tooltip element.                                                                                                                          |
| `text`   | String or Function | `''`                | Sets the text of the tooltip. Can be a constant `string` or a function that takes the datum and returns a `string`.                                              |
