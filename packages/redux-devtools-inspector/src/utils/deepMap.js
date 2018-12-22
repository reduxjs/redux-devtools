function deepMapCached(obj, f, ctx, cache) {
  cache.push(obj);
  if (Array.isArray(obj)) {
    return obj.map(function(val, key) {
      val = f.call(ctx, val, key);
      return (typeof val === 'object' && cache.indexOf(val) === -1) ?
        deepMapCached(val, f, ctx, cache) : val;
    });
  } else if (typeof obj === 'object') {
    const res = {};
    for (const key in obj) {
      let val = obj[key];
      if (val && typeof val === 'object') {
        val = f.call(ctx, val, key);
        res[key] = cache.indexOf(val) === -1 ?
          deepMapCached(val, f, ctx, cache) : val;
      } else {
        res[key] = f.call(ctx, val, key);
      }
    }
    return res;
  } else {
    return obj;
  }
}

export default function deepMap(obj, f, ctx) {
  return deepMapCached(obj, f, ctx, []);
}
