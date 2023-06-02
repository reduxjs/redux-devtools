import React, { useCallback, useRef, useState } from 'react';
import ItemRange from './ItemRange';
import JSONArrow from './JSONArrow';
import JSONNode from './JSONNode';
import { useExpandCollapseAllContext } from './expandCollapseContext';
import getCollectionEntries from './getCollectionEntries';
import type { CircularCache, CommonInternalProps } from './types';

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

export interface RenderChildNodesProps extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  circularCache: CircularCache;
  level: number;
}

interface Range {
  from: number;
  to: number;
}

interface Entry {
  key: string | number;
  value: unknown;
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

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  nodeTypeIndicator: string;
  createItemString: (data: unknown, collectionLimit: number) => string;
  expandable: boolean;
}

export default function JSONNestedNode(props: Props) {
  const {
    circularCache = [],
    collectionLimit,
    createItemString,
    data,
    expandable,
    getItemString,
    hideRoot,
    isCircular,
    keyPath,
    labelRenderer,
    level = 0,
    nodeType,
    nodeTypeIndicator,
    shouldExpandNodeInitially,
    styling,
  } = props;
  const { expandAllState, setExpandAllState, setEnableDefaultButton } =
    useExpandCollapseAllContext();

  const [defaultExpanded] = useState<boolean>(
    // calculate individual node expansion if necessary
    isCircular
      ? false
      : (function getDefault() {
          switch (expandAllState) {
            case 'expand':
              return true;
            case 'collapse':
              return false;
            default:
              return shouldExpandNodeInitially(keyPath, data, level);
          }
        })()
  );

  const [, setTriggerReRender] = useState<boolean>(defaultExpanded);

  /**
   * Used the useRef to handle expanded because calling a setState in a recursive implementation
   * could lead to a "Maximum update depth exceeded" error */
  const expandedRef = useRef<boolean>(defaultExpanded);

  switch (expandAllState) {
    case 'expand':
      expandedRef.current = isCircular ? false : true;
      break;
    case 'collapse':
      expandedRef.current = false;
      break;
    case 'default':
      expandedRef.current = shouldExpandNodeInitially(keyPath, data, level);
      break;
    default: //Do nothing;
  }

  const handleClick = useCallback(() => {
    if (expandable) {
      expandedRef.current = !expandedRef.current;
      setTriggerReRender((e) => !e);
      setEnableDefaultButton(true);
      setExpandAllState(undefined);
    }
  }, [expandable, setEnableDefaultButton, setExpandAllState]);

  const renderedChildren =
    expandedRef.current || (hideRoot && level === 0)
      ? renderChildNodes({ ...props, circularCache, level: level + 1 })
      : null;

  const itemType = (
    <span {...styling('nestedNodeItemType', expandedRef.current)}>
      {nodeTypeIndicator}
    </span>
  );
  const renderedItemString = getItemString(
    nodeType,
    data,
    itemType,
    createItemString(data, collectionLimit),
    keyPath,
    expandedRef.current,
  );
  const stylingArgs = [
    keyPath,
    nodeType,
    expandedRef.current,
    expandable,
  ] as const;

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
          expanded={expandedRef.current}
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
