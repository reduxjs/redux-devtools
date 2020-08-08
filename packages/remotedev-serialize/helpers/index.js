function mark(data, type, transformMethod) {
  return {
    data: transformMethod ? data[transformMethod]() : data,
    __serializedType__: type,
  };
}

function extract(data, type) {
  return {
    data: Object.assign({}, data),
    __serializedType__: type,
  };
}

function refer(data, type, isArray, refs) {
  var r = mark(data, type, isArray);
  if (!refs) return r;
  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i];
    if (typeof ref === 'function' && data instanceof ref) {
      r.__serializedRef__ = i;
      return r;
    }
  }
  return r;
}

module.exports = {
  mark: mark,
  extract: extract,
  refer: refer,
};
