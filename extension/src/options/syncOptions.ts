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
  readonly type: 'OPTIONS';
  readonly options: Options;
}

export const saveOption = <K extends keyof Options>(
  key: K,
  value: Options[K],
) => {
  const obj: { [K1 in keyof Options]?: Options[K1] } = {};
  obj[key] = value;
  void chrome.storage.sync.set(obj);
  options![key] = value;
  for (const subscriber of subscribers) {
    subscriber(options!);
  }
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

export const getOptions = (callback: (options: Options) => void) => {
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

export const prefetchOptions = () =>
  getOptions(() => {
    // do nothing.
  });

export const subscribeToOptions = (callback: (options: Options) => void) => {
  subscribers = subscribers.concat(callback);
};

const toReg = (str: string) =>
  str !== '' ? str.split('\n').filter(Boolean).join('|') : null;

export const prepareOptionsForPage = (options: Options): Options => ({
  ...options,
  allowlist:
    options.filter !== FilterState.DO_NOT_FILTER
      ? toReg(options.allowlist)!
      : options.allowlist,
  denylist:
    options.filter !== FilterState.DO_NOT_FILTER
      ? toReg(options.denylist)!
      : options.denylist,
});

export const isAllowed = (localOptions = options) =>
  !localOptions ||
  localOptions.inject ||
  !localOptions.urls ||
  location.href.match(toReg(localOptions.urls)!);
