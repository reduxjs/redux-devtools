import styled from 'styled-components';

const Divider = styled.div`
  background-color: ${(props) => props.theme.base02};
  box-shadow: 1px 1px 2px ${(props) => props.theme.base00};
  height: ${(props) => props.theme.inputHeight || '30'}px;
  width: 1px;
  margin: auto 3px !important;
  flex-shrink: 0;
`;

export default Divider;
