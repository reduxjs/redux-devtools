export default function getOptions() {
  return {
    useExtension: window.location.search.indexOf('ext') !== -1,
    supportImmutable: window.location.search.indexOf('immutable') !== -1,
    theme: do {
      const match = window.location.search.match(/theme=([^&]+)/);
      match ? match[1] : 'inspector'
    },
    dark: window.location.search.indexOf('dark') !== -1
  };
}
