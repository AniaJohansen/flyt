const COLOR_PALETTE = [
  '#4A90E2', // blue
  '#E2844A', // orange
  '#7B4AE2', // purple
  '#4AE2A0', // green
  '#E24A6B', // red
  '#E2CF4A', // yellow
  '#4AE2E2', // cyan
  '#E24AD8', // pink
  '#8BC34A', // lime
  '#FF7043', // deep orange
  '#42A5F5', // light blue
  '#AB47BC', // deep purple
  '#26A69A', // teal
  '#EF5350', // red accent
  '#FFCA28', // amber
  '#78909C', // blue-grey
];

export function getNextColor(usedColors: string[]): string {
  const available = COLOR_PALETTE.filter((c) => !usedColors.includes(c));
  if (available.length > 0) {
    return available[0];
  }
  return COLOR_PALETTE[usedColors.length % COLOR_PALETTE.length];
}

export { COLOR_PALETTE };
