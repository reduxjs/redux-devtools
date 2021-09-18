import styled from 'styled-components';
import { Position } from '../Tabs';

interface StyleProps {
  position: Position;
}

export const TabsContainer = styled.div<StyleProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  height: 100%;

  > div > div:first-child {
    ${(props) =>
      props.position !== 'left' &&
      `
      margin-left: auto !important;
    `}
    ${(props) =>
      props.position === 'center' &&
      `
      margin-right: auto !important;
    `}
  }

  > div:nth-child(2) {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }
`;
