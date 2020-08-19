import React from 'react';
import PropTypes from 'prop-types';
import { StylingFunction } from 'react-base16-styling';

interface Props {
  styling: StylingFunction;
  arrowStyle?: 'single' | 'double';
  expanded: boolean;
  nodeType: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const JSONArrow: React.FunctionComponent<Props> = ({
  styling,
  arrowStyle,
  expanded,
  nodeType,
  onClick,
}) => (
  <div {...styling('arrowContainer', arrowStyle)} onClick={onClick}>
    <div {...styling(['arrow', 'arrowSign'], nodeType, expanded, arrowStyle)}>
      {'\u25B6'}
      {arrowStyle === 'double' && (
        <div {...styling(['arrowSign', 'arrowSignInner'])}>{'\u25B6'}</div>
      )}
    </div>
  </div>
);

JSONArrow.propTypes = {
  styling: PropTypes.func.isRequired,
  arrowStyle: PropTypes.oneOf(['single', 'double']),
  expanded: PropTypes.bool.isRequired,
  nodeType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

JSONArrow.defaultProps = {
  arrowStyle: 'single',
};

export default JSONArrow;
