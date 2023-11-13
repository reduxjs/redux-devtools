import { FilterState, FilterStateValue } from '../pageScript/api/filters';

export interface Options {
  readonly useEditor: number;
  readonly editor: string;
  readonly projectPath: string;
  readonly maxAge: number;
  readonly filter: FilterStateValue;
  readonly allowlist: string;
  readonly denylist: string;
  readonly shouldCatchErrors: boolean;
  readonly inject: boolean;
  readonly urls: string;
  readonly showContextMenus: boolean;
}

interface OldOrNewOptions {
  readonly useEditor: number;
  readonly editor: string;
  readonly projectPath: string;
  readonly maxAge: number;
  readonly filter:
    | FilterStateValue
    | 'WHITELIST_SPECIFIC'
    | 'BLACKLIST_SPECIFIC'
    | boolean;
  readonly allowlist: string;
  readonly denylist: string;
  readonly whitelist: string;
  readonly blacklist: string;
  readonly shouldCatchErrors: boolean;
  readonly inject: boolean;
  readonly urls: string;
  readonly showContextMenus: boolean;
}

let options: Options | undefined;
let subscribers: ((options: Options) => void)[] = [];

export interface OptionsMessage {
  readonly options: Options;
}

type ToAllTabs = (msg: OptionsMessage) => void;

const save =
  (toAllTabs: ToAllTabs | undefined) =>
  <K extends keyof Options>(key: K, value: Options[K]) => {
    let obj: { [K1 in keyof Options]?: Options[K1] } = {};
    obj[key] = value;
    chrome.storage.sync.set(obj);
    options![key] = value;
    toAllTabs!({ options: options! });
    subscribers.forEach((s) => s(options!));
  };

const migrateOldOptions = (oldOptions: OldOrNewOptions): Options => ({
  ...oldOptions,
  filter:
    // Migrate the old `filter` option from 2.2.1
    typeof oldOptions.filter === 'boolean'
      ? oldOptions.filter && oldOptions.whitelist.length > 0
        ? FilterState.ALLOWLIST_SPECIFIC
        : oldOptions.filter
          ? FilterState.DENYLIST_SPECIFIC
          : FilterState.DO_NOT_FILTER
      : oldOptions.filter === 'WHITELIST_SPECIFIC'
        ? FilterState.ALLOWLIST_SPECIFIC
        : oldOptions.filter === 'BLACKLIST_SPECIFIC'
          ? FilterState.DENYLIST_SPECIFIC
          : oldOptions.filter,
});

const get = (callback: (options: Options) => void) => {
  if (options) callback(options);
  else {
    chrome.storage.sync.get(
      {
        useEditor: 0,
        editor: '',
        projectPath: '',
        maxAge: 50,
        filter: FilterState.DO_NOT_FILTER,
        whitelist: '',
        blacklist: '',
        allowlist: '',
        denylist: '',
        shouldCatchErrors: false,
        inject: true,
        urls: '^https?://localhost|0\\.0\\.0\\.0:\\d+\n^https?://.+\\.github\\.io',
        showContextMenus: true,
      },
      function (items) {
        options = migrateOldOptions(items as OldOrNewOptions);
        callback(options);
      },
    );
  }
};

const subscribe = (callback: (options: Options) => void) => {
  subscribers = subscribers.concat(callback);
};

const toReg = (str: string) =>
  str !== '' ? str.split('\n').filter(Boolean).join('|') : null;

export const injectOptions = (newOptions: Options) => {
  if (!newOptions) return;

  options = {
    ...newOptions,
    allowlist:
      newOptions.filter !== FilterState.DO_NOT_FILTER
        ? toReg(newOptions.allowlist)!
        : newOptions.allowlist,
    denylist:
      newOptions.filter !== FilterState.DO_NOT_FILTER
        ? toReg(newOptions.denylist)!
        : newOptions.denylist,
  };
  let s = document.createElement('script');
  s.type = 'text/javascript';
  s.appendChild(
    document.createTextNode(
      'window.devToolsOptions = Object.assign(window.devToolsOptions||{},' +
        JSON.stringify(options) +
        ');',
    ),
  );
  (document.head || document.documentElement).appendChild(s);
  s.parentNode!.removeChild(s);
};

export const getOptionsFromBg = () => {
  /*  chrome.runtime.sendMessage({ type: 'GET_OPTIONS' }, response => {
    if (response && response.options) injectOptions(response.options);
  });
*/
  get((newOptions) => {
    injectOptions(newOptions);
  }); // Legacy
};

export const isAllowed = (localOptions = options) =>
  !localOptions ||
  localOptions.inject ||
  !localOptions.urls ||
  location.href.match(toReg(localOptions.urls)!);

export interface SyncOptions {
  readonly save: <K extends keyof Options>(key: K, value: Options[K]) => void;
  readonly get: (callback: (options: Options) => void) => void;
  readonly subscribe: (callback: (options: Options) => void) => void;
}

export default function syncOptions(toAllTabs?: ToAllTabs): SyncOptions {
  if (toAllTabs && !options) get(() => {}); // Initialize
  return {
    save: save(toAllTabs),
    get: get,
    subscribe: subscribe,
  };
}
