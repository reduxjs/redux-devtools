export const prefixSelectors = (tag, selectors, style) =>
  selectors.map((selector) => `${tag}::-${selector} ${style}`);
