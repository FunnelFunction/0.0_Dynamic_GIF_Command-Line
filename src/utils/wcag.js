/**
 * WCAG ACCESSIBILITY UTILITIES
 *
 * Implements Web Content Accessibility Guidelines (WCAG) 2.1
 * for color contrast and text readability.
 *
 * Standards:
 * - WCAG AA: 4.5:1 for normal text, 3:1 for large text
 * - WCAG AAA: 7:1 for normal text, 4.5:1 for large text
 *
 * Reference: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 *
 * @module utils/wcag
 */

import chroma from 'chroma-js';

/**
 * WCAG Levels
 */
export const WCAGLevel = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA',
};

/**
 * WCAG Contrast Ratios
 */
export const ContrastRatio = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
};

/**
 * Text Size Thresholds
 */
export const TextSize = {
  NORMAL_THRESHOLD: 18, // px
  LARGE_BOLD_THRESHOLD: 14, // px (if bold)
};

/**
 * Calculate contrast ratio between two colors
 *
 * Uses WCAG 2.1 formula:
 * ratio = (L1 + 0.05) / (L2 + 0.05)
 * where L1 is luminance of lighter color, L2 is luminance of darker color
 *
 * @param {string} color1 - First color (hex, rgb, etc.)
 * @param {string} color2 - Second color
 * @returns {number} Contrast ratio (1:1 to 21:1)
 */
export function calculateContrastRatio(color1, color2) {
  try {
    const c1 = chroma(color1);
    const c2 = chroma(color2);

    return chroma.contrast(c1, c2);
  } catch (e) {
    return 1.0; // Invalid colors = minimum contrast
  }
}

/**
 * Calculate relative luminance of a color
 *
 * Uses WCAG formula:
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are linearized color components
 *
 * @param {string} color - Color (hex, rgb, etc.)
 * @returns {number} Relative luminance (0 to 1)
 */
export function calculateLuminance(color) {
  try {
    const c = chroma(color);
    return c.luminance();
  } catch (e) {
    return 0; // Invalid color
  }
}

/**
 * Check if contrast ratio meets WCAG level
 *
 * @param {number} ratio - Contrast ratio
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @param {boolean} isLargeText - Is text large (≥18px or ≥14px bold)
 * @returns {boolean} True if meets standard
 */
export function meetsWCAG(ratio, level = WCAGLevel.AA, isLargeText = false) {
  const threshold = getContrastThreshold(level, isLargeText);
  return ratio >= threshold;
}

/**
 * Get contrast threshold for WCAG level
 *
 * @param {string} level - WCAG level
 * @param {boolean} isLargeText - Is text large
 * @returns {number} Threshold ratio
 */
export function getContrastThreshold(level, isLargeText = false) {
  if (level === WCAGLevel.AAA) {
    return isLargeText ? ContrastRatio.AAA_LARGE : ContrastRatio.AAA_NORMAL;
  } else {
    // AA or A
    return isLargeText ? ContrastRatio.AA_LARGE : ContrastRatio.AA_NORMAL;
  }
}

/**
 * Check if text size qualifies as "large"
 *
 * WCAG defines large text as:
 * - 18pt (24px) or larger
 * - 14pt (18.66px) or larger if bold
 *
 * @param {number} fontSize - Font size in px
 * @param {number} fontWeight - Font weight (100-900)
 * @returns {boolean} True if large text
 */
export function isLargeText(fontSize, fontWeight = 400) {
  if (fontSize >= 24) return true;
  if (fontSize >= 18.66 && fontWeight >= 700) return true;
  return false;
}

/**
 * Get WCAG level for contrast ratio
 *
 * Returns the highest WCAG level achieved.
 *
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Is text large
 * @returns {string|null} WCAG level ('AAA', 'AA', 'A', or null)
 */
export function getWCAGLevel(ratio, isLargeText = false) {
  if (meetsWCAG(ratio, WCAGLevel.AAA, isLargeText)) {
    return WCAGLevel.AAA;
  } else if (meetsWCAG(ratio, WCAGLevel.AA, isLargeText)) {
    return WCAGLevel.AA;
  } else if (ratio >= 3.0) {
    return WCAGLevel.A;
  } else {
    return null;
  }
}

/**
 * Check text/background contrast compliance
 *
 * Returns detailed compliance information.
 *
 * @param {string} textColor - Text color
 * @param {string} backgroundColor - Background color
 * @param {number} fontSize - Font size in px
 * @param {number} fontWeight - Font weight
 * @returns {Object} Compliance report
 */
