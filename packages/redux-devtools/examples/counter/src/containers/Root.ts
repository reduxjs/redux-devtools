import type { Store } from 'redux';
import type { CounterState } from '../reducers';
import type { CounterAction } from '../actions/CounterActions';
import type { ComponentType } from 'react';

interface Props {
  store: Store<CounterState, CounterAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? require('./Root.prod').default
    : require('./Root.dev').default;
export default Root;
