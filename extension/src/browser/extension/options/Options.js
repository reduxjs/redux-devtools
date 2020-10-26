import React from 'react';
import EditorGroup from './EditorGroup';
import FilterGroup from './FilterGroup';
import AllowToRunGroup from './AllowToRunGroup';
import MiscellaneousGroup from './MiscellaneousGroup';
import ContextMenuGroup from './ContextMenuGroup';

export default (props) => (
  <div>
    <EditorGroup {...props} />
    <FilterGroup {...props} />
    <AllowToRunGroup {...props} />
    <MiscellaneousGroup {...props} />
    <ContextMenuGroup {...props} />
    <div style={{ color: 'red' }}><br /><hr />Setting options here is discouraged, and will not be possible in the next major release. Please <a href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md" target="_blank" style={{ color: 'red' }}>specify them as parameters</a>. See <a href="https://github.com/zalmoxisus/redux-devtools-extension/issues/296" target="_blank" style={{ color: 'red' }}>the issue</a> for more details.</div>
  </div>
);
