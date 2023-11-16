import React, { ReactElement } from 'react';
import { StylingFunction } from 'react-base16-styling';

export interface SearchBarProps {
  onChange: (s: string) => void;
  text: string;
  className?: string;
  styling: StylingFunction;
}

function SearchBar({
  onChange,
  text,
  className,
  styling,
}: SearchBarProps): ReactElement {
  return (
    <div className={`search-bar ${className || ''}`}>
      <input
        {...styling('searchInput')}
        placeholder={'Search'}
        value={text}
        type={'text'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
