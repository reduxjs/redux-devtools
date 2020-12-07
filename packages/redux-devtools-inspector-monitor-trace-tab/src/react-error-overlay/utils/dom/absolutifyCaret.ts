/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function removeNextBr(parent: Node, component: Element | null | undefined) {
  while (component != null && component.tagName.toLowerCase() !== 'br') {
    component = component.nextElementSibling;
  }
  if (component != null) {
    parent.removeChild(component);
  }
}

function absolutifyCaret(component: Node) {
  const ccn = component.childNodes;
  for (let index = 0; index < ccn.length; ++index) {
    const c = ccn[index] as HTMLElement;
    // $FlowFixMe
    if (c.tagName.toLowerCase() !== 'span') {
      continue;
    }
    const _text = c.innerText;
    if (_text == null) {
      continue;
    }
    const text = _text.replace(/\s/g, '');
    if (text !== '|^') {
      continue;
    }
    // $FlowFixMe
    c.style.position = 'absolute';
    c.style.marginTop = '-7px';
    // $FlowFixMe
    removeNextBr(component, c);
  }
}

export { absolutifyCaret };
