const calculateAverage = (numberArray) => {
  let sum = 0;
  numberArray?.forEach(number => sum += number);
  let average = (sum / numberArray?.length).toFixed(1);
  
  return average;
}

export {
  calculateAverage
}