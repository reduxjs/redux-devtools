import createAll from 'react-redux/lib/components/createAll';
import { ActionCreators } from './devTools';

export default function createDevTools(React) {
  const { PropTypes, Component } = React;
  const { connect } = createAll(React);

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
          'Have you applied devTools() store enhancer?'
        );
      }
      super(props, context);
    }

    render() {
      return (
        <DevTools {...this.props}
                  store={this.props.store.devToolsStore} />
      );
    }
  };
}
