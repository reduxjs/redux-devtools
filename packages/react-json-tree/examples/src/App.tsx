import React from 'react';
import { Map } from 'immutable';
import JSONTree, { StylingValue } from 'react-json-tree';

const getLabelStyle: StylingValue = ({ style }, nodeType, expanded) => ({
  style: {
    ...style,
    textTransform: expanded ? 'uppercase' : style.textTransform,
  },
});

const getBoolStyle: StylingValue = ({ style }, nodeType) => ({
  style: {
    ...style,
    border: nodeType === 'Boolean' ? '1px solid #DD3333' : style.border,
    borderRadius: nodeType === 'Boolean' ? 3 : style.borderRadius,
  },
});

const getItemString = (type: string) => (
  <span>
    {' // '}
    {type}
  </span>
);

const getValueLabelStyle: StylingValue = ({ style }, nodeType, keyPath) => ({
  style: {
    ...style,
    color:
      !Number.isNaN(keyPath[0]) && !(parseInt(keyPath, 10) % 2)
        ? '#33F'
        : style.color,
  },
});

const longString =
  'Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.'; // eslint-disable-line max-len

class Custom {
  value: unknown;

  constructor(value: unknown) {
    this.value = value;
  }

  get [Symbol.toStringTag]() {
    return 'Custom';
  }
}

const data = {
  array: [1, 2, 3],
  emptyArray: [],
  bool: true,
  date: new Date(),
  error: new Error(longString),
  object: {
    foo: {
      bar: 'baz',
      nested: {
        moreNested: {
          evenMoreNested: {
            veryNested: {
              insanelyNested: {
                ridiculouslyDeepValue: 'Hello',
              },
            },
          },
        },
      },
    },
    baz: undefined,
    func: function User() {
      // noop
    },
  },
  emptyObject: {},
  symbol: Symbol('value'),
  // eslint-disable-next-line new-cap
  immutable: Map<any, any>([
    ['key', 'value'],
    [{ objectKey: 'value' }, { objectKey: 'value' }],
  ]),
  map: new window.Map<any, any>([
    ['key', 'value'],
    [0, 'value'],
    [{ objectKey: 'value' }, { objectKey: 'value' }],
  ]),
  weakMap: new window.WeakMap([
    [{ objectKey: 'value' }, { objectKey: 'value' }],
  ]),
  set: new window.Set(['value', 0, { objectKey: 'value' }]),
  weakSet: new window.WeakSet([
    { objectKey: 'value1' },
    { objectKey: 'value2' },
  ]),
  hugeArray: Array.from({ length: 10000 }).map((_, i) => `item #${i}`),
  customProfile: {
    avatar: new Custom('placehold.it/50x50'),
    name: new Custom('Name'),
  },
  longString,
};

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const App = () => (
  <div>
    <JSONTree data={data} theme={theme} invertTheme />
    <br />
    <h3>Dark Theme</h3>
    <JSONTree data={data} theme={theme} invertTheme={false} />
    <br />
    <h3>Hidden Root</h3>
    <JSONTree data={data} theme={theme} hideRoot />
    <br />
    <h3>Base16 Greenscreen Theme</h3>
    <JSONTree data={data} theme="greenscreen" invertTheme={false} />
    <h4>Inverted Theme</h4>
    <JSONTree data={data} theme="greenscreen" invertTheme />
    <br />
    <h3>Style Customization</h3>
    <ul>
      <li>
        Label changes between uppercase/lowercase based on the expanded state.
      </li>
      <li>Array keys are styled based on their parity.</li>
      <li>
        The labels of objects, arrays, and iterables are customized as &quot;//
        type&quot;.
      </li>
      <li>See code for details.</li>
    </ul>
    <div>
      <JSONTree
        data={data}
        theme={{
          extend: theme,
          nestedNodeLabel: getLabelStyle,
          value: getBoolStyle,
          valueLabel: getValueLabelStyle,
        }}
        getItemString={getItemString}
      />
    </div>
    <h3>More Fine Grained Rendering</h3>
    <p>
      Pass <code>labelRenderer</code> or <code>valueRenderer</code>.
    </p>
    <div>
      <JSONTree
        data={data}
        theme={theme}
        labelRenderer={([raw]) => <span>(({raw})):</span>}
        valueRenderer={(raw) => (
          <em>
            <span role="img" aria-label="mellow">
              😐
            </span>{' '}
            {raw}{' '}
            <span role="img" aria-label="mellow">
              😐
            </span>
          </em>
        )}
      />
    </div>
    <p>
      Sort object keys with <code>sortObjectKeys</code> prop.
    </p>
    <div>
      <JSONTree data={data} theme={theme} sortObjectKeys />
    </div>
    <p>Collapsed root node</p>
    <div>
      <JSONTree data={data} theme={theme} shouldExpandNode={() => false} />
    </div>
  </div>
);

export default App;
