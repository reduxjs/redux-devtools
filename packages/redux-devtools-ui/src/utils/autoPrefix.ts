export const prefixSelectors = (
  tag: string,
  selectors: string[],
  style: string,
) => selectors.map((selector) => `${tag}::-${selector} ${style}`);
