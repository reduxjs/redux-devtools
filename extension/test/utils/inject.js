export function insertScript(str) {
  const s = window.document.createElement('script');
  s.appendChild(document.createTextNode(str));
  (document.head || document.documentElement).appendChild(s);
}

export function listenMessage(f) {
  return new Promise(resolve => {
    const listener = event => {
      const message = event.data;
      window.removeEventListener('message', listener);
      resolve(message);
    };
    window.addEventListener('message', listener);
    if (f) f();
  });
}
