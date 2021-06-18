import React from 'react';
import PropTypes from 'prop-types';
import JSONArrow from './JSONArrow';
import getCollectionEntries from './getCollectionEntries';
import JSONNode from './JSONNode';
import ItemRange from './ItemRange';
import {
  CircularPropsPassedThroughJSONNestedNode,
  CircularPropsPassedThroughRenderChildNodes,
} from './types';

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

export interface RenderChildNodesProps
  extends CircularPropsPassedThroughRenderChildNodes {
  data: any;
  nodeType: string;
}

interface Range {
  from: number;
  to: number;
}

interface Entry {
  key: string | number;
  value: any;
}

function isRange(rangeOrEntry: Range | Entry): rangeOrEntry is Range {
  return (rangeOrEntry as Range).to !== undefined;
}

function renderChildNodes(
  props: RenderChildNodesProps,
  from?: number,
  to?: number
) {
  const {
    nodeType,
    data,
    collectionLimit,
    circularCache,
    keyPath,
    postprocessValue,
    sortObjectKeys,
  } = props;
  const childNodes: React.ReactNode[] = [];

  getCollectionEntries(
    nodeType,
    data,
    sortObjectKeys,
    collectionLimit,
    from,
    to
  ).forEach((entry) => {
    if (isRange(entry)) {
      childNodes.push(
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
        />
      );
    } else {
      const { key, value } = entry;
      const isCircular = circularCache.indexOf(value) !== -1;

      childNodes.push(
        <JSONNode
          {...props}
          {...{ postprocessValue, collectionLimit }}
          key={`Node--${key}`}
          keyPath={[key, ...keyPath]}
          value={postprocessValue(value)}
          circularCache={[...circularCache, value]}
          isCircular={isCircular}
          hideRoot={false}
        />
      );
    }
  });

  return childNodes;
}

interface Props extends CircularPropsPassedThroughJSONNestedNode {
  data: any;
  nodeType: string;
  nodeTypeIndicator: string;
  createItemString: (data: any, collectionLimit: number) => string;
  expandable: boolean;
}

interface State {
  expanded: boolean;
}

function getStateFromProps(props: Props) {
  // calculate individual node expansion if necessary
  const expanded = !props.isCircular
    ? props.shouldExpandNode(props.keyPath, props.data, props.level)
    : false;
  return {
    expanded,
  };
}

export default class JSONNestedNode extends React.Component<Props, State> {
  static propTypes = {
    getItemString: PropTypes.func.isRequired,
    nodeTypeIndicator: PropTypes.any,
    nodeType: PropTypes.string.isRequired,
    data: PropTypes.any,
    hideRoot: PropTypes.bool.isRequired,
    createItemString: PropTypes.func.isRequired,
    styling: PropTypes.func.isRequired,
    collectionLimit: PropTypes.number,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    labelRenderer: PropTypes.func.isRequired,
    shouldExpandNode: PropTypes.func,
    level: PropTypes.number.isRequired,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    isCircular: PropTypes.bool,
    expandable: PropTypes.bool,
  };

  static defaultProps = {
    data: [],
    circularCache: [],
    level: 0,
    expandable: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const nextState = getStateFromProps(nextProps);
    if (getStateFromProps(this.props).expanded !== nextState.expanded) {
      this.setState(nextState);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      !!Object.keys(nextProps).find(
        (key) =>
          key !== 'circularCache' &&
          (key === 'keyPath'
            ? nextProps[key].join('/') !== this.props[key].join('/')
            : nextProps[key as keyof Props] !== this.props[key as keyof Props])
      ) || nextState.expanded !== this.state.expanded
    );
  }

  render() {
    const {
      getItemString,
      nodeTypeIndicator,
      nodeType,
      data,
      hideRoot,
      createItemString,
      styling,
      collectionLimit,
      keyPath,
      labelRenderer,
      expandable,
    } = this.props;
    const { expanded } = this.state;
    const renderedChildren =
      expanded || (hideRoot && this.props.level === 0)
        ? renderChildNodes({ ...this.props, level: this.props.level + 1 })
        : null;

    const itemType = (
      <span {...styling('nestedNodeItemType', expanded)}>
        {nodeTypeIndicator}
      </span>
    );
    const renderedItemString = getItemString(
      nodeType,
      data,
      itemType,
      createItemString(data, collectionLimit),
      keyPath
    );
    const stylingArgs = [keyPath, nodeType, expanded, expandable] as const;

    return hideRoot ? (
      <li {...styling('rootNode', ...stylingArgs)}>
        <ul {...styling('rootNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </ul>
      </li>
    ) : (
      <li {...styling('nestedNode', ...stylingArgs)}>
        {expandable && (
          <JSONArrow
            styling={styling}
            nodeType={nodeType}
            expanded={expanded}
            onClick={this.handleClick}
          />
        )}
        <label
          {...styling(['label', 'nestedNodeLabel'], ...stylingArgs)}
          onClick={this.handleClick}
        >
          {labelRenderer(...stylingArgs)}
        </label>
        <span
          {...styling('nestedNodeItemString', ...stylingArgs)}
          onClick={this.handleClick}
        >
          {renderedItemString}
        </span>
        <ul {...styling('nestedNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </ul>
      </li>
    );
  }

  handleClick = () => {
    if (this.props.expandable) {
      this.setState({ expanded: !this.state.expanded });
    }
  };
}
