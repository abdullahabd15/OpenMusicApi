function parseNumber(num) {
  if (num === undefined || num === null) return undefined;
  return parseInt(num, 10);
}

export default parseNumber;
