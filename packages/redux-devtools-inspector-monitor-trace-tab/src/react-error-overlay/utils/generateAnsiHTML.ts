/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Anser from 'anser';
import { base16Themes } from 'react-base16-styling';
import { encode } from 'html-entities';

const theme = base16Themes.nicinabox;

const anserMap = {
  'ansi-bright-black': theme.base03,
  'ansi-bright-yellow': theme.base0A,
  'ansi-yellow': theme.base0B,
  'ansi-bright-green': theme.base0B,
  'ansi-green': theme.base0F,
  'ansi-bright-cyan': theme.base0D,
  'ansi-cyan': theme.base0C,
  'ansi-bright-red': theme.base09,
  'ansi-red': theme.base0E,
  'ansi-bright-magenta': theme.base0F,
  'ansi-magenta': theme.base0E,
  'ansi-white': theme.base00,
};

function generateAnsiHTML(txt: string): string {
  const arr = new Anser().ansiToJson(encode(txt), {
    use_classes: true,
  });

  let result = '';
  let open = false;
  for (let index = 0; index < arr.length; ++index) {
    const c = arr[index];
    const content = c.content,
      fg = c.fg;

    const contentParts = content.split('\n');
    for (let _index = 0; _index < contentParts.length; ++_index) {
      if (!open) {
        result += '<span data-ansi-line="true">';
        open = true;
      }
      const part = contentParts[_index].replace('\r', '');
      const color = anserMap[fg as keyof typeof anserMap];
      if (color != null) {
        result += '<span style="color: ' + color + ';">' + part + '</span>';
      } else {
        if (fg != null) {
          console.log('Missing color mapping:', fg); // eslint-disable-line no-console
        }
        result += '<span>' + part + '</span>';
      }
      if (_index < contentParts.length - 1) {
        result += '</span>';
        open = false;
        result += '<br/>';
      }
    }
  }
  if (open) {
    result += '</span>';
    open = false;
  }
  return result;
}

export default generateAnsiHTML;
