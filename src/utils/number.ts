export function parseNumber(str: any): number | null;
export function parseNumber<T>(str: any, defaultValue: T): number | T;
export function parseNumber(str: any, defaultValue: any = null) {
  if (typeof str === "number") return str;

  if (typeof str !== "string") return defaultValue;

  let result = parseFloat(str);

  if (Number.isNaN(result)) {
    return defaultValue;
  }
  return result;
}

export function formatNumber(
  num: number | null,
  opts?: {
    // Max number of decimal places (0 means output will be integer)
    // The default is 2
    mantissa?: number;

    // `always` -> always show exactly `mantissa` digits after decimal point, pad with zeros if needed
    // 'auto' -> show up to `mantissa` as needed.
    // The default is `auto`
    mantissaMode?: "always" | "auto";

    // Include commas as thousand separators in the integer part of the number
    // The default is true
    thousandSeparator?: boolean;

    pad?: number;
  }
): string {
  if (num == null) {
    return "";
  }

  // Set default values
  const mantissa = opts?.mantissa ?? 2;
  const mantissaMode = opts?.mantissaMode ?? "auto";
  const thousandSeparator = opts?.thousandSeparator ?? true;

  let formattedNumber: string;

  // Format the number based on the options
  if (mantissaMode === "always") {
    formattedNumber = num.toFixed(mantissa);
  } else {
    // "auto" mode
    // Truncate the number to the specified number of decimal places
    const factor = Math.pow(10, mantissa);
    let truncatedNumber = Math.trunc(num * factor) / factor;

    // Convert to string with fixed number of decimal places
    formattedNumber = truncatedNumber.toFixed(mantissa);

    // Remove trailing zeros
    if (mantissa > 0) {
      formattedNumber = formattedNumber.replace(/\.?0+$/, "");
    }
  }

  // Add thousand separators if needed
  if (thousandSeparator) {
    const parts = formattedNumber.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedNumber = parts.join(".");
  }

  if (opts?.pad) {
    const parts = formattedNumber.split(".");
    parts[0] = parts[0].padStart(opts.pad || 0, "0");
    formattedNumber = parts.join(".");
  }

  return formattedNumber;
}

(<any>window).formatNumber = formatNumber;

/**
 * Formats the amount (given in nano ERGs) into ERG string representation
 */
export function formatErg(nanoerg: number) {
  return formatNumber(nanoerg / 1e9, { mantissa: 8 }) + " ERG";
}
