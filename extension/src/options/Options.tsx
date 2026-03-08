import React from 'react';
import EditorGroup from './EditorGroup.js';
import FilterGroup from './FilterGroup.js';
import AllowToRunGroup from './AllowToRunGroup.js';
import MiscellaneousGroup from './MiscellaneousGroup.js';
import ContextMenuGroup from './ContextMenuGroup.js';
import { Options } from './syncOptions.js';

export interface OptionsProps {
  readonly options: Options;
  readonly saveOption: <K extends keyof Options>(
    name: K,
    value: Options[K],
  ) => void;
}

export default function OptionsComponent(props: OptionsProps) {
  return (
    <div>
      <EditorGroup {...props} />
      <FilterGroup {...props} />
      <AllowToRunGroup {...props} />
      <MiscellaneousGroup {...props} />
      <ContextMenuGroup {...props} />
      <div style={{ color: 'red' }}>
        <br />
        <hr />
        Setting options here is discouraged, and will not be possible in the
        next major release. Please{' '}
        <a
          href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'red' }}
        >
          specify them as parameters
        </a>
        . See{' '}
        <a
          href="https://github.com/zalmoxisus/redux-devtools-extension/issues/296"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'red' }}
        >
          the issue
        </a>{' '}
        for more details.
      </div>
    </div>
  );
}
