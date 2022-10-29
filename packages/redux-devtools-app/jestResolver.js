module.exports = (path, options) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      if (pkg.name === 'nanoid') {
        pkg.exports['.'].browser = pkg.exports['.'].require;
      }
      if (pkg.name === 'uuid' && pkg.version.startsWith('8.')) {
        delete pkg.exports;
        delete pkg.module;
      }
      return pkg;
    },
  });
};
