require('babel-register')();
require('babel-polyfill');
global.chrome = require('sinon-chrome');
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'gecko'
};

global.document.createRange = function() {
  return {
    setEnd: function(){},
    setStart: function(){},
    getBoundingClientRect: function(){
      return {right: 0};
    }
  }
};

documentRef = document;
