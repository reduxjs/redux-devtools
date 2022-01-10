import d3, { ZoomEvent, Primitive } from 'd3';
import { isEmpty } from 'ramda';
import { map2tree } from 'map2tree';
import deepmerge from 'deepmerge';
import {
  getTooltipString,
  toggleChildren,
  visit,
  getNodeGroupByDepthCount,
} from './utils';
import { tooltip } from 'd3tooltip';

export interface InputOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  state?: {} | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  tree?: NodeWithId | {};

  rootKeyName: string;
  pushMethod: 'push' | 'unshift';
  id: string;
  style: { [key: string]: Primitive };
  size: number;
  aspectRatio: number;
  initialZoom: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isSorted: boolean;
  heightBetweenNodesCoeff: number;
  widthBetweenNodesCoeff: number;
  transitionDuration: number;
  blinkDuration: number;
  onClickText: (datum: NodeWithId) => void;
  tooltipOptions: {
    disabled?: boolean;
    left?: number | undefined;
    top?: number | undefined;
    offset?: {
      left: number;
      top: number;
    };
    style?: { [key: string]: Primitive } | undefined;
    indentationSize?: number;
  };
}

interface Options {
  // eslint-disable-next-line @typescript-eslint/ban-types
  state?: {} | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  tree?: NodeWithId | {};

  rootKeyName: string;
  pushMethod: 'push' | 'unshift';
  id: string;
  style: {
    node: {
      colors: {
        default: string;
        collapsed: string;
        parent: string;
      };
      radius: number;
    };
    text: {
      colors: {
        default: string;
        hover: string;
      };
    };
    link: {
      stroke: string;
      fill: string;
    };
  };
  size: number;
  aspectRatio: number;
  initialZoom: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isSorted: boolean;
  heightBetweenNodesCoeff: number;
  widthBetweenNodesCoeff: number;
  transitionDuration: number;
  blinkDuration: number;
  onClickText: () => void;
  tooltipOptions: {
    disabled: boolean;
    left: number | undefined;
    top: number | undefined;
    offset: {
      left: number;
      top: number;
    };
    style: { [key: string]: Primitive } | undefined;
    indentationSize?: number;
  };
}

const defaultOptions: Options = {
  state: undefined,
  rootKeyName: 'state',
  pushMethod: 'push',
  tree: undefined,
  id: 'd3svg',
  style: {
    node: {
      colors: {
        default: '#ccc',
        collapsed: 'lightsteelblue',
        parent: 'white',
      },
      radius: 7,
    },
    text: {
      colors: {
        default: 'black',
        hover: 'skyblue',
      },
    },
    link: {
      stroke: '#000',
      fill: 'none',
    },
  },
  size: 500,
  aspectRatio: 1.0,
  initialZoom: 1,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 50,
  },
  isSorted: false,
  heightBetweenNodesCoeff: 2,
  widthBetweenNodesCoeff: 1,
  transitionDuration: 750,
  blinkDuration: 100,
  onClickText: () => {
    // noop
  },
  tooltipOptions: {
    disabled: false,
    left: undefined,
    top: undefined,
    offset: {
      left: 0,
      top: 0,
    },
    style: undefined,
  },
};

export interface NodeWithId {
  name: string;
  children?: NodeWithId[] | null;
  _children?: NodeWithId[] | null;
  value?: unknown;
  id: string;

  parent?: NodeWithId;
  depth?: number;
  x?: number;
  y?: number;
}

interface NodePosition {
  parentId: string | null | undefined;
  id: string;
  x: number | undefined;
  y: number | undefined;
}

