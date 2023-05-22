import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Expandable } from '.';
import ExpandableButtons from './expandableButtons';
import { StylingFunction } from 'react-base16-styling';

interface Context {
  enableDefaultButton: boolean;
  setEnableDefaultButton: any;
  expandAllState?: 'expand' | 'collapse' | 'default';
  setExpandAllState: any;
}

interface Props {
  children: ReactNode;
  expandable?: Expandable;
  styling: StylingFunction;
}

const ExpandableButtonsContext = createContext<Context>({} as Context);

function ExpandableButtonsContextProvider({
  expandable,
  children,
  styling,
}: Props) {
  const [enableDefaultButton, setEnableDefaultButton] = useState(false);
  const [expandAllState, setExpandAllState] = useState();

  const value = useMemo(
    () => ({
      enableDefaultButton,
      setEnableDefaultButton,
      expandAllState,
      setExpandAllState,
    }),
    [enableDefaultButton, expandAllState]
  );

  return (
    <ExpandableButtonsContext.Provider value={value}>
      {children}
      {expandable && (
        <ExpandableButtons expandable={expandable} styling={styling} />
      )}
    </ExpandableButtonsContext.Provider>
  );
}

export const useExpandableButtonContext = () =>
  useContext(ExpandableButtonsContext);

export default ExpandableButtonsContextProvider;
