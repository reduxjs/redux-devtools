import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Expandable } from '.';
import ExpandableButtons from './expandableButtons';

interface Context {
  enableDefaultButton: boolean;
  setEnableDefaultButton: any;
  shouldExpandNode?: 'expand' | 'collapse' | 'default';
  setShouldExpandNode: any;
}

interface Props {
  children: ReactNode;
  expandable?: Expandable;
}

const ExpandableButtonsContext = createContext<Context>({} as Context);

function ExpandableButtonsContextProvider({ expandable, children }: Props) {
  const [enableDefaultButton, setEnableDefaultButton] = useState(false);
  const [shouldExpandNode, setShouldExpandNode] = useState();

  const value = useMemo(
    () => ({
      enableDefaultButton,
      setEnableDefaultButton,
      shouldExpandNode,
      setShouldExpandNode,
    }),
    [enableDefaultButton, shouldExpandNode]
  );

  return (
    <ExpandableButtonsContext.Provider value={value}>
      {children}
      {expandable && <ExpandableButtons expandable={expandable} />}
    </ExpandableButtonsContext.Provider>
  );
}

export const useExpandableButtonContext = () =>
  useContext(ExpandableButtonsContext);

export default ExpandableButtonsContextProvider;
