import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { getTheme } from '../utils/theme';
import { MainContainerWrapper, ContainerWrapper } from './styles';

const Container = ({ themeData, className, theme, children }) => {
  if (!themeData) {
    return (
      <ContainerWrapper className={className} theme={theme}>
        {children}
      </ContainerWrapper>
    );
  }

  return (
    <ThemeProvider theme={getTheme(themeData)}>
      <MainContainerWrapper className={className}>
        {children}
      </MainContainerWrapper>
    </ThemeProvider>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  themeData: PropTypes.object,
  theme: PropTypes.object,
  className: PropTypes.string,
};

export default Container;
