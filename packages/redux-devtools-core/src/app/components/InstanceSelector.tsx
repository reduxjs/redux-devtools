import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Select } from 'devui';
import { selectInstance } from '../actions';

class InstanceSelector extends Component {
  static propTypes = {
    selected: PropTypes.string,
    instances: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    this.select = [{ value: '', label: 'Autoselect instances' }];
    const instances = this.props.instances;
    let name;
    Object.keys(instances).forEach((key) => {
      name = instances[key].name;
      if (name !== undefined)
        this.select.push({ value: key, label: instances[key].name });
    });

    return (
      <Select
        options={this.select}
        onChange={this.props.onSelect}
        value={this.props.selected || ''}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    selected: state.instances.selected,
    instances: state.instances.options,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelect: bindActionCreators(selectInstance, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceSelector);
