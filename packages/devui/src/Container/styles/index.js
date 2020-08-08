import styled from 'styled-components';
import color from '../../utils/color';

export const MainContainerWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  background-color: ${(props) => color(props.theme.base00, 'lighten', 0.03)};
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
  .monitor-LogMonitor * {
    font-family: ${(props) =>
      props.theme.codeFontFamily || props.theme.fontFamily || 'monospace'};
  }

  .monitor {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

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
`;
