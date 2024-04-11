import * as d3 from 'd3';
import type { D3ZoomEvent, HierarchyPointLink, HierarchyPointNode } from 'd3';
import { isEmpty } from 'ramda';
import { map2tree } from 'map2tree';
import type { Node } from 'map2tree';
import deepmerge from 'deepmerge';
import {
  getTooltipString,
  toggleChildren,
  visit,
  getNodeGroupByDepthCount,
} from './utils.js';
import { tooltip } from 'd3tooltip';
import type { StyleValue } from 'd3tooltip';

export interface Options {
  // eslint-disable-next-line @typescript-eslint/ban-types
  state?: {} | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  tree?: Node | {};

  rootKeyName: string;
  pushMethod: 'push' | 'unshift';
  id: string;
  chartStyles: { [key: string]: StyleValue };
  nodeStyleOptions: {
    colors: {
      default: string;
      collapsed: string;
      parent: string;
    };
    radius: number;
  };
  textStyleOptions: {
    colors: {
      default: string;
      hover: string;
    };
  };
  linkStyles: { [key: string]: StyleValue };
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
  onClickText: (datum: HierarchyPointNode<Node>) => void;
  tooltipOptions: {
    disabled?: boolean;
    left?: number | undefined;
    top?: number | undefined;
    offset?: {
      left: number;
      top: number;
    };
    styles?: { [key: string]: StyleValue } | undefined;
    indentationSize?: number;
  };
}

const defaultOptions: Options = {
  state: undefined,
  rootKeyName: 'state',
  pushMethod: 'push',
  tree: undefined,
  id: 'd3svg',
  chartStyles: {},
  nodeStyleOptions: {
    colors: {
      default: '#ccc',
      collapsed: 'lightsteelblue',
      parent: 'white',
    },
    radius: 7,
  },
  textStyleOptions: {
    colors: {
      default: 'black',
      hover: 'skyblue',
    },
  },
  linkStyles: {
    stroke: '#000',
    fill: 'none',
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
    styles: undefined,
  },
} satisfies Options;

export interface InternalNode extends Node {
  _children?: this[] | undefined;
  id: string | number;
}

interface NodePosition {
  parentId: string | number | null;
  id: string | number;
  x: number;
  y: number;
}

