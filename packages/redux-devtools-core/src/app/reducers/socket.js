import * as actions from '../constants/socketActionTypes';

const initialState = {
  id: null,
  channels: [],
  socketState: actions.CLOSED,
  authState: actions.PENDING,
  authToken: null,
  error: undefined
};

export default function socket(state = initialState, action) {
  switch (action.type) {
    case actions.CONNECT_REQUEST: {
      return {
        ...state,
        socketState: actions.CONNECTING
      };
    }
    case actions.CONNECT_ERROR:
      return {
        ...state,
        error: action.error
      };
    case actions.CONNECT_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        socketState: action.payload.socketState,
        authState: action.payload.authState,
        error: action.error
      };
    case actions.AUTH_REQUEST:
      return {
        ...state,
        authState: actions.PENDING
      };
    case actions.AUTH_SUCCESS:
      return {
        ...state,
        authState: actions.AUTHENTICATED,
        authToken: action.authToken,
        baseChannel: action.baseChannel
      };
    case actions.AUTH_ERROR:
      return {
        ...state,
        authState: actions.UNAUTHENTICATED,
        error: action.error
      };
    case actions.DEAUTHENTICATE:
      return {
        ...state,
        authState: actions.UNAUTHENTICATED,
        authToken: null
      };
    case actions.SUBSCRIBE_SUCCESS:
      return {
        ...state,
        channels: [...state.channels, action.channelName]
      };
    case actions.UNSUBSCRIBE:
      return {
        ...state,
        channels: state.channels.filter(channel =>
          channel !== action.channelName
        )
      };
    case actions.DISCONNECTED:
      return initialState;
    default:
      return state;
  }
}
