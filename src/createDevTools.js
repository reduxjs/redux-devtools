import createAll from 'react-redux/lib/components/createAll';
import { ActionCreators } from './devTools';
import DebugPanel from './react/DebugPanel';

export default function createDevTools(React) {
  const { PropTypes, Component } = React;
  const { connect } = createAll(React);

  @connect(
    state => state,
    ActionCreators
  )
  class DevTools extends Component {
    render() {
      const { monitor: Monitor, panelState, setPanelState,
              visibleOnLoad, position, ...props } = this.props;
      return (
        <DebugPanel {...{ panelState, setPanelState, visibleOnLoad, position }}>
          <Monitor {...props} />
        </DebugPanel>
      );
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
          'Have you applied devTools() store enhancer?'
        );
      }
      super(props, context);
    }

    render() {
      const { store: { devToolsStore }, ...props } = this.props;
      return (
        <DevTools {...props} store={devToolsStore} />
      );
    }
  };
}
