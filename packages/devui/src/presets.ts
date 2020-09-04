/* eslint-disable global-require */

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';

if (process.env.NODE_ENV !== 'test') {
  require('../fonts/index.css');
  require('codemirror/lib/codemirror.css');
  require('codemirror/addon/fold/foldgutter.css');
}
