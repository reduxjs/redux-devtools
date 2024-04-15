import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container } from '@redux-devtools/ui';
import SliderMonitor from './monitors/Slider';
import { liftedDispatch, getReport } from '../actions';
import { getActiveInstance } from '../reducers/instances';
import DevTools from './DevTools';
import Dispatcher from './monitors/Dispatcher';
import TopButtons from '../components/TopButtons';
import BottomButtons from '../components/BottomButtons';
import { CoreStoreState } from '../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class Actions extends Component<Props> {
  render() {
    const {
      monitor,
      dispatcherIsOpen,
      sliderIsOpen,
      options,
      liftedState,
      liftedDispatch,
      stateTreeSettings,
    } = this.props;
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
        <BottomButtons
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
          options={options}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => {
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