export default function (
  DOMNode: HTMLElement,
  options: Partial<InputOptions> = {}
) {
  const {
    id,
    style,
    size,
    aspectRatio,
    initialZoom,
    margin,
    isSorted,
    widthBetweenNodesCoeff,
    heightBetweenNodesCoeff,
    transitionDuration,
    blinkDuration,
    state,
    rootKeyName,
    pushMethod,
    tree,
    tooltipOptions,
    onClickText,
  } = deepmerge(defaultOptions, options) as Options;

  const width = size - margin.left - margin.right;
  const height = size * aspectRatio - margin.top - margin.bottom;
  const fullWidth = size;
  const fullHeight = size * aspectRatio;

  const attr: { [key: string]: Primitive } = {
    id,
    preserveAspectRatio: 'xMinYMin slice',
  };

  if (!(style as unknown as { [key: string]: Primitive }).width) {
    attr.width = fullWidth;
  }

  if (
    !(style as unknown as { [key: string]: Primitive }).width ||
    !(style as unknown as { [key: string]: Primitive }).height
  ) {
    attr.viewBox = `0 0 ${fullWidth} ${fullHeight}`;
  }

  const root = d3.select(DOMNode);
  const zoom = d3.behavior.zoom().scaleExtent([0.1, 3]).scale(initialZoom);
  const vis = root
    .append('svg')
    .attr(attr)
    .style({ cursor: '-webkit-grab', ...style } as unknown as {
      [key: string]: Primitive;
    })
    .call(
      zoom.on('zoom', () => {
        const { translate, scale } = d3.event as ZoomEvent;
        vis.attr(
          'transform',
          `translate(${translate.toString()})scale(${scale})`
        );
      })
    )
    .append('g')
    .attr({
      transform: `translate(${margin.left + style.node.radius}, ${
        margin.top
      }) scale(${initialZoom})`,
    });

  let layout = d3.layout.tree().size([width, height]);
  let data: NodeWithId;

  if (isSorted) {
    layout.sort((a, b) =>
      (b as NodeWithId).name.toLowerCase() <
      (a as NodeWithId).name.toLowerCase()
        ? 1
        : -1
    );
  }

  // previousNodePositionsById stores node x and y
  // as well as hierarchy (id / parentId);
  // helps animating transitions
  let previousNodePositionsById: { [nodeId: string]: NodePosition } = {
    root: {
      id: 'root',
      parentId: null,
      x: height / 2,
      y: 0,
    },
  };

  // traverses a map with node positions by going through the chain
  // of parent ids; once a parent that matches the given filter is found,
  // the parent position gets returned
  function findParentNodePosition(
    nodePositionsById: { [nodeId: string]: NodePosition },
    nodeId: string,
    filter: (nodePosition: NodePosition) => boolean
  ) {
    let currentPosition = nodePositionsById[nodeId];
    while (currentPosition) {
      currentPosition = nodePositionsById[currentPosition.parentId!];
      if (!currentPosition) {
        return null;
      }
      if (!filter || filter(currentPosition)) {
        return currentPosition;
      }
    }
  }

  return function renderChart(nextState = tree || state) {
    data = !tree
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        (map2tree(nextState as {}, {
          key: rootKeyName,
          pushMethod,
        }) as NodeWithId)
      : (nextState as NodeWithId);

    if (isEmpty(data) || !data.name) {
      data = {
        name: 'error',
        message: 'Please provide a state map or a tree structure',
      } as unknown as NodeWithId;
    }

    let nodeIndex = 0;
    let maxLabelLength = 0;

    // nodes are assigned with string ids, which reflect their location
    // within the hierarcy; e.g. "root|branch|subBranch|subBranch[0]|property"
    // top-level elemnt always has id "root"
    visit(
      data,
      (node) => {
        maxLabelLength = Math.max(node.name.length, maxLabelLength);
        node.id = node.id || 'root';
      },
      (node) =>
        node.children && node.children.length > 0
          ? node.children.map((c) => {
              c.id = `${node.id || ''}|${c.name}`;
              return c;
            })
          : null
    );

    update();

    function update() {
      // path generator for links
      const diagonal = d3.svg
        .diagonal<NodePosition>()
        .projection((d) => [d.y!, d.x!]);
      // set tree dimensions and spacing between branches and nodes
      const maxNodeCountByLevel = Math.max(...getNodeGroupByDepthCount(data));

      layout = layout.size([
        maxNodeCountByLevel * 25 * heightBetweenNodesCoeff,
        width,
      ]);

      const nodes = layout.nodes(data as d3.layout.tree.Node) as NodeWithId[];
      const links = layout.links(nodes as d3.layout.tree.Node[]);

      nodes.forEach(
        (node) =>
          (node.y = node.depth! * (maxLabelLength * 7 * widthBetweenNodesCoeff))
      );

      const nodePositions = nodes.map((n) => ({
        parentId: n.parent && n.parent.id,
        id: n.id,
        x: n.x,
        y: n.y,
      }));
      const nodePositionsById: { [nodeId: string]: NodePosition } = {};
      nodePositions.forEach((node) => (nodePositionsById[node.id] = node));

      // process the node selection
      const node = vis
        .selectAll('g.node')
        .property('__oldData__', (d: NodeWithId) => d)
        .data(nodes, (d) => d.id || (d.id = ++nodeIndex as unknown as string));
      const nodeEnter = node
        .enter()
        .append('g')
        .attr({
          class: 'node',
          transform: (d) => {
            const position = findParentNodePosition(
              nodePositionsById,
              d.id,
              (n) => !!previousNodePositionsById[n.id]
            );
            const previousPosition =
              (position && previousNodePositionsById[position.id]) ||
              previousNodePositionsById.root;
            return `translate(${previousPosition.y!},${previousPosition.x!})`;
          },
        })
        .style({
          fill: style.text.colors.default,
          cursor: 'pointer',
        })
        .on('mouseover', function mouseover(this: EventTarget) {
          d3.select(this).style({
            fill: style.text.colors.hover,
          });
        })
        .on('mouseout', function mouseout(this: EventTarget) {
          d3.select(this).style({
            fill: style.text.colors.default,
          });
        });

      if (!tooltipOptions.disabled) {
        nodeEnter.call(
          tooltip<NodeWithId>(d3, 'tooltip', { ...tooltipOptions, root })
            .text((d, i) => getTooltipString(d, i, tooltipOptions))
            .style(tooltipOptions.style)
        );
      }

      // g inside node contains circle and text
      // this extra wrapper helps run d3 transitions in parallel
      const nodeEnterInnerGroup = nodeEnter.append('g');
      nodeEnterInnerGroup
        .append('circle')
        .attr({
          class: 'nodeCircle',
          r: 0,
        })
        .on('click', (clickedNode) => {
          if ((d3.event as Event).defaultPrevented) return;
          toggleChildren(clickedNode);
          update();
        });

      nodeEnterInnerGroup
        .append('text')
        .attr({
          class: 'nodeText',
          'text-anchor': 'middle',
          transform: 'translate(0,0)',
          dy: '.35em',
        })
        .style({
          'fill-opacity': 0,
        })
        .text((d) => d.name)
        .on('click', onClickText);

      // update the text to reflect whether node has children or not
      node.select('text').text((d) => d.name);

      // change the circle fill depending on whether it has children and is collapsed
      node.select('circle').style({
        stroke: 'black',
        'stroke-width': '1.5px',
        fill: (d) =>
          d._children
            ? style.node.colors.collapsed
            : d.children
            ? style.node.colors.parent
            : style.node.colors.default,
      });

      // transition nodes to their new position
      const nodeUpdate = node
        .transition()
        .duration(transitionDuration)
        .attr({
          transform: (d) => `translate(${d.y!},${d.x!})`,
        });

      // ensure circle radius is correct
      nodeUpdate.select('circle').attr('r', style.node.radius);

      // fade the text in and align it
      nodeUpdate
        .select('text')
        .style('fill-opacity', 1)
        .attr({
          transform: function transform(this: SVGGraphicsElement, d) {
            const x =
              (d.children || d._children ? -1 : 1) *
              (this.getBBox().width / 2 + style.node.radius + 5);
            return `translate(${x},0)`;
          },
        });

      // blink updated nodes
      node
        .filter(function flick(this: any, d) {
          // test whether the relevant properties of d match
          // the equivalent property of the oldData
          // also test whether the old data exists,
          // to catch the entering elements!
          return this.__oldData__ && d.value !== this.__oldData__.value;
        })
        .select('g')
        .style('opacity', '0.3')
        .transition()
        .duration(blinkDuration)
        .style('opacity', '1');

      // transition exiting nodes to the parent's new position
      const nodeExit = node
        .exit()
        .transition()
        .duration(transitionDuration)
        .attr({
          transform: (d) => {
            const position = findParentNodePosition(
              previousNodePositionsById,
              d.id,
              (n) => !!nodePositionsById[n.id]
            );
            const futurePosition =
              (position && nodePositionsById[position.id]) ||
              nodePositionsById.root;
            return `translate(${futurePosition.y!},${futurePosition.x!})`;
          },
        })
        .remove();

      nodeExit.select('circle').attr('r', 0);

      nodeExit.select('text').style('fill-opacity', 0);

      // update the links
      const link = vis
        .selectAll('path.link')
        .data(links, (d) => (d.target as NodeWithId).id);

      // enter any new links at the parent's previous position
      link
        .enter()
        .insert('path', 'g')
        .attr({
          class: 'link',
          d: (d) => {
            const position = findParentNodePosition(
              nodePositionsById,
              (d.target as NodeWithId).id,
              (n) => !!previousNodePositionsById[n.id]
            );
            const previousPosition =
              (position && previousNodePositionsById[position.id]) ||
              previousNodePositionsById.root;
            return diagonal({
              source: previousPosition,
              target: previousPosition,
            } as d3.svg.diagonal.Link<NodePosition>);
          },
        })
        .style(style.link);

      // transition links to their new position
      link
        .transition()
        .duration(transitionDuration)
        .attr({
          d: diagonal as unknown as Primitive,
        });

      // transition exiting nodes to the parent's new position
      link
        .exit()
        .transition()
        .duration(transitionDuration)
        .attr({
          d: (d) => {
            const position = findParentNodePosition(
              previousNodePositionsById,
              (d.target as NodeWithId).id,
              (n) => !!nodePositionsById[n.id]
            );
            const futurePosition =
              (position && nodePositionsById[position.id]) ||
              nodePositionsById.root;
            return diagonal({
              source: futurePosition,
              target: futurePosition,
            });
          },
        })
        .remove();

      // delete the old data once it's no longer needed
      node.property('__oldData__', null);

      // stash the old positions for transition
      previousNodePositionsById = nodePositionsById;
    }
  };
}

export { Primitive };
