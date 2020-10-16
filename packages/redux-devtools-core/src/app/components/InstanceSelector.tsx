import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Select } from 'devui';
import { selectInstance } from '../actions';
import { StoreState } from '../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class InstanceSelector extends Component<Props> {
  static propTypes = {
    selected: PropTypes.string,
    instances: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  select?: { readonly value: string; readonly label: string }[];

  render() {
    this.select = [{ value: '', label: 'Autoselect instances' }];
    const instances = this.props.instances;
    let name;
    Object.keys(instances).forEach((key) => {
      name = instances[key].name;
      if (name !== undefined)
        this.select!.push({ value: key, label: instances[key].name });
    });

    return (
      <Select
        options={this.select}
        // TODO Where's the type-checking?
        onChange={this.props.onSelect}
        value={this.props.selected || ''}
      />
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  selected: state.instances.selected,
  instances: state.instances.options,
});

const actionCreators = {
  onSelect: selectInstance,
};

export default connect(mapStateToProps, actionCreators)(InstanceSelector);
