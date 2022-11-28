module.exports = (path, options) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      if (pkg.name === 'nanoid') {
        pkg.exports['.'].browser = pkg.exports['.'].require;
      }
      return pkg;
    },
  });
};
