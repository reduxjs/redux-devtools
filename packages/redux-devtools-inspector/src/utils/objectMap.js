function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function (result, key) {
    result.push(mapFn(object[key], key))
    return result
  }, [])
}

export default objectMap;
