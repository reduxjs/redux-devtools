let s = document.createElement('script');
s.type = 'text/javascript';

if (process.env.NODE_ENV === 'production') {
  const script = require('raw-loader!tmp/page.bundle.js');
  s.appendChild(document.createTextNode(script));
  (document.head || document.documentElement).appendChild(s);
  s.parentNode.removeChild(s);
} else {
  s.src = chrome.extension.getURL('js/page.bundle.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
}
