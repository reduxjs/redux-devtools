import React from 'react';
import { ThemeProvider } from 'styled-components';
import { useTheme, ThemeData } from '../utils/theme';
import { MainContainerWrapper, ContainerWrapper } from './styles';
import { Theme } from '../themes/default';

interface ContainerFromThemeDataProps {
  children?: React.ReactNode;
  themeData: ThemeData;
  className?: string;
}

const ContainerFromThemeData: React.FunctionComponent<
  ContainerFromThemeDataProps
> = ({ themeData, className, children }) => {
  const theme = useTheme(themeData);
  return (
    <ThemeProvider theme={theme}>
      <MainContainerWrapper className={className}>
        {children}
      </MainContainerWrapper>
    </ThemeProvider>
  );
};

interface Props {
  children?: React.ReactNode;
  themeData?: ThemeData;
  theme?: Theme;
  className?: string;
}

const Container: React.FunctionComponent<Props> = ({
  themeData,
  className,
  theme,
  children,
}) => {
  if (!themeData) {
    return (
      <ContainerWrapper className={className} theme={theme}>
        {children}
      </ContainerWrapper>
    );
  }

  return (
    <ContainerFromThemeData themeData={themeData} className={className}>
      {children}
    </ContainerFromThemeData>
  );
};

export default Container;
