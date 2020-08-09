export default function getOptions(location) {
  return {
    useExtension: location.search.indexOf('ext') !== -1,
    supportImmutable: location.search.indexOf('immutable') !== -1,
    theme: do {
      const match = location.search.match(/theme=([^&]+)/);
      match ? match[1] : 'inspector';
    },
    dark: location.search.indexOf('dark') !== -1,
  };
}
