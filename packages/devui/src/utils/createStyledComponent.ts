import styled from 'styled-components';
import getDefaultTheme from '../themes/default';

const getStyle = (styles, type) =>
  typeof styles === 'object' ? styles[type] || styles.default : styles;

export default (styles, component) =>
  styled(component || 'div')`
    ${(props) =>
      props.theme.type
        ? getStyle(styles, props.theme.type)
        : // used outside of container (theme provider)
          getStyle(
            styles,
            'default'
          )({
            ...props,
            theme: getDefaultTheme(props.theme),
          })}
  `;

// TODO: memoize it?
