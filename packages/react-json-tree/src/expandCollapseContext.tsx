import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ExpandCollapseAll } from '.';
import ExpandCollapseButtons from './expandCollapseButtons';
import { StylingFunction } from 'react-base16-styling';

interface Context {
  enableDefaultButton: boolean;
  setEnableDefaultButton: any;
  expandAllState?: 'expand' | 'collapse' | 'default';
  setExpandAllState: any;
}

interface Props {
  children: ReactNode;
  expandCollapseAll?: ExpandCollapseAll;
  styling: StylingFunction;
}

const ExpandCollapseAllContext = createContext<Context>({} as Context);

function ExpandCollapseAllContextProvider({
  expandCollapseAll,
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
    <ExpandCollapseAllContext.Provider value={value}>
      {children}
      {expandCollapseAll && (
        <ExpandCollapseButtons
          expandCollapseAll={expandCollapseAll}
          styling={styling}
        />
      )}
    </ExpandCollapseAllContext.Provider>
  );
}

export const useExpandCollapseAllContext = () =>
  useContext(ExpandCollapseAllContext);

export default ExpandCollapseAllContextProvider;
