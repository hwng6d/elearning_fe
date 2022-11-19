export function setDelay(delay) {
  return new Promise(res => setTimeout(res, delay));
}