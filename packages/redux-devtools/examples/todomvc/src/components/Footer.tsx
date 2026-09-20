import React, { Component, MouseEventHandler } from 'react';
import classnames from 'classnames';
import {
  SHOW_ALL,
  SHOW_MARKED,
  SHOW_UNMARKED,
  TodoFilter,
} from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_UNMARKED]: 'Active',
  [SHOW_MARKED]: 'Completed',
};

interface Props {
  markedCount: number;
  unmarkedCount: number;
  filter: TodoFilter;
  onClearMarked: MouseEventHandler<HTMLButtonElement>;
  onShow: (filter: TodoFilter) => void;
}

export default class Footer extends Component<Props> {
  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          {([SHOW_ALL, SHOW_UNMARKED, SHOW_MARKED] as const).map((filter) => (
            <li key={filter}>{this.renderFilterLink(filter)}</li>
          ))}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }

  renderTodoCount() {
    const { unmarkedCount } = this.props;
    const itemWord = unmarkedCount === 1 ? 'item' : 'items';

    return (
      <span className="todo-count">
        <strong>{unmarkedCount || 'No'}</strong> {itemWord} left
      </span>
    );
  }

  renderFilterLink(filter: TodoFilter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <a
        className={classnames({ selected: filter === selectedFilter })}
        style={{ cursor: 'hand' }}
        onClick={() => onShow(filter)}
      >
        {title}
      </a>
    );
  }

  renderClearButton() {
    const { markedCount, onClearMarked } = this.props;
    if (markedCount > 0) {
      return (
        <button className="clear-completed" onClick={onClearMarked}>
          Clear completed
        </button>
      );
    }
  }
}
