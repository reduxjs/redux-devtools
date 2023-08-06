import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button, Container, Divider, Toolbar } from '@redux-devtools/ui';
import {
  DevTools,
  Dispatcher,
  DispatcherButton,
  ExportButton,
  getActiveInstance,
  getReport,
  ImportButton,
  liftedDispatch,
  MonitorSelector,
  PrintButton,
  SliderButton,
  SliderMonitor,
  StoreState,
  TopButtons,
} from '@redux-devtools/app';
import { GoBroadcast } from 'react-icons/go';
import { MdBorderBottom, MdBorderLeft, MdBorderRight } from 'react-icons/md';
import type { Position } from '../pageScript/api/openWindow';
import type { SingleMessage } from '../background/store/apiMiddleware';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  readonly position: string;
}
type Props = StateProps & DispatchProps & OwnProps;

declare global {
  interface Window {
    isElectron?: boolean;
  }
}

function sendMessage(message: SingleMessage) {
  chrome.runtime.sendMessage(message);
}

class Actions extends Component<Props> {
  openWindow = (position: Position) => {
    sendMessage({ type: 'OPEN', position });
  };
  openOptionsPage = () => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      sendMessage({ type: 'OPEN_OPTIONS' });
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  render() {
    const {
      monitor,
      dispatcherIsOpen,
      sliderIsOpen,
      options,
      liftedState,
      liftedDispatch,
      position,
      stateTreeSettings,
    } = this.props;
    const { features } = options;
    return (
      <Container>
        <TopButtons
          dispatch={liftedDispatch}
          liftedState={liftedState}
          options={options}
        />
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          monitorState={this.props.monitorState}
          dispatch={liftedDispatch}
          features={options.features}
          stateTreeSettings={stateTreeSettings}
        />
        {sliderIsOpen && options.connectionId && options.features.jump && (
          <SliderMonitor liftedState={liftedState} dispatch={liftedDispatch} />
        )}
        {dispatcherIsOpen &&
          options.connectionId &&
          options.features.dispatch && <Dispatcher options={options} />}
        <Toolbar borderPosition="top">
          {features.export && <ExportButton />}
          {features.import && <ImportButton />}
          {position &&
            (position !== '#popup' ||
              navigator.userAgent.indexOf('Firefox') !== -1) && <PrintButton />}
          <Divider />
          <MonitorSelector />
          <Divider />
          {features.jump && <SliderButton isOpen={this.props.sliderIsOpen} />}
          {features.dispatch && (
            <DispatcherButton dispatcherIsOpen={this.props.dispatcherIsOpen} />
          )}
          <Divider />
          {!window.isElectron && position !== '#left' && (
            <Button
              onClick={() => {
                this.openWindow('left');
              }}
            >
              <MdBorderLeft />
            </Button>
          )}
          {!window.isElectron && position !== '#right' && (
            <Button
              onClick={() => {
                this.openWindow('right');
              }}
            >
              <MdBorderRight />
            </Button>
          )}
          {!window.isElectron && position !== '#bottom' && (
            <Button
              onClick={() => {
                this.openWindow('bottom');
              }}
            >
              <MdBorderBottom />
            </Button>
          )}
          {!window.isElectron && (
            <Button
              onClick={() => {
                this.openWindow('remote');
              }}
            >
              <GoBroadcast />
            </Button>
          )}
        </Toolbar>
      </Container>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    liftedState: instances.states[id],
    monitorState: state.monitor.monitorState,
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data,
    stateTreeSettings: state.stateTreeSettings,
  };
};

const actionCreators = {
  liftedDispatch,
  getReport,
};

export default connect(mapStateToProps, actionCreators)(Actions);
