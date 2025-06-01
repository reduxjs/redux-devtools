import styled from '@emotion/styled';
import { Theme } from '../../themes/default';

const Divider = styled.div`
  background-color: ${(props: { theme?: Theme }) => props.theme!.base02};
  box-shadow: 1px 1px 2px ${(props) => props.theme.base00};
  height: ${(props) => props.theme.inputHeight || '30'}px;
  width: 1px;
  margin: auto 3px !important;
  flex-shrink: 0;
`;

export default Divider;
