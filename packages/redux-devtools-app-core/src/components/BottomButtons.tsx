import React, { Component } from 'react';
import { Toolbar, Divider } from '@redux-devtools/ui';
import ExportButton from './buttons/ExportButton.js';
import ImportButton from './buttons/ImportButton.js';
import PrintButton from './buttons/PrintButton.js';
import DispatcherButton from './buttons/DispatcherButton.js';
import SliderButton from './buttons/SliderButton.js';
import MonitorSelector from './MonitorSelector.js';
import { Options } from '../reducers/instances.js';

interface Props {
  dispatcherIsOpen: boolean;
  sliderIsOpen: boolean;
  options: Options;
}

export default class BottomButtons extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen ||
      nextProps.sliderIsOpen !== this.props.sliderIsOpen ||
      nextProps.options !== this.props.options
    );
  }

  render() {
    const features = this.props.options.features;
    return (
      <Toolbar borderPosition="top">
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
      </Toolbar>
    );
  }
}
