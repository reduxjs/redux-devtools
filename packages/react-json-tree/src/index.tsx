// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

import React from 'react';
import PropTypes from 'prop-types';
import JSONNode from './JSONNode';
import createStylingFromTheme from './createStylingFromTheme';
import {
  invertTheme,
  StylingConfig,
  StylingFunction,
  StylingValue,
  Theme,
} from 'react-base16-styling';
import { CircularPropsPassedThroughJSONTree } from './types';

interface Props extends CircularPropsPassedThroughJSONTree {
  data: any;
  theme?: Theme;
  invertTheme: boolean;
}

interface State {
  styling: StylingFunction;
}

const identity = (value: any) => value;
const expandRootNode = (
  keyPath: (string | number)[],
  data: any,
  level: number
) => level === 0;
const defaultItemString = (
  type: string,
  data: any,
  itemType: React.ReactNode,
  itemString: string
) => (
  <span>
    {itemType} {itemString}
  </span>
);
const defaultLabelRenderer = ([label]: (string | number)[]) => (
  <span>{label}:</span>
);
const noCustomNode = () => false;

function checkLegacyTheming(theme: Theme | undefined, props: Props) {
  const deprecatedStylingMethodsMap = {
    getArrowStyle: 'arrow',
    getListStyle: 'nestedNodeChildren',
    getItemStringStyle: 'nestedNodeItemString',
    getLabelStyle: 'label',
    getValueStyle: 'valueText',
  };

  const deprecatedStylingMethods = Object.keys(
    deprecatedStylingMethodsMap
  ).filter((name) => props[name as keyof Props]);

  if (deprecatedStylingMethods.length > 0) {
    if (typeof theme === 'string') {
      theme = {
        extend: theme,
      };
    } else {
      theme = { ...theme };
    }

    deprecatedStylingMethods.forEach((name) => {
      // eslint-disable-next-line no-console
      console.error(
        `Styling method "${name}" is deprecated, use "theme" property instead`
      );

      (theme as StylingConfig)[
        deprecatedStylingMethodsMap[
          name as keyof typeof deprecatedStylingMethodsMap
        ]
      ] = ({ style }, ...args) => ({
        style: {
          ...style,
          ...props[name as keyof Props](...args),
        },
      });
    });
  }

  return theme;
}

function getStateFromProps(props: Props) {
  let theme = checkLegacyTheming(props.theme, props);
  if (props.invertTheme) {
    theme = invertTheme(theme);
  }

  return {
    styling: createStylingFromTheme(theme),
  };
}

export default class JSONTree extends React.Component<Props, State> {
  static propTypes = {
    data: PropTypes.any,
    hideRoot: PropTypes.bool,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    invertTheme: PropTypes.bool,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    postprocessValue: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  };

  static defaultProps = {
    shouldExpandNode: expandRootNode,
    hideRoot: false,
    keyPath: ['root'],
    getItemString: defaultItemString,
    labelRenderer: defaultLabelRenderer,
    valueRenderer: identity,
    postprocessValue: identity,
    isCustomNode: noCustomNode,
    collectionLimit: 50,
    invertTheme: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      ['theme', 'invertTheme'].find(
        (k) => nextProps[k as keyof Props] !== this.props[k as keyof Props]
      )
    ) {
      this.setState(getStateFromProps(nextProps));
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return !!Object.keys(nextProps).find((k) =>
      k === 'keyPath'
        ? nextProps[k].join('/') !== this.props[k].join('/')
        : nextProps[k as keyof Props] !== this.props[k as keyof Props]
    );
  }

  render() {
    const {
      data: value,
      keyPath,
      postprocessValue,
      hideRoot,
      theme, // eslint-disable-line no-unused-vars
      invertTheme: _, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    const { styling } = this.state;

    return (
      <ul {...styling('tree')}>
        <JSONNode
          {...{ postprocessValue, hideRoot, styling, ...rest }}
          keyPath={hideRoot ? [] : keyPath}
          value={postprocessValue(value)}
        />
      </ul>
    );
  }
}

export { StylingValue };
