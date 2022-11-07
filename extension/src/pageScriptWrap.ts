let s = document.createElement('script');
s.type = 'text/javascript';

if (process.env.NODE_ENV === 'production') {
  const { default: script } = require('raw-loader!../dist/page.bundle.js');
  s.appendChild(document.createTextNode(script));
  (document.head || document.documentElement).appendChild(s);
  s.parentNode!.removeChild(s);
} else {
  s.src = chrome.extension.getURL('page.bundle.js');
  s.onload = function () {
    (this as HTMLScriptElement).parentNode!.removeChild(
      this as HTMLScriptElement
    );
  };
  (document.head || document.documentElement).appendChild(s);
}
