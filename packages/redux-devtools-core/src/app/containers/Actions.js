import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'devui';
import SliderMonitor from './monitors/Slider';
import { liftedDispatch as liftedDispatchAction, getReport } from '../actions';
import { getActiveInstance } from '../reducers/instances';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import TopButtons from '../components/TopButtons';
import BottomButtons from '../components/BottomButtons';

class Actions extends Component {
  render() {
    const {
      monitor, dispatcherIsOpen, sliderIsOpen, options, liftedState, liftedDispatch
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
        />
        {sliderIsOpen && options.connectionId && options.features.jump &&
        <SliderMonitor liftedState={liftedState} dispatch={liftedDispatch} />
        }
        {dispatcherIsOpen && options.connectionId && options.features.dispatch &&
        <Dispatcher options={options} />
        }
        <BottomButtons
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
          options={options}
        />
      </Container>
    );
  }
}

Actions.propTypes = {
  liftedDispatch: PropTypes.func.isRequired,
  liftedState: PropTypes.object.isRequired,
  monitorState: PropTypes.object,
  options: PropTypes.object.isRequired,
  monitor: PropTypes.string,
  dispatcherIsOpen: PropTypes.bool,
  sliderIsOpen: PropTypes.bool
};

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    liftedState: instances.states[id],
    monitorState: state.monitor.monitorState,
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    liftedDispatch: bindActionCreators(liftedDispatchAction, dispatch),
    getReport: bindActionCreators(getReport, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
