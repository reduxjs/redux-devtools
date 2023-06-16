import React, { useCallback, useState } from 'react';
import JSONArrow from './JSONArrow';
import type { CircularCache, CommonInternalProps, KeyPath } from './types';

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  from: number;
  to: number;
  renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
  circularCache: CircularCache;
  level: number;
}

export default function ItemRange(props: Props) {
  const {
    styling,
    from,
    to,
    renderChildNodes,
    nodeType,
    keyPath,
    searchResultPath,
    level,
  } = props;

  const [userExpanded, setUserExpanded] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    setUserExpanded(!userExpanded);
  }, [userExpanded]);

  const expanded =
    userExpanded ||
    containsSearchResult(keyPath, from, to, searchResultPath, level);

  return expanded ? (
    <div {...styling('itemRange', expanded)}>
      {renderChildNodes(props, from, to)}
    </div>
  ) : (
    <div {...styling('itemRange', expanded)} onClick={handleClick}>
      <JSONArrow
        nodeType={nodeType}
        styling={styling}
        expanded={false}
        onClick={handleClick}
        arrowStyle="double"
      />
      {`${from} ... ${to}`}
    </div>
  );
}

const containsSearchResult = (
  ownKeyPath: KeyPath,
  from: number,
  to: number,
  resultKeyPath: KeyPath,
  level: number
): boolean => {
  const searchLevel = level > 1 ? level - 1 : level;
  const nextKey = Number(resultKeyPath[searchLevel]);
  return !isNaN(nextKey) && nextKey >= from && nextKey <= to;
};
