/**
 * An implementation of `Kahan-Babuska algorithm`
 * that reduces numerical floating point errors.
 * @param {number[]} nums
 * @returns {number}
 * @see https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.582.288&rep=rep1&type=pdf
 */
function sum(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }

  let t;
  let correction = 0;
  let output = nums[0];

  for (let i = 1, len = nums.length; i < len; i++) {
    t = output + nums[i];

    if (Math.abs(output) >= Math.abs(nums[i])) {
      correction += output - t + nums[i];
    } else {
      correction += nums[i] - t + output;
    }

    output = t;
  }

  return output + correction;
}

/**
 * Returns mean, also known as average, of numerical sequences.
 * @param nums
 * @returns
 */
export function mean(nums: number[]): number {
  if (nums.length === 0) {
    return NaN;
  }

  return sum(nums) / nums.length;
}
