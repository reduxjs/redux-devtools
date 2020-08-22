import React from 'react';
import PropTypes from 'prop-types';
import JSONArrow from './JSONArrow';
import { CircularPropsPassedThroughItemRange } from './types';

interface Props extends CircularPropsPassedThroughItemRange {
  data: any;
  nodeType: string;
  from: number;
  to: number;
  renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
}

interface State {
  expanded: boolean;
}

export default class ItemRange extends React.Component<Props, State> {
  static propTypes = {
    styling: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    renderChildNodes: PropTypes.func.isRequired,
    nodeType: PropTypes.string.isRequired,
  };

  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    const { styling, from, to, renderChildNodes, nodeType } = this.props;

    return this.state.expanded ? (
      <div {...styling('itemRange', this.state.expanded)}>
        {renderChildNodes(this.props, from, to)}
      </div>
    ) : (
      <div
        {...styling('itemRange', this.state.expanded)}
        onClick={this.handleClick}
      >
        <JSONArrow
          nodeType={nodeType}
          styling={styling}
          expanded={false}
          onClick={this.handleClick}
          arrowStyle="double"
        />
        {`${from} ... ${to}`}
      </div>
    );
  }

  handleClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
}