export function checkTextContrast(textColor, backgroundColor, fontSize = 16, fontWeight = 400) {
  const ratio = calculateContrastRatio(textColor, backgroundColor);
  const large = isLargeText(fontSize, fontWeight);
  const level = getWCAGLevel(ratio, large);

  return {
    ratio: Math.round(ratio * 100) / 100,
    textColor,
    backgroundColor,
    fontSize,
    fontWeight,
    isLargeText: large,
    level,
    meetsAA: meetsWCAG(ratio, WCAGLevel.AA, large),
    meetsAAA: meetsWCAG(ratio, WCAGLevel.AAA, large),
    thresholdAA: getContrastThreshold(WCAGLevel.AA, large),
    thresholdAAA: getContrastThreshold(WCAGLevel.AAA, large),
  };
}

/**
 * Suggest accessible text color
 *
 * Given a background color, suggests a text color that meets WCAG standards.
 *
 * @param {string} backgroundColor - Background color
 * @param {string} level - Target WCAG level ('AA' or 'AAA')
 * @param {boolean} isLargeText - Is text large
 * @param {string} preferredHue - Preferred hue for text color (optional)
 * @returns {Object} Suggestion with text color and ratio
 */
export function suggestTextColor(backgroundColor, level = WCAGLevel.AA, isLargeText = false, preferredHue = null) {
  const bgLuminance = calculateLuminance(backgroundColor);
  const threshold = getContrastThreshold(level, isLargeText);

  // Determine if we should use dark or light text
  const useDarkText = bgLuminance > 0.5;

  let textColor;
  if (preferredHue !== null) {
    // Start with preferred hue and adjust luminance
    textColor = adjustColorForContrast(
      chroma(preferredHue),
      backgroundColor,
      threshold,
      useDarkText
    );
  } else {
    // Use black or white
    textColor = useDarkText ? '#000000' : '#ffffff';
  }

  const ratio = calculateContrastRatio(textColor, backgroundColor);

  return {
    textColor,
    backgroundColor,
    ratio: Math.round(ratio * 100) / 100,
    level: getWCAGLevel(ratio, isLargeText),
    meetsTarget: ratio >= threshold,
  };
}

/**
 * Suggest accessible background color
 *
 * Given a text color, suggests a background color that meets WCAG standards.
 *
 * @param {string} textColor - Text color
 * @param {string} level - Target WCAG level ('AA' or 'AAA')
 * @param {boolean} isLargeText - Is text large
 * @param {string} preferredHue - Preferred hue for background (optional)
 * @returns {Object} Suggestion with background color and ratio
 */
export function suggestBackgroundColor(textColor, level = WCAGLevel.AA, isLargeText = false, preferredHue = null) {
  const textLuminance = calculateLuminance(textColor);
  const threshold = getContrastThreshold(level, isLargeText);

  // Determine if we should use dark or light background
  const useDarkBg = textLuminance > 0.5;

  let backgroundColor;
  if (preferredHue !== null) {
    // Start with preferred hue and adjust luminance
    backgroundColor = adjustColorForContrast(
      chroma(preferredHue),
      textColor,
      threshold,
      useDarkBg
    );
  } else {
    // Use black or white
    backgroundColor = useDarkBg ? '#000000' : '#ffffff';
  }

  const ratio = calculateContrastRatio(textColor, backgroundColor);

  return {
    textColor,
    backgroundColor,
    ratio: Math.round(ratio * 100) / 100,
    level: getWCAGLevel(ratio, isLargeText),
    meetsTarget: ratio >= threshold,
  };
}

/**
 * Adjust color luminance to meet contrast threshold
 *
 * @param {Object} color - Chroma color object
 * @param {string} referenceColor - Color to contrast against
 * @param {number} threshold - Target contrast ratio
 * @param {boolean} darken - True to darken, false to lighten
 * @returns {string} Adjusted color (hex)
 */
