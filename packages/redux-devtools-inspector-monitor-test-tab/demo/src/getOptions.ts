export interface Options {
  useExtension: boolean;
  supportImmutable: boolean;
  theme: string;
  dark: boolean;
}

export default function getOptions(location: { search: string }) {
  return {
    useExtension: location.search.indexOf('ext') !== -1,
    supportImmutable: location.search.indexOf('immutable') !== -1,
    theme: getTheme(location),
    dark: location.search.indexOf('dark') !== -1,
  };
}

function getTheme(location: { search: string }) {
  const match = /theme=([^&]+)/.exec(location.search);
  return match ? match[1] : 'inspector';
}
