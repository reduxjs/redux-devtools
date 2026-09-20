import { default as threezerotwofour } from './threezerotwofour.js';
import { default as apathy } from './apathy.js';
import { default as ashes } from './ashes.js';
import { default as atelierDune } from './atelier-dune.js';
import { default as atelierForest } from './atelier-forest.js';
import { default as atelierHeath } from './atelier-heath.js';
import { default as atelierLakeside } from './atelier-lakeside.js';
import { default as atelierSeaside } from './atelier-seaside.js';
import { default as bespin } from './bespin.js';
import { default as brewer } from './brewer.js';
import { default as bright } from './bright.js';
import { default as chalk } from './chalk.js';
import { default as codeschool } from './codeschool.js';
import { default as colors } from './colors.js';
import { default as defaultTheme } from './default.js';
import { default as eighties } from './eighties.js';
import { default as embers } from './embers.js';
import { default as flat } from './flat.js';
import { default as google } from './google.js';
import { default as grayscale } from './grayscale.js';
import { default as greenscreen } from './greenscreen.js';
import { default as harmonic } from './harmonic.js';
import { default as hopscotch } from './hopscotch.js';
import { default as isotope } from './isotope.js';
import { default as marrakesh } from './marrakesh.js';
import { default as mocha } from './mocha.js';
import { default as monokai } from './monokai.js';
import { default as nicinabox } from './nicinabox.js';
import { default as ocean } from './ocean.js';
import { default as paraiso } from './paraiso.js';
import { default as pop } from './pop.js';
import { default as railscasts } from './railscasts.js';
import { default as shapeshifter } from './shapeshifter.js';
import { default as solarized } from './solarized.js';
import { default as summerfruit } from './summerfruit.js';
import { default as tomorrow } from './tomorrow.js';
import { default as tube } from './tube.js';
import { default as twilight } from './twilight.js';

export interface Base16Theme {
  scheme: string;
  author: string;
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
}

export const base16Themes = {
  threezerotwofour,
  apathy,
  ashes,
  atelierDune,
  atelierForest,
  atelierHeath,
  atelierLakeside,
  atelierSeaside,
  bespin,
  brewer,
  bright,
  chalk,
  codeschool,
  colors,
  default: defaultTheme,
  eighties,
  embers,
  flat,
  google,
  grayscale,
  greenscreen,
  harmonic,
  hopscotch,
  isotope,
  marrakesh,
  mocha,
  monokai,
  nicinabox,
  ocean,
  paraiso,
  pop,
  railscasts,
  shapeshifter,
  solarized,
  summerfruit,
  tomorrow,
  tube,
  twilight,
};
