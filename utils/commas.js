export function checkCommas(string) {
  const index = string.lastIndexOf(', ');
  string = string.substring(0, index) + '';
  return string;
}