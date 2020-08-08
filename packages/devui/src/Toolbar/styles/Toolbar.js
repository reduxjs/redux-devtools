import styled from 'styled-components';

const Toolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  font-family: ${(props) => props.theme.fontFamily || 'monospace'};
  font-size: 12px;
  line-height: 16px;
  ${(props) => props.fullHeight && 'height: 100%;'}
  padding: ${(props) => (props.compact ? '0' : '5px')} 5px;
  background-color: ${(props) => props.theme.base01};
  text-align: center;
  position: relative;
  ${({ borderPosition, theme }) =>
    borderPosition && `border-${borderPosition}: 1px solid ${theme.base02};`}
  
  & > div {
    margin: auto ${(props) => (props.noBorder ? '0' : '1px;')};
  }
  
  & button {
    border-radius: 0;
    ${(props) => props.noBorder && 'border-color: transparent;'}
    white-space: nowrap;
    box-shadow: none !important;
  }

  & > .Select {
    position: static;
    text-align: left;
    margin: auto 1px;
    flex-grow: 1;
    
    .Select-control {
      cursor: pointer;
      border-radius: 0 !important;
      text-align: center;
      background-color: ${(props) => props.theme.base01};
    }

    .Select-menu-outer {
      margin-top: 5px;
    }
  }
  & > .Select.is-focused > .Select-control {
    text-align: left;
  }
`;

export default Toolbar;
