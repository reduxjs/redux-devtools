d3tooltip
=========================

This tooltip aims for a minimal yet highly configurable API. It has a long way to go, but the essentials are there.

## Installation

`npm install d3-state-visualizer`

## Quick usage

```javascript
import d3 from 'd3';
import d3tooltip from 'd3tooltip';

const DOMNode = document.getElementById('chart');
const root = d3.select(DOMNode);
const vis = root.append('svg');

let options = {
  offset: {left: 30, top: 10}
};

vis.selectAll('circle').data(someData).enter()
  .append('circle')
  .attr('r', 10)
  .call(
    d3tooltip(d3, 'tooltipClassName', options)
      .text((d, i) => toStringOrHtml(d))
      .attr({ 'class': 'anotherClassName' })
      .style({ 'min-width': '50px', 'border-radius: 5px' })
  )
  .on({
    mouseover(d, i) {
      d3.select(this).style({
        fill: 'skyblue'
      });
    },
    mouseout(d, i) {
      d3.select(this).style({
        fill: 'black'
      });
    }
  });
```

## API

Option                    | Type         | Default             | Description
--------------------------|--------------|---------------------|--------------------------------------------------------------
`root`                    | DOM.Element  | `body`              | The tooltip will be added as a child of that element. You can also use a D3 [selection](https://github.com/mbostock/d3/wiki/Selections#d3_select)
`left`                    | Number       | `undefined`         | Sets the tooltip `x` absolute position instead of the mouse `x` position, relative to the `root` element
`top`                     | Number       | `undefined`         | Sets the tooltip `y` absolute position instead of the mouse `y` position, relative to the `root` element
`offset`                  | Object       | `{left: 0, top: 0}` | Sets the distance, starting from the cursor position, until the tooltip is rendered. **Warning**: only applicable if you don't provide a `left` or `top` option
