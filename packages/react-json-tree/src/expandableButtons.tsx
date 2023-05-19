import React, { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Expandable } from '.';

interface Props {
  expandable?: Expandable;
  shouldExpandNode?: 'expand' | 'collapse' | 'default';
  setShouldExpandNode: any;
}

interface ExpandButtonProps {
  expandableDefaultValue?: 'expand' | 'collapse';
  expandIcon?: ReactNode;
  shouldExpandNode?: 'expand' | 'collapse' | 'default';
  setShouldExpandNode: any;
}

interface CollapseButtonProps {
  expandableDefaultValue?: 'expand' | 'collapse';
  collapseIcon?: ReactNode;
  shouldExpandNode?: 'expand' | 'collapse' | 'default';
  setShouldExpandNode: any;
}

interface DefaultButtonProps {
  defaultIcon?: ReactNode;
  setShouldExpandNode: any;
}

function ExpandableButtons({ 
  expandable,
  setShouldExpandNode,
  shouldExpandNode
 }: Props){
    if(!expandable){
        return <></>
    }

    const expandableDefaultValue = expandable?.defaultValue || 'expand'

    return (
      <div style={{position: 'absolute', display: 'flex', justifyContent:'center', alignItems: 'center', gap:'1rem', top: '1rem', right: '1rem', cursor: 'pointer'}}>
        <DefaultButton
          defaultIcon={expandable?.defaultIcon}
          setShouldExpandNode={setShouldExpandNode}
        />

        <ExpandButton
          expandableDefaultValue={expandableDefaultValue}
          expandIcon={expandable?.expandIcon}
          setShouldExpandNode={setShouldExpandNode}
          shouldExpandNode={shouldExpandNode}
        />
        
        <CollapseButton
          expandableDefaultValue={expandable?.defaultValue}
          collapseIcon={expandable?.collapseIcon}
          setShouldExpandNode={setShouldExpandNode}
          shouldExpandNode={shouldExpandNode}
        />
      </div>
    )
}

function ExpandButton({ expandableDefaultValue, expandIcon, shouldExpandNode, setShouldExpandNode }: ExpandButtonProps) {
    const onExpand = () => setShouldExpandNode('expand');
  
    const isDefault = !shouldExpandNode ||shouldExpandNode === 'default'

    if (shouldExpandNode === 'collapse' || (isDefault && expandableDefaultValue === 'collapse')) {
      return (
        <div role="presentation" onClick={onExpand}>
          {expandIcon || <FontAwesomeIcon icon={faArrowRight} />}
        </div>
      );
    }
  
    return <></>;
  }
  
  function CollapseButton({ expandableDefaultValue, collapseIcon, shouldExpandNode, setShouldExpandNode }: CollapseButtonProps) {
    const onCollapse = () => setShouldExpandNode('collapse');
  
    const isDefault = !shouldExpandNode ||shouldExpandNode === 'default'

    if (shouldExpandNode === 'expand' ||(isDefault && expandableDefaultValue === 'expand')) {
      return (
        <div role="presentation" onClick={onCollapse}>
          {collapseIcon || <FontAwesomeIcon icon={faArrowDown} />}
        </div>
      );
    }
  
    return <></>;
  }
  
  function DefaultButton({defaultIcon, setShouldExpandNode }:DefaultButtonProps) {
    const onDefaultCollapse = () => setShouldExpandNode('default');
    
    return (
      <div role="presentation" onClick={onDefaultCollapse}>
        {defaultIcon || <FontAwesomeIcon icon={faUndo} />}
      </div>
    );
  
    return <></>;
  }

  export default ExpandableButtons