function adjustColorForContrast(color, referenceColor, threshold, darken = true) {
  let adjustedColor = color;
  let ratio = calculateContrastRatio(adjustedColor.hex(), referenceColor);
  let luminance = adjustedColor.luminance();

  // Binary search for optimal luminance
  let low = darken ? 0 : luminance;
  let high = darken ? luminance : 1;
  let iterations = 0;
  const maxIterations = 20;

  while (ratio < threshold && iterations < maxIterations) {
    luminance = (low + high) / 2;
    adjustedColor = adjustedColor.luminance(luminance);
    ratio = calculateContrastRatio(adjustedColor.hex(), referenceColor);

    if (ratio < threshold) {
      if (darken) {
        high = luminance;
      } else {
        low = luminance;
      }
    } else {
      if (darken) {
        low = luminance;
      } else {
        high = luminance;
      }
    }

    iterations++;
  }

  return adjustedColor.hex();
}

/**
 * Batch check multiple color pairs
 *
 * @param {Array} pairs - Array of {text, background, fontSize, fontWeight} objects
 * @param {string} level - Target WCAG level
 * @returns {Array} Array of compliance reports
 */
export function batchCheckContrast(pairs, level = WCAGLevel.AA) {
  return pairs.map(pair => {
    const report = checkTextContrast(
      pair.text,
      pair.background,
      pair.fontSize || 16,
      pair.fontWeight || 400
    );
    return {
      ...report,
      meetsTarget: level === WCAGLevel.AAA ? report.meetsAAA : report.meetsAA,
    };
  });
}

/**
 * Generate accessible color palette
 *
 * Creates a palette of colors that all meet WCAG standards
 * when used as text on the given background.
 *
 * @param {string} backgroundColor - Background color
 * @param {number} count - Number of colors to generate
 * @param {string} level - Target WCAG level
 * @returns {Array} Array of accessible colors
 */
export function generateAccessiblePalette(backgroundColor, count = 5, level = WCAGLevel.AA) {
  const palette = [];
  const bgLuminance = calculateLuminance(backgroundColor);
  const threshold = getContrastThreshold(level, false);

  // Generate colors across hue spectrum
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    const baseColor = chroma.hsl(hue, 0.7, 0.5);

    // Adjust luminance to meet contrast
    const adjustedColor = adjustColorForContrast(
      baseColor,
      backgroundColor,
      threshold,
      bgLuminance > 0.5
    );

    palette.push(adjustedColor);
  }

  return palette;
}

/**
 * Find nearest accessible color
 *
 * Given a color, finds the nearest color that meets WCAG standards
 * against the reference color.
 *
 * @param {string} color - Target color
 * @param {string} referenceColor - Color to contrast against
 * @param {string} level - Target WCAG level
 * @param {boolean} isLargeText - Is text large
 * @returns {Object} Nearest accessible color
 */
export function findNearestAccessibleColor(color, referenceColor, level = WCAGLevel.AA, isLargeText = false) {
  const c = chroma(color);
  const threshold = getContrastThreshold(level, isLargeText);
  const refLuminance = calculateLuminance(referenceColor);

  // Adjust luminance while preserving hue and saturation
  const [h, s, l] = c.hsl();
  const darken = refLuminance > 0.5;

  const adjustedColor = adjustColorForContrast(
    c,
    referenceColor,
    threshold,
    darken
  );

  const ratio = calculateContrastRatio(adjustedColor, referenceColor);

  return {
    original: color,
    adjusted: adjustedColor,
    reference: referenceColor,
    ratio: Math.round(ratio * 100) / 100,
    level: getWCAGLevel(ratio, isLargeText),
    meetsTarget: ratio >= threshold,
    colorDistance: chroma.deltaE(color, adjustedColor),
  };
}

/**
 * Calculate WCAG score
 *
 * Returns a numerical score (0-100) representing accessibility.
 *
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Is text large
 * @returns {number} Score (0-100)
 */
export function calculateWCAGScore(ratio, isLargeText = false) {
  const maxRatio = 21.0;
  const threshold = getContrastThreshold(WCAGLevel.AAA, isLargeText);

  if (ratio >= threshold) {
    return 100; // Perfect score
  }

  // Linear interpolation between 0 and threshold
  return Math.round((ratio / threshold) * 100);
}

export default {
  WCAGLevel,
  ContrastRatio,
  TextSize,
  calculateContrastRatio,
  calculateLuminance,
  meetsWCAG,
  getContrastThreshold,
  isLargeText,
  getWCAGLevel,
  checkTextContrast,
  suggestTextColor,
  suggestBackgroundColor,
  batchCheckContrast,
  generateAccessiblePalette,
  findNearestAccessibleColor,
  calculateWCAGScore,
};
