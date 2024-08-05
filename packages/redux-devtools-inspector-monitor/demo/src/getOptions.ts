export interface Options {
  useExtension: boolean;
  supportImmutable: boolean;
  theme: string;
  dark: boolean;
}

export default function getOptions(location: { search: string }) {
  return {
    useExtension: location.search.includes('ext'),
    supportImmutable: location.search.includes('immutable'),
    theme: getTheme(location),
    dark: location.search.includes('dark'),
  };
}

function getTheme(location: { search: string }) {
  const match = /theme=([^&]+)/.exec(location.search);
  return match ? match[1] : 'inspector';
}
