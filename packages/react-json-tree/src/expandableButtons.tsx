import {
  faArrowDown,
  faArrowRight,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';
import { Expandable } from '.';
import { useExpandableButtonContext } from './expandableButtonsContext';
import { StylingFunction } from 'react-base16-styling';

interface ExpandableButtonsProps {
  expandable: Expandable;
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

function ExpandableButtons({ expandable, styling }: ExpandableButtonsProps) {
  const { enableDefaultButton } = useExpandableButtonContext();

  const expandableDefaultValue = expandable?.defaultValue || 'expand';

  return (
    <div {...styling('expandable')}>
      {enableDefaultButton && (
        <DefaultButton defaultIcon={expandable?.defaultIcon} />
      )}

      <ExpandButton
        expandableDefaultValue={expandableDefaultValue}
        expandIcon={expandable?.expandIcon}
      />

      <CollapseButton
        expandableDefaultValue={expandable?.defaultValue}
        collapseIcon={expandable?.collapseIcon}
      />
    </div>
  );
}

function ExpandButton({
  expandableDefaultValue,
  expandIcon,
}: ExpandButtonProps) {
  const { expandAllState, setExpandAllState, setEnableDefaultButton } =
    useExpandableButtonContext();

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
    useExpandableButtonContext();

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
    useExpandableButtonContext();

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

export default ExpandableButtons;
