import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button, Container, Divider, Toolbar } from 'devui';
import SliderMonitor from '@redux-devtools/app/lib/containers/monitors/Slider';
import { liftedDispatch, getReport } from '@redux-devtools/app/lib/actions';
import { getActiveInstance } from '@redux-devtools/app/lib/reducers/instances';
import DevTools from '@redux-devtools/app/lib/containers/DevTools';
import Dispatcher from '@redux-devtools/app/lib/containers/monitors/Dispatcher';
import TopButtons from '@redux-devtools/app/lib/components/TopButtons';
import ExportButton from '@redux-devtools/app/lib/components/buttons/ExportButton';
import ImportButton from '@redux-devtools/app/lib/components/buttons/ImportButton';
import PrintButton from '@redux-devtools/app/lib/components/buttons/PrintButton';
import MonitorSelector from '@redux-devtools/app/lib/components/MonitorSelector';
import SliderButton from '@redux-devtools/app/lib/components/buttons/SliderButton';
import DispatcherButton from '@redux-devtools/app/lib/components/buttons/DispatcherButton';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import { GoRadioTower } from 'react-icons/go';
import {
  MdBorderBottom,
  MdBorderLeft,
  MdBorderRight,
  MdSave,
} from 'react-icons/md';
import { Position } from '../api/openWindow';
import { SingleMessage } from '../middlewares/api';

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
        />
        {sliderIsOpen && options.connectionId && options.features.jump && (
          <SliderMonitor liftedState={liftedState} dispatch={liftedDispatch} />
        )}
        {dispatcherIsOpen &&
          options.connectionId &&
          options.features.dispatch && <Dispatcher options={options} />}
        <Toolbar borderPosition="top">
          {features.export && (
            <Button title="Save a report" tooltipPosition="top-right">
              <MdSave />
            </Button>
          )}
          {features.export && <ExportButton />}
          {features.import && <ImportButton />}
          <PrintButton />
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
              <GoRadioTower />
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
  };
};

const actionCreators = {
  liftedDispatch,
  getReport,
};

export default connect(mapStateToProps, actionCreators)(Actions);
