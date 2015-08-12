export default function(hex, lum) {
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
      hex = hex.replace(/(.)/g, '$1$1');
  }
  lum = lum || 0;

  var rgb = "#",
      c;
  for (var i = 0; i < 3; ++i) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
  }
  return rgb;
};
