import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SliderMonitor from 'remotedev-slider/lib/Slider';
import { liftedDispatch, getReport } from 'remotedev-app/lib/actions';
import { getActiveInstance } from 'remotedev-app/lib/reducers/instances';
import styles from 'remotedev-app/lib/styles';
import enhance from 'remotedev-app/lib/hoc';
import DevTools from 'remotedev-app/lib/containers/DevTools';
import Dispatcher from 'remotedev-app/lib/containers/monitors/Dispatcher';
import MonitorSelector from 'remotedev-app/lib/components/MonitorSelector';
import Notification from 'remotedev-app/lib/components/Notification';
import Instances from 'remotedev-app/lib/components/Instances';
import Button from 'remotedev-app/lib/components/Button';
import RecordButton from 'remotedev-app/lib/components/buttons/RecordButton';
import LockButton from 'remotedev-app/lib/components/buttons/LockButton';
import DispatcherButton from 'remotedev-app/lib/components/buttons/DispatcherButton';
import SliderButton from 'remotedev-app/lib/components/buttons/SliderButton';
import ImportButton from 'remotedev-app/lib/components/buttons/ImportButton';
import ExportButton from 'remotedev-app/lib/components/buttons/ExportButton';
import PrintButton from 'remotedev-app/lib/components/buttons/PrintButton';
import SettingsIcon from 'react-icons/lib/md/settings';
import LeftIcon from 'react-icons/lib/md/border-left';
import RightIcon from 'react-icons/lib/md/border-right';
import BottomIcon from 'react-icons/lib/md/border-bottom';
import RemoteIcon from 'react-icons/lib/go/radio-tower';
import PersistIcon from 'react-icons/lib/go/pin';

@enhance
class App extends Component {
  openWindow = (position) => {
    chrome.runtime.sendMessage({ type: 'OPEN', position });
  };
  openOptionsPage = () => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  render() {
    const {
      monitor, position, togglePersist,
      dispatcherIsOpen, sliderIsOpen, options, liftedState
    } = this.props;
    if (!position && (!options || !options.features)) {
      return (
        <div style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
          No store found. Make sure to follow <a href="https://github.com/zalmoxisus/redux-devtools-extension#usage" target="_blank">the instructions</a>.
        </div>
      );
    }
    const features = options.features || {};
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={monitor}/>
          <Instances selected={this.props.selected} />
        </div>
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          monitorState={this.props.monitorState}
          dispatch={this.props.liftedDispatch}
          lib={options.lib || options.explicitLib}
        />
        <Notification />
        {sliderIsOpen && options.connectionId && options.features.jump &&
          <SliderMonitor
            monitor="SliderMonitor"
            liftedState={liftedState}
            dispatch={this.props.liftedDispatch}
            getReport={this.props.getReport}
            reports={this.props.reports}
            showActions={monitor === 'ChartMonitor'}
            style={{ padding: '15px 5px' }}
            fillColor="rgb(120, 144, 156)"
          />
        }
        {dispatcherIsOpen && options.connectionId && options.features.dispatch &&
          <Dispatcher options={options} />
        }
        <div style={styles.buttonBar}>
          {!window.isElectron && position !== '#left' &&
          <Button
            Icon={LeftIcon}
            onClick={() => { this.openWindow('left'); }}
          />
          }
          {!window.isElectron && position !== '#right' &&
          <Button
            Icon={RightIcon}
            onClick={() => { this.openWindow('right'); }}
          />
          }
          {!window.isElectron && position !== '#bottom' &&
          <Button
            Icon={BottomIcon}
            onClick={() => { this.openWindow('bottom'); }}
          />
          }
          {features.pause &&
            <RecordButton paused={liftedState.isPaused} />
          }
          {features.lock &&
            <LockButton locked={liftedState.isLocked} />
          }
          {features.persist &&
            <Button
              Icon={PersistIcon}
              onClick={togglePersist}
            >Persist</Button>
          }
          {features.dispatch &&
            <DispatcherButton dispatcherIsOpen={dispatcherIsOpen}/>
          }
          {features.jump &&
            <SliderButton isOpen={sliderIsOpen}/>
          }
          {features.import &&
            <ImportButton />
          }
          {features.export &&
            <ExportButton />
          }
          {position && (position !== '#popup' || navigator.userAgent.indexOf('Firefox') !== -1) &&
            <PrintButton />
          }
          {!window.isElectron &&
          <Button
            Icon={RemoteIcon}
            onClick={() => { this.openWindow('remote'); }}
          >Remote</Button>
          }
          {(chrome.runtime.openOptionsPage || navigator.userAgent.indexOf('Firefox') !== -1) &&
          <Button
            Icon={SettingsIcon}
            onClick={this.openOptionsPage}
          >Settings</Button>
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  bgStore: PropTypes.object,
  liftedDispatch: PropTypes.func.isRequired,
  getReport: PropTypes.func.isRequired,
  togglePersist: PropTypes.func.isRequired,
  selected: PropTypes.string,
  liftedState: PropTypes.object.isRequired,
  monitorState: PropTypes.object,
  options: PropTypes.object.isRequired,
  monitor: PropTypes.string,
  position: PropTypes.string,
  reports: PropTypes.array.isRequired,
  dispatcherIsOpen: PropTypes.bool,
  sliderIsOpen: PropTypes.bool
};

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    selected: instances.selected,
    liftedState: instances.states[id],
    monitorState: state.monitor.monitorState,
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data,
    shouldSync: state.instances.sync
  };
}

function mapDispatchToProps(dispatch) {
  return {
    liftedDispatch: bindActionCreators(liftedDispatch, dispatch),
    getReport: bindActionCreators(getReport, dispatch),
    togglePersist: () => { dispatch({ type: 'TOGGLE_PERSIST' }); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
