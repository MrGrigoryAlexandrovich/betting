exports.parseToTwoDecimals = (input) => {
  const parsed = typeof input === "string" ? parseFloat(input) : input;
  if (isNaN(parsed)) {
    return 0;
  }

  const truncated = Math.trunc(parsed * 100) / 100;
  return Number(truncated.toFixed(2));
};