export default function (DOMNode: HTMLElement, options: Partial<Options> = {}) {
  const {
    id,
    chartStyles,
    nodeStyleOptions,
    textStyleOptions,
    linkStyles,
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
  } = deepmerge(defaultOptions, options);

  const width = size - margin.left - margin.right;
  const height = size * aspectRatio - margin.top - margin.bottom;
  const fullWidth = size;
  const fullHeight = size * aspectRatio;

  const root = d3.select(DOMNode);
  const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 3]);

  const svgElement = root
    .append('svg')
    .attr('id', id)
    .attr('preserveAspectRatio', 'xMinYMin slice')
    .style('cursor', '-webkit-grab');

  if (!chartStyles.width) {
    svgElement.attr('width', fullWidth);
  }

  if (!chartStyles.width || !chartStyles.height) {
    svgElement.attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`);
  }

  for (const [key, value] of Object.entries(chartStyles)) {
    svgElement.style(key, value);
  }

  const vis = svgElement
    // eslint-disable-next-line @typescript-eslint/unbound-method
    .call(zoom.scaleTo, initialZoom)
    .call(
      zoom.on('zoom', (event) => {
        const { transform } = event as D3ZoomEvent<SVGSVGElement, unknown>;
        vis.attr('transform', transform.toString());
      }),
    )
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left + nodeStyleOptions.radius}, ${
        margin.top
      }) scale(${initialZoom})`,
    );

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
    nodePositionsById: { [nodeId: string | number]: NodePosition },
    nodeId: string | number,
    filter: (nodePosition: NodePosition) => boolean,
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
    let data = !tree
      ? (map2tree(nextState, {
          key: rootKeyName,
          pushMethod,
        }) as InternalNode)
      : (nextState as InternalNode);

    if (isEmpty(data) || !data.name) {
      data = {
        name: 'error',
        message: 'Please provide a state map or a tree structure',
      } as unknown as InternalNode;
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
          : null,
    );

    update();

    function update() {
      // path generator for links
      const linkHorizontal = d3
        .linkHorizontal<
          {
            source: { x: number; y: number };
            target: { x: number; y: number };
          },
          { x: number; y: number }
        >()
        .x((d) => d.y)
        .y((d) => d.x);
      // set tree dimensions and spacing between branches and nodes
      const maxNodeCountByLevel = Math.max(...getNodeGroupByDepthCount(data));

      const layout = d3
        .tree<InternalNode>()
        .size([maxNodeCountByLevel * 25 * heightBetweenNodesCoeff, width]);

      const rootNode = d3.hierarchy(data);
      if (isSorted) {
        rootNode.sort((a, b) =>
          b.data.name.toLowerCase() < a.data.name.toLowerCase() ? 1 : -1,
        );
      }

      const rootPointNode = layout(rootNode);
      const links = rootPointNode.links();

      rootPointNode.each(
        (node) =>
          (node.y = node.depth * (maxLabelLength * 7 * widthBetweenNodesCoeff)),
      );

      const nodes = rootPointNode.descendants();

      const nodePositions = nodes.map((n) => ({
        parentId: n.parent && n.parent.data.id,
        id: n.data.id,
        x: n.x,
        y: n.y,
      }));
      const nodePositionsById: { [nodeId: string | number]: NodePosition } = {};
      nodePositions.forEach((node) => (nodePositionsById[node.id] = node));

      // process the node selection
      const node = vis
        .selectAll<SVGGElement, HierarchyPointNode<InternalNode>>('g.node')
        .property('__oldData__', (d) => d)
        .data(nodes, (d) => d.data.id || (d.data.id = ++nodeIndex));
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => {
          const position = findParentNodePosition(
            nodePositionsById,
            d.data.id,
            (n) => !!previousNodePositionsById[n.id],
          );
          const previousPosition =
            (position && previousNodePositionsById[position.id]) ||
            previousNodePositionsById.root;
          return `translate(${previousPosition.y},${previousPosition.x})`;
        })
        .style('fill', textStyleOptions.colors.default)
        .style('cursor', 'pointer')
        .on('mouseover', function mouseover() {
          d3.select(this).style('fill', textStyleOptions.colors.hover);
        })
        .on('mouseout', function mouseout() {
          d3.select(this).style('fill', textStyleOptions.colors.default);
        });

      if (!tooltipOptions.disabled) {
        nodeEnter.call(
          tooltip<
            SVGGElement,
            HierarchyPointNode<InternalNode>,
            SVGGElement,
            unknown,
            HTMLElement,
            unknown,
            null,
            undefined
          >('tooltip', {
            ...tooltipOptions,
            root,
            text: (d) => getTooltipString(d.data, tooltipOptions),
          }),
        );
      }

      // g inside node contains circle and text
      // this extra wrapper helps run d3 transitions in parallel
      const nodeEnterInnerGroup = nodeEnter.append('g');
      nodeEnterInnerGroup
        .append('circle')
        .attr('class', 'nodeCircle')
        .attr('r', 0)
        .on('click', (event, clickedNode) => {
          if ((event as Event).defaultPrevented) return;
          toggleChildren(clickedNode.data);
          update();
        });

      nodeEnterInnerGroup
        .append('text')
        .attr('class', 'nodeText')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0,0)')
        .attr('dy', '.35em')
        .style('fill-opacity', 0)
        .text((d) => d.data.name)
        .on('click', (_, datum) => {
          onClickText(datum as unknown as HierarchyPointNode<Node>);
        });

      const nodeEnterAndUpdate = nodeEnter.merge(node);

      // update the text to reflect whether node has children or not
      nodeEnterAndUpdate.select('text').text((d) => d.data.name);

      // change the circle fill depending on whether it has children and is collapsed
      nodeEnterAndUpdate
        .select('circle')
        .style('stroke', 'black')
        .style('stroke-width', '1.5px')
        .style('fill', (d) =>
          d.data._children && d.data._children.length > 0
            ? nodeStyleOptions.colors.collapsed
            : d.data.children && d.data.children.length > 0
              ? nodeStyleOptions.colors.parent
              : nodeStyleOptions.colors.default,
        );

      // transition nodes to their new position
      const nodeUpdate = nodeEnterAndUpdate
        .transition()
        .duration(transitionDuration)
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

      // ensure circle radius is correct
      nodeUpdate.select('circle').attr('r', nodeStyleOptions.radius);

      // fade the text in and align it
      nodeUpdate
        .select<SVGTextElement>('text')
        .style('fill-opacity', 1)
        .attr('transform', function transform(d) {
          const x =
            (((d.data.children ?? d.data._children)?.length ?? 0) > 0
              ? -1
              : 1) *
            (this.getBBox().width / 2 + nodeStyleOptions.radius + 5);
          return `translate(${x},0)`;
        });

      // blink updated nodes
      nodeEnterAndUpdate
        .filter(function flick(
          this: SVGGElement & {
            __oldData__?: HierarchyPointNode<InternalNode>;
          },
          d,
        ) {
          // test whether the relevant properties of d match
          // the equivalent property of the oldData
          // also test whether the old data exists,
          // to catch the entering elements!
          return (
            !!this.__oldData__ && d.data.value !== this.__oldData__.data.value
          );
        })
        .select('g')
        .style('opacity', '0.3')
        .transition()
        .duration(blinkDuration)
        .style('opacity', '1');

      // transition exiting nodes to the parent's new position
      const nodeExit = node
        .exit<HierarchyPointNode<InternalNode>>()
        .transition()
        .duration(transitionDuration)
        .attr('transform', (d) => {
          const position = findParentNodePosition(
            previousNodePositionsById,
            d.data.id,
            (n) => !!nodePositionsById[n.id],
          );
          const futurePosition =
            (position && nodePositionsById[position.id]) ||
            nodePositionsById.root;
          return `translate(${futurePosition.y},${futurePosition.x})`;
        })
        .remove();

      nodeExit.select('circle').attr('r', 0);

      nodeExit.select('text').style('fill-opacity', 0);

      // update the links
      const link = vis
        .selectAll<
          SVGPathElement,
          HierarchyPointLink<InternalNode>
        >('path.link')
        .data(links, (d) => d.target.data.id);

      // enter any new links at the parent's previous position
      const linkEnter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', (d) => {
          const position = findParentNodePosition(
            nodePositionsById,
            d.target.data.id,
            (n) => !!previousNodePositionsById[n.id],
          );
          const previousPosition =
            (position && previousNodePositionsById[position.id]) ||
            previousNodePositionsById.root;
          return linkHorizontal({
            source: previousPosition,
            target: previousPosition,
          });
        });

      for (const [key, value] of Object.entries(linkStyles)) {
        linkEnter.style(key, value);
      }

      const linkEnterAndUpdate = linkEnter.merge(link);

      // transition links to their new position
      linkEnterAndUpdate
        .transition()
        .duration(transitionDuration)
        .attr('d', linkHorizontal);

      // transition exiting nodes to the parent's new position
      link
        .exit<HierarchyPointLink<InternalNode>>()
        .transition()
        .duration(transitionDuration)
        .attr('d', (d) => {
          const position = findParentNodePosition(
            previousNodePositionsById,
            d.target.data.id,
            (n) => !!nodePositionsById[n.id],
          );
          const futurePosition =
            (position && nodePositionsById[position.id]) ||
            nodePositionsById.root;
          return linkHorizontal({
            source: futurePosition,
            target: futurePosition,
          });
        })
        .remove();

      // delete the old data once it's no longer needed
      nodeEnterAndUpdate.property('__oldData__', null);

      // stash the old positions for transition
      previousNodePositionsById = nodePositionsById;
    }
  };
}

export type { Node };
