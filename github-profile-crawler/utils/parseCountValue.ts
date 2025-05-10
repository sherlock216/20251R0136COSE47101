export const parseCountValue = (valueText: string) => {
  valueText = valueText.trim();

  if (valueText.endsWith('k') || valueText.endsWith('K')) {
    return parseFloat(valueText.replace(/[kK]$/, '')) * 1000;
  } else if (valueText.endsWith('m') || valueText.endsWith('M')) {
    return parseFloat(valueText.replace(/[mM]$/, '')) * 1000000;
  } else {
    return parseInt(valueText.replace(/,/g, ''));
  }
};
