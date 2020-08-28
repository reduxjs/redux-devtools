// jsan stringify options

module.exports = {
  refs: false, // references can't be resolved on the original Immutable structure
  date: true,
  function: true,
  regex: true,
  undefined: true,
  error: true,
  symbol: true,
  map: true,
  set: true,
  nan: true,
  infinity: true,
};
