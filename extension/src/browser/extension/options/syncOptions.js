import { FilterState } from '../../../app/api/filters';

let options;
let subscribers = [];

const save = (toAllTabs) => (key, value) => {
  let obj = {};
  obj[key] = value;
  chrome.storage.sync.set(obj);
  options[key] = value;
  toAllTabs({ options: options });
  subscribers.forEach(s => s(options));
};

const migrateOldOptions = (oldOptions) => {
  let newOptions = Object.assign({}, oldOptions);

  // Migrate the old `filter` option from 2.2.1
  if (typeof oldOptions.filter === 'boolean') {
    if (oldOptions.filter && oldOptions.whitelist.length > 0) {
      newOptions.filter = FilterState.WHITELIST_SPECIFIC;
    } else if (oldOptions.filter) {
      newOptions.filter = FilterState.BLACKLIST_SPECIFIC;
    } else {
      newOptions.filter = FilterState.DO_NOT_FILTER;
    }
  }

  return newOptions;
};

const get = callback => {
  if (options) callback(options);
  else {
    chrome.storage.sync.get({
      useEditor: 0,
      editor: '',
      projectPath: '',
      maxAge: 50,
      filter: FilterState.DO_NOT_FILTER,
      whitelist: '',
      blacklist: '',
      shouldCatchErrors: false,
      inject: true,
      urls: '^https?://localhost|0\\.0\\.0\\.0:\\d+\n^https?://.+\\.github\\.io',
      showContextMenus: true
    }, function(items) {
      options = migrateOldOptions(items);
      callback(options);
    });
  }
};

const subscribe = callback => {
  subscribers = subscribers.concat(callback);
};

const toReg = str => (
  str !== '' ? str.split('\n').filter(Boolean).join('|') : null
);

export const injectOptions = newOptions => {
  if (!newOptions) return;
  if (newOptions.filter !== FilterState.DO_NOT_FILTER) {
    newOptions.whitelist = toReg(newOptions.whitelist);
    newOptions.blacklist = toReg(newOptions.blacklist);
  }

  options = newOptions;
  let s = document.createElement('script');
  s.type = 'text/javascript';
  s.appendChild(document.createTextNode(
    'window.devToolsOptions = Object.assign(window.devToolsOptions||{},' + JSON.stringify(options) + ');'
  ));
  (document.head || document.documentElement).appendChild(s);
  s.parentNode.removeChild(s);
};

export const getOptionsFromBg = () => {
/*  chrome.runtime.sendMessage({ type: 'GET_OPTIONS' }, response => {
    if (response && response.options) injectOptions(response.options);
  });
*/
  get(newOptions => { injectOptions(newOptions); }); // Legacy
};

export const isAllowed = (localOptions = options) => (
  !localOptions || localOptions.inject || !localOptions.urls
    || location.href.match(toReg(localOptions.urls))
);

export default function syncOptions(toAllTabs) {
  if (toAllTabs && !options) get(() => {}); // Initialize
  return {
    save: save(toAllTabs),
    get: get,
    subscribe: subscribe
  };
}
