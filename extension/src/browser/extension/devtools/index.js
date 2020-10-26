function createPanel(url) {
  chrome.devtools.panels.create(
    'Redux', 'img/logo/scalable.png', url, function() {}
  );
}

if (chrome.runtime.getBackgroundPage) {
  // Check if the background page's object is accessible (not in incognito)
  chrome.runtime.getBackgroundPage(background => {
    createPanel(background ? 'window.html' : 'devpanel.html');
  });
} else {
  createPanel('devpanel.html');
}
