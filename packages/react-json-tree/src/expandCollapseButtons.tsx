import {
  faArrowDown,
  faArrowRight,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';
import { ExpandCollapseAll } from '.';
import { useExpandCollapseAllContext } from './expandCollapseContext';
import { StylingFunction } from 'react-base16-styling';

interface Props {
  expandCollapseAll: ExpandCollapseAll;
  styling: StylingFunction;
}

interface ExpandButtonProps {
  expandableDefaultValue?: 'expand' | 'collapse';
  expandIcon?: ReactNode;
}

interface CollapseButtonProps {
  expandableDefaultValue?: 'expand' | 'collapse';
  collapseIcon?: ReactNode;
}

interface DefaultButtonProps {
  defaultIcon?: ReactNode;
}

function ExpandCollapseButtons({ expandCollapseAll, styling }: Props) {
  const { enableDefaultButton } = useExpandCollapseAllContext();

  const expandableDefaultValue = expandCollapseAll?.defaultValue || 'expand';

  return (
    <div {...styling('expandCollapseAll')}>
      {enableDefaultButton && (
        <DefaultButton defaultIcon={expandCollapseAll?.defaultIcon} />
      )}

      <ExpandButton
        expandableDefaultValue={expandableDefaultValue}
        expandIcon={expandCollapseAll?.expandIcon}
      />

      <CollapseButton
        expandableDefaultValue={expandCollapseAll?.defaultValue}
        collapseIcon={expandCollapseAll?.collapseIcon}
      />
    </div>
  );
}

function ExpandButton({
  expandableDefaultValue,
  expandIcon,
}: ExpandButtonProps) {
  const { expandAllState, setExpandAllState, setEnableDefaultButton } =
    useExpandCollapseAllContext();

  const onExpand = () => {
    setExpandAllState('expand');
    setEnableDefaultButton(true);
  };

  const isDefault = !expandAllState || expandAllState === 'default';

  if (
    expandAllState === 'collapse' ||
    (isDefault && expandableDefaultValue === 'expand')
  ) {
    return (
      <div role="presentation" onClick={onExpand}>
        {expandIcon || <FontAwesomeIcon icon={faArrowRight} />}
      </div>
    );
  }

  return <></>;
}

function CollapseButton({
  expandableDefaultValue,
  collapseIcon,
}: CollapseButtonProps) {
  const { expandAllState, setExpandAllState, setEnableDefaultButton } =
    useExpandCollapseAllContext();

  const onCollapse = () => {
    setExpandAllState('collapse');
    setEnableDefaultButton(true);
  };

  const isDefault = !expandAllState || expandAllState === 'default';

  if (
    expandAllState === 'expand' ||
    (isDefault && expandableDefaultValue === 'collapse')
  ) {
    return (
      <div role="presentation" onClick={onCollapse}>
        {collapseIcon || <FontAwesomeIcon icon={faArrowDown} />}
      </div>
    );
  }

  return <></>;
}

function DefaultButton({ defaultIcon }: DefaultButtonProps) {
  const { setExpandAllState, setEnableDefaultButton } =
    useExpandCollapseAllContext();

  const onDefaultCollapse = () => {
    setExpandAllState('default');
    setEnableDefaultButton(false);
  };

  return (
    <div role="presentation" onClick={onDefaultCollapse}>
      {defaultIcon || <FontAwesomeIcon icon={faUndo} />}
    </div>
  );

  return <></>;
}

export default ExpandCollapseButtons;
