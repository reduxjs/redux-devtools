declare module 'react-dragula' {
  import { DragulaOptions, Drake } from 'dragula';

  export default function(
    containers: Array<HTMLElement>,
    options: DragulaOptions
  ): Drake;
}
