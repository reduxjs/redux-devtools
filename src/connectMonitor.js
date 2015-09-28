import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from './devTools';

export default function connectMonitor(monitorActionCreators = {}) {
  return Monitor => {
    function mapStateToProps(state) {
      return state;
    }
    function mapDispatchToProps(dispatch) {
      return {
        ...bindActionCreators(ActionCreators, dispatch),
        monitorActions: bindActionCreators(monitorActionCreators, dispatch)
      };
    }
    const ConnectedMonitor = connect(mapStateToProps, mapDispatchToProps)(Monitor);


    return DevTools;
  };
}
