import React, { useCallback, useEffect, useRef, useState } from 'react';
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

export default function JSONNestedNode(props: Props) {
  const {
    getItemString,
    nodeTypeIndicator,
    nodeType,
    data = [],
    hideRoot,
    createItemString,
    styling,
    collectionLimit,
    keyPath,
    labelRenderer,
    expandable = true,
    isCircular,
    level = 0,
    shouldExpandNode,
  } = props;

  const [expanded, setExpanded] = useState<boolean>(() => {
    return !isCircular ? shouldExpandNode(keyPath, data, level) : false;
  });

  // When certain props change, we need to re-compute whether our node should be in an expanded state
  useEffect(() => {
    setExpanded(() => {
      return !isCircular ? shouldExpandNode(keyPath, data, level) : false;
    });
  }, [isCircular, data, keyPath, level, shouldExpandNode]);

  const renderedChildren =
    expanded || (hideRoot && props.level === 0)
      ? renderChildNodes({ ...props, level: props.level + 1 })
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

  const expandableLatest = useRef<boolean>(expandable);
  expandableLatest.current = expandable;
  const handleClick = useCallback(() => {
    if (expandableLatest.current) {
      setExpanded((prevValue) => !prevValue);
    }
  }, []);

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
          onClick={handleClick}
        />
      )}
      <label
        {...styling(['label', 'nestedNodeLabel'], ...stylingArgs)}
        onClick={handleClick}
      >
        {labelRenderer(...stylingArgs)}
      </label>
      <span
        {...styling('nestedNodeItemString', ...stylingArgs)}
        onClick={handleClick}
      >
        {renderedItemString}
      </span>
      <ul {...styling('nestedNodeChildren', ...stylingArgs)}>
        {renderedChildren}
      </ul>
    </li>
  );
}

JSONNestedNode.propTypes = {
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
