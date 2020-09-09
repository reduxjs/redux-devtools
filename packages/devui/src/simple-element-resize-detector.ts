declare module 'simple-element-resize-detector' {
  export default function (
    element: HTMLElement,
    handler: () => void
  ): HTMLIFrameElement;
}
