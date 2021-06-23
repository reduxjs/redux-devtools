export function formatMs(milliseconds: number): string {
  if (!Number.isFinite(milliseconds)) {
    return 'NaN';
  }

  const absInput = Math.abs(Math.round(milliseconds));
  let millis = (absInput % 1000).toString();

  if (millis.length < 3) {
    if (millis.length === 2) {
      millis = '0' + millis;
    } else {
      millis = '00' + millis;
    }
  }

  const seconds = Math.floor(absInput / 1_000) % 60;
  const minutes = Math.floor(absInput / 60_000);

  let output = `${seconds}.${millis}s`;

  if (minutes > 0) {
    output = `${minutes}m${output}`;
  }

  if (milliseconds < 0) {
    output = `-${output}`;
  }

  return output;
}
