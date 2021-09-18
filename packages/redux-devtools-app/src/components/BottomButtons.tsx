import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Toolbar, Divider } from '@redux-devtools/ui';
import { MdSave } from 'react-icons/md';
import ExportButton from './buttons/ExportButton';
import ImportButton from './buttons/ImportButton';
import PrintButton from './buttons/PrintButton';
import DispatcherButton from './buttons/DispatcherButton';
import SliderButton from './buttons/SliderButton';
import MonitorSelector from './MonitorSelector';
import { Options } from '../reducers/instances';

interface Props {
  dispatcherIsOpen: boolean;
  sliderIsOpen: boolean;
  options: Options;
}

export default class BottomButtons extends Component<Props> {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool,
    options: PropTypes.object.isRequired,
  };

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
      </Toolbar>
    );
  }
}
