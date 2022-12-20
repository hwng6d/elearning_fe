const secondsToHms = (seconds) => {
  seconds = Number(seconds);
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);

  const hDisplay = h > 0 ? h + ' giờ ' : '';
  const mDisplay = m > 0 ? m + ' phút ' : '';
  const sDisplay = s > 0 ? s + ' giây' : '';

  return hDisplay + mDisplay + sDisplay;
};

export {
  secondsToHms,
}