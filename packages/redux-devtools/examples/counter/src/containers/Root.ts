import { Store } from 'redux';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';
import { ComponentType } from 'react';

interface Props {
  store: Store<CounterState, CounterAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./Root.prod').default
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./Root.dev').default;
export default Root;
