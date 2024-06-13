# Architecture Notes

This document exists to keep track of how the different parts of the Redux DevTools interact, since it's easy to forget how it all works together. This is intended for internal purposes and is just a collection of notes to myself.

## Scripts

### Window View

This is the default view that is shown in the Redux DevTools popup, the Chrome DevTools tab (if direct access to the background page is available), and new popup windows that are created. It has direct access to the background page via `chrome.runtime.getBackgroundPage`.

### DevPanel View

This is the view that is shown in the Chrome DevTools tab if direct access to the background page is not available.

Initially this was the view that was always used for the Chrome DevTools tab, but when support to directly access the background page from the DevTools tab was added, [the Window View became the preferred view](https://github.com/zalmoxisus/redux-devtools-extension/pull/580).

### Remote View

This does not interact with the other parts of the extension at all, it just renders the `App` component from `@redux-devtools/app`.

It can be triggered by hitting the "Remote" button in any of the other views, which calls `chrome.windows.create` and creates a new window.

### Devtools Script

This is the script that adds the Redux panel in the Chrome DevTools using `chrome.devtools.panels.create`.

It creates a Window View if it has direct access to the background page, otherwise it creates a DevPanel View.

Note that this used to always show the DevPanel View, but [started using the Window View by default](https://github.com/zalmoxisus/redux-devtools-extension/pull/580) once direct access to the background page was added to Chrome DevTools tabs.
