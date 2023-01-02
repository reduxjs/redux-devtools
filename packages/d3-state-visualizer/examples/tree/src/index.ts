import { tree } from 'd3-state-visualizer';

const appState = {
  todoStore: {
    todos: [
      { title: 'd3' },
      { title: 'state' },
      { title: 'visualizer' },
      { title: 'tree' },
    ],
    completedCount: 1,
    alphabeticalOrder: true,
  },
  someStore: {
    someProperty: 0,
    someObject: {
      anotherProperty: 'value',
      someArray: [0, 1, 2],
    },
  },
};

const render = tree(document.getElementById('root')!, {
  state: appState,
  id: 'treeExample',
  size: 1000,
  aspectRatio: 0.5,
  isSorted: false,
  widthBetweenNodesCoeff: 1.5,
  heightBetweenNodesCoeff: 2,
  chartStyles: { border: '1px solid black' },
  tooltipOptions: { offset: { left: 30, top: 10 }, indentationSize: 2 },
});

render();
