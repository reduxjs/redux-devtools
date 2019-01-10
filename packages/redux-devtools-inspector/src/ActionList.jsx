import React, { Component } from 'react';
import dragula from 'react-dragula';
import ActionListRow from './ActionListRow';
import ActionListHeader from './ActionListHeader';
import shouldPureComponentUpdate from 'react-pure-render/function';

function getTimestamps(actions, actionIds, actionId) {
  const idx = actionIds.indexOf(actionId);
  const prevActionId = actionIds[idx - 1];

  return {
    current: actions[actionId].timestamp,
    previous: idx ? actions[prevActionId].timestamp : 0
  };
}

export default class ActionList extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillReceiveProps(nextProps) {
    const node = this.node;
    if (!node) {
      this.scrollDown = true;
    } else if (this.props.lastActionId !== nextProps.lastActionId) {
      const { scrollTop, offsetHeight, scrollHeight } = node;
      this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 50;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidMount() {
    this.scrollDown = true;
    this.scrollToBottom();

    if (!this.props.draggableActions) return;
    const container = this.node;
    this.drake = dragula([container], {
      copy: false,
      copySortSource: false,
      mirrorContainer: container,
      accepts: (el, target, source, sibling) => (
        !sibling || parseInt(sibling.getAttribute('data-id'))
      ),
      moves: (el, source, handle) => (
        parseInt(el.getAttribute('data-id')) &&
        handle.className.indexOf('selectorButton') !== 0
      ),
    }).on('drop', (el, target, source, sibling) => {
      let beforeActionId = this.props.actionIds.length;
      if (sibling && sibling.className.indexOf('gu-mirror') === -1) {
        beforeActionId = parseInt(sibling.getAttribute('data-id'));
      }
      const actionId = parseInt(el.getAttribute('data-id'));
      this.props.onReorderAction(actionId, beforeActionId)
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.scrollDown && this.node) {
      this.node.scrollTop = this.node.scrollHeight;
    }
  }

  getRef = node => {
    this.node = node;
  }

  render() {
    const { styling, actions, actionIds, isWideLayout, onToggleAction, skippedActionIds,
      selectedActionId, startActionId, onSelect, onSearch, searchValue, currentActionId,
      hideMainButtons, hideActionButtons, onCommit, onSweep, onJumpToState } = this.props;
    const lowerSearchValue = searchValue && searchValue.toLowerCase();
    const filteredActionIds = searchValue ? actionIds.filter(
      id => actions[id].action.type.toLowerCase().indexOf(lowerSearchValue) !== -1
    ) : actionIds;

    return (
      <div key="actionList"
        {...styling(['actionList', isWideLayout && 'actionListWide'], isWideLayout)}>
        <ActionListHeader styling={styling}
          onSearch={onSearch}
          onCommit={onCommit}
          onSweep={onSweep}
          hideMainButtons={hideMainButtons}
          hasSkippedActions={skippedActionIds.length > 0}
          hasStagedActions={actionIds.length > 1} />
        <div {...styling('actionListRows')} ref={this.getRef}>
          {filteredActionIds.map(actionId =>
            (<ActionListRow key={actionId}
              styling={styling}
              actionId={actionId}
              isInitAction={!actionId}
              isSelected={
                startActionId !== null &&
                            actionId >= startActionId && actionId <= selectedActionId ||
                            actionId === selectedActionId
              }
              isInFuture={
                actionIds.indexOf(actionId) > actionIds.indexOf(currentActionId)
              }
              onSelect={(e) => onSelect(e, actionId)}
              timestamps={getTimestamps(actions, actionIds, actionId)}
              action={actions[actionId].action}
              onToggleClick={() => onToggleAction(actionId)}
              onJumpClick={() => onJumpToState(actionId)}
              onCommitClick={() => onCommit(actionId)}
              hideActionButtons={hideActionButtons}
              isSkipped={skippedActionIds.indexOf(actionId) !== -1} />)
          )}
        </div>
      </div>
    );
  }
}
