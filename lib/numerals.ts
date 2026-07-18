const EASTERN_ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Converts any Western digits (0-9) found in a string to Eastern Arabic numerals. */
export function toEasternArabicNumerals(input: string): string {
  return input.replace(/[0-9]/g, (digit) => EASTERN_ARABIC_DIGITS[Number(digit)]);
}
