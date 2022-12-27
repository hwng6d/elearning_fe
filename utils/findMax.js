export function findMax(numberArray) {
  numberArray?.push(0);
  let max = -1;
  for (let i = 0; i < numberArray?.length; i++) {
    if (numberArray[i] >= max) max = numberArray[i];
  }

  return max;
}