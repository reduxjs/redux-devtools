import createAll from 'react-redux/lib/components/createAll';
import { ActionCreators } from './devTools';

export default function createDevTools(React) {
  const { PropTypes, Component } = React;
  const { Provider, connect } = createAll(React);

  @connect(
    state => state,
    ActionCreators
  )
  class DevTools extends Component {
    render() {
      const { monitor: Monitor } = this.props;
      return <Monitor {...this.props} />;
    }
  }

  return class DevToolsWrapper extends Component {
    static propTypes = {
      monitor: PropTypes.func.isRequired,
      store: PropTypes.shape({
        devToolsStore: PropTypes.shape({
          dispatch: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    };

    constructor(props, context) {
      if (props.store && !props.store.devToolsStore) {
        console.error(
          'Could not find the devTools store inside your store. ' +
          'Have you applied devTools() higher-order store?'
        );
      }
      super(props, context);
      this.renderDevTools = ::this.renderDevTools;
    }

    render() {
      const { devToolsStore } = this.props.store;
      return (
        <Provider store={devToolsStore}>
          {this.renderDevTools}
        </Provider>
      );
    }

    renderDevTools() {
      const { store, ...rest } = this.props;
      return <DevTools {...rest} />;
    }
  };
}
