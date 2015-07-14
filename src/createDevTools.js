import createAll from 'react-redux/lib/components/createAll';
import { bindActionCreators } from 'redux';
import { ActionCreators } from './devTools';

export default function createDevTools(React) {
  const { PropTypes, Component } = React;
  const { Provider, Connector } = createAll(React);

  return class DevTools extends Component {
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
    }

    render() {
      const { devToolsStore } = this.props.store;
      return (
        <Provider store={devToolsStore}>
          {this.renderRoot}
        </Provider>
      );
    }

    renderRoot = () => {
      return (
        <Connector>
          {this.renderMonitor}
        </Connector>
      );
    };

    renderMonitor = ({ dispatch, ...state }) => {
      const { monitor: Monitor, ...rest } = this.props;
      return (
        <Monitor {...state}
                 {...bindActionCreators(ActionCreators, dispatch)}
                 {...rest} />
      );
    };
  };
}
