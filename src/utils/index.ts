export const format = (time: Date): string => {
  const splitStr = '-';
  return `${time.getFullYear()}${splitStr}${time.getMonth() +
    1}${splitStr}${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
};
