import styled, { ThemedStyledProps } from 'styled-components';
import color from '../../utils/color';
import { Theme } from '../../themes/default';

export const MainContainerWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  overflow: auto;
  ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
  background-color: ${(props: ThemedStyledProps<{}, Theme>) =>
    color(props.theme.base00, 'lighten', 0.03)};
  color: ${(props) => props.theme.base07};
  font-size: 12px;

  div,
  input,
  textarea,
  keygen,
  select,
  button {
    font-family: ${(props) => props.theme.fontFamily || 'monaco, monospace'};
  }

  .CodeMirror div,
  pre,
  .monitor div,
  .slider div {
    font-family: ${(props) =>
      props.theme.codeFontFamily || props.theme.fontFamily || 'monospace'};
  }

  .monitor {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    overflow: auto;

    > div {
      flex-grow: 1;
    }
  }
`;

export const ContainerWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  overflow: auto;
`;
