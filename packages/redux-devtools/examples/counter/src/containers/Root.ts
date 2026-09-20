import { Store } from 'redux';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';
import { ComponentType } from 'react';

interface Props {
  store: Store<CounterState, CounterAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? require('./Root.prod').default
    : require('./Root.dev').default;
export default Root;
