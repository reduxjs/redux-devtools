import { bindActionCreators } from 'redux';

export default function bindActionCreatorsDeep(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((result, key) => {
    if (!actionCreators[key]) {
      return result;
    }
    switch (typeof actionCreators[key]) {
    case 'object':
      result[key] = bindActionCreatorsDeep(actionCreators[key], dispatch);
      break;
    case 'function':
      result[key] = bindActionCreators(actionCreators[key], dispatch);
      break;
    default:
      break;
    }
    return result;
  }, {});
}
