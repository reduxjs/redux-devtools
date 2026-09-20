import { exportStateMiddleware } from './exportState.js';
import { parseErrorMiddleware } from './parseError.js';

const middlewares = [parseErrorMiddleware, exportStateMiddleware];

export default middlewares;
