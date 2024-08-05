import React, { Component } from 'react';
import type { Delta } from 'jsondiffpatch';
import * as htmlFormatter from 'jsondiffpatch/formatters/html';
import styled, { ThemedStyledProps } from 'styled-components';
import { effects, Theme } from '@redux-devtools/ui';

export const StyledContainer = styled.div`
  .jsondiffpatch-delta {
    line-height: 14px;
    font-size: 12px;
    padding: 12px;
    margin: 0;
    display: inline-block;
  }

  .jsondiffpatch-delta pre {
    font-size: 12px;
    margin: 0;
    padding: 2px 3px;
    border-radius: 3px;
    position: relative;
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    color: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base07};
    display: inline-block;
  }

  ul.jsondiffpatch-delta {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }

  .jsondiffpatch-delta ul {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }

  .jsondiffpatch-left-value,
  .jsondiffpatch-right-value {
    vertical-align: top;
  }

  .jsondiffpatch-modified .jsondiffpatch-right-value:before {
    vertical-align: top;
    padding: 2px;
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    color: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base0E};
    content: ' => ';
  }

  .jsondiffpatch-added .jsondiffpatch-value pre,
  .jsondiffpatch-modified .jsondiffpatch-right-value pre,
  .jsondiffpatch-textdiff-added {
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    background: ${(props: ThemedStyledProps<{}, Theme>) =>
      effects.color(props.theme.base0B, 'alpha', 0.2)};
  }

  .jsondiffpatch-deleted pre,
  .jsondiffpatch-modified .jsondiffpatch-left-value pre,
  .jsondiffpatch-textdiff-deleted {
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    background: ${(props: ThemedStyledProps<{}, Theme>) =>
      effects.color(props.theme.base08, 'alpha', 0.2)};
    text-decoration: line-through;
  }

  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination {
    color: gray;
  }

  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination > .jsondiffpatch-value {
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    overflow-y: hidden;
  }

  .jsondiffpatch-unchanged-showing .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-showing
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value {
    max-height: 100px;
  }

  .jsondiffpatch-unchanged-hidden .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hidden
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value {
    max-height: 0;
  }

  .jsondiffpatch-unchanged-hiding
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value,
  .jsondiffpatch-unchanged-hidden
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value {
    display: block;
  }

  .jsondiffpatch-unchanged-visible .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-visible
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value {
    max-height: 100px;
  }

  .jsondiffpatch-unchanged-hiding .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hiding
    .jsondiffpatch-movedestination
    > .jsondiffpatch-value {
    max-height: 0;
  }

  .jsondiffpatch-unchanged-showing .jsondiffpatch-arrow,
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-arrow {
    display: none;
  }

  .jsondiffpatch-value {
    display: inline-block;
  }

  .jsondiffpatch-property-name {
    display: inline-block;
    padding: 2px 0;
    padding-right: 5px;
    vertical-align: top;
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    color: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base0D};
  }

  .jsondiffpatch-property-name:after {
    content: ': ';
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    color: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base07};
  }

  .jsondiffpatch-child-node-type-array > .jsondiffpatch-property-name:after {
    content: ': [';
  }

  .jsondiffpatch-child-node-type-array:after {
    content: '],';
  }

  div.jsondiffpatch-child-node-type-array:before {
    content: '[';
  }

  div.jsondiffpatch-child-node-type-array:after {
    content: ']';
  }

  .jsondiffpatch-child-node-type-object > .jsondiffpatch-property-name:after {
    content: ': {';
  }

  .jsondiffpatch-child-node-type-object:after {
    content: '},';
  }

  div.jsondiffpatch-child-node-type-object:before {
    content: '{';
  }

  div.jsondiffpatch-child-node-type-object:after {
    content: '}';
  }

  .jsondiffpatch-value pre:after {
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    color: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base07};
    content: ',';
  }

  li:last-child > .jsondiffpatch-value pre:after,
  .jsondiffpatch-modified > .jsondiffpatch-left-value pre:after {
    content: '';
  }

  .jsondiffpatch-modified .jsondiffpatch-value {
    display: inline-block;
  }

  .jsondiffpatch-modified .jsondiffpatch-right-value {
    margin-left: 5px;
  }

  .jsondiffpatch-moved .jsondiffpatch-value {
    display: none;
  }

  .jsondiffpatch-moved .jsondiffpatch-moved-destination {
    display: inline-block;
    ${/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */ ''}
    background: ${(props: ThemedStyledProps<{}, Theme>) => props.theme.base0A};
  }

  .jsondiffpatch-moved .jsondiffpatch-moved-destination:before {
    content: ' => ';
  }

  ul.jsondiffpatch-textdiff {
    padding: 0;
  }

  .jsondiffpatch-textdiff-location {
    display: inline-block;
    min-width: 60px;
  }

  .jsondiffpatch-textdiff-line {
    display: inline-block;
  }

  .jsondiffpatch-textdiff-line-number:after {
    content: ',';
  }

  .jsondiffpatch-error {
    background: red;
    color: white;
    font-weight: bold;
  }
`;

interface Props {
  data?: Delta;
}

export default class VisualDiffTab extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.data !== nextProps.data;
  }

  render() {
    let __html: string | undefined;
    const data = this.props.data;
    if (data) {
      __html = htmlFormatter.format(data, undefined);
    }

    return <StyledContainer dangerouslySetInnerHTML={{ __html: __html! }} />;
  }
}
