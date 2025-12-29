/**
 * COLOR MATHEMATICS UTILITIES
 *
 * Implements color space conversions, color distance metrics,
 * and perceptual color operations.
 *
 * Color Spaces:
 * - RGB: Device color space
 * - HSL: Hue, Saturation, Lightness
 * - CIELAB: Perceptually uniform color space
 * - LCH: Cylindrical CIELAB (Lightness, Chroma, Hue)
 *
 * Distance Metrics:
 * - Euclidean: Simple RGB distance
 * - CIELAB ΔE: Perceptual color difference
 * - CIEDE2000: Improved perceptual difference
 *
 * @module utils/color-math
 */

import chroma from 'chroma-js';

/**
 * Color space definitions
 */
export const ColorSpace = {
  RGB: 'rgb',
  HSL: 'hsl',
  LAB: 'lab',
  LCH: 'lch',
  HEX: 'hex',
};

/**
 * Convert color to different color space
 *
 * @param {string} color - Input color
 * @param {string} space - Target color space
 * @returns {Array|string} Color in target space
 */
export function convertColorSpace(color, space) {
  try {
    const c = chroma(color);

    switch (space) {
      case ColorSpace.RGB:
        return c.rgb();
      case ColorSpace.HSL:
        return c.hsl();
      case ColorSpace.LAB:
        return c.lab();
      case ColorSpace.LCH:
        return c.lch();
      case ColorSpace.HEX:
        return c.hex();
      default:
        return c.hex();
    }
  } catch (e) {
    return space === ColorSpace.HEX ? '#000000' : [0, 0, 0];
  }
}

/**
 * Calculate Euclidean distance in RGB space
 *
 * Simple but not perceptually uniform.
 *
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {number} Distance
 */
export function rgbDistance(color1, color2) {
  try {
    const [r1, g1, b1] = chroma(color1).rgb();
    const [r2, g2, b2] = chroma(color2).rgb();

    return Math.sqrt(
      Math.pow(r2 - r1, 2) +
      Math.pow(g2 - g1, 2) +
      Math.pow(b2 - b1, 2)
    );
  } catch (e) {
    return 0;
  }
}

/**
 * Calculate CIELAB ΔE distance
 *
 * Perceptually uniform color difference.
 * ΔE < 1: Not perceptible
 * ΔE 1-2: Barely perceptible
 * ΔE 2-10: Perceptible
 * ΔE > 10: Very different
 *
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {number} ΔE distance
 */
export function labDistance(color1, color2) {
  try {
    return chroma.deltaE(color1, color2);
  } catch (e) {
    return 0;
  }
}

/**
 * Calculate CIEDE2000 distance
 *
 * Improved perceptual color difference metric.
 *
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {number} CIEDE2000 distance
 */
export function ciede2000Distance(color1, color2) {
  try {
    // chroma.js uses deltaE which is CIEDE2000 by default
    return chroma.deltaE(color1, color2, 'de2000');
  } catch (e) {
    return 0;
  }
}

/**
 * Interpolate between two colors
 *
 * @param {string} color1 - Start color
 * @param {string} color2 - End color
 * @param {number} t - Interpolation parameter (0-1)
 * @param {string} space - Color space for interpolation ('rgb', 'lab', 'lch')
 * @returns {string} Interpolated color (hex)
 */
export function interpolateColor(color1, color2, t, space = 'lab') {
  try {
    const c1 = chroma(color1);
    const c2 = chroma(color2);

    return chroma.mix(c1, c2, t, space).hex();
  } catch (e) {
    return '#000000';
  }
}

/**
 * Create color scale
 *
 * Generates a scale of colors between two endpoints.
 *
 * @param {string} color1 - Start color
 * @param {string} color2 - End color
 * @param {number} steps - Number of intermediate steps
 * @param {string} space - Color space for interpolation
 * @returns {Array} Array of colors (hex)
 */
export function createColorScale(color1, color2, steps = 5, space = 'lab') {
  try {
    const scale = chroma.scale([color1, color2]).mode(space).colors(steps);
    return scale;
  } catch (e) {
    return [color1, color2];
  }
}

/**
 * Lighten color
 *
 * @param {string} color - Input color
 * @param {number} amount - Amount to lighten (0-1)
 * @returns {string} Lightened color (hex)
 */
export function lightenColor(color, amount = 0.2) {
  try {
    return chroma(color).brighten(amount * 3).hex();
  } catch (e) {
    return color;
  }
}

/**
 * Darken color
 *
 * @param {string} color - Input color
 * @param {number} amount - Amount to darken (0-1)
 * @returns {string} Darkened color (hex)
 */
export function darkenColor(color, amount = 0.2) {
  try {
    return chroma(color).darken(amount * 3).hex();
  } catch (e) {
    return color;
  }
}

/**
 * Saturate color
 *
 * @param {string} color - Input color
 * @param {number} amount - Amount to saturate (0-1)
 * @returns {string} Saturated color (hex)
 */
export function saturateColor(color, amount = 0.2) {
  try {
    return chroma(color).saturate(amount * 3).hex();
  } catch (e) {
    return color;
  }
}

/**
 * Desaturate color
 *
 * @param {string} color - Input color
 * @param {number} amount - Amount to desaturate (0-1)
 * @returns {string} Desaturated color (hex)
 */
export function desaturateColor(color, amount = 0.2) {
  try {
    return chroma(color).desaturate(amount * 3).hex();
  } catch (e) {
    return color;
  }
}

/**
 * Adjust color hue
 *
 * @param {string} color - Input color
 * @param {number} degrees - Degrees to rotate hue (-360 to 360)
 * @returns {string} Color with adjusted hue (hex)
 */
export function adjustHue(color, degrees) {
  try {
    const [h, s, l] = chroma(color).hsl();
    return chroma.hsl((h + degrees) % 360, s, l).hex();
  } catch (e) {
    return color;
  }
}

/**
 * Get complementary color
 *
 * @param {string} color - Input color
 * @returns {string} Complementary color (hex)
 */
export function getComplementaryColor(color) {
  return adjustHue(color, 180);
}

/**
 * Get triadic colors
 *
 * @param {string} color - Input color
 * @returns {Array} Array of 3 colors (including input)
 */
export function getTriadicColors(color) {
  return [
    color,
    adjustHue(color, 120),
    adjustHue(color, 240),
  ];
}

/**
 * Get analogous colors
 *
 * @param {string} color - Input color
 * @param {number} angle - Angle between colors (default: 30°)
 * @returns {Array} Array of 3 colors
 */
export function getAnalogousColors(color, angle = 30) {
  return [
    adjustHue(color, -angle),
    color,
    adjustHue(color, angle),
  ];
}

/**
 * Get split-complementary colors
 *
 * @param {string} color - Input color
 * @returns {Array} Array of 3 colors
 */
export function getSplitComplementaryColors(color) {
  return [
    color,
    adjustHue(color, 150),
    adjustHue(color, 210),
  ];
}

/**
 * Get tetradic colors (rectangle)
 *
 * @param {string} color - Input color
 * @returns {Array} Array of 4 colors
 */
export function getTetradicColors(color) {
  return [
    color,
    adjustHue(color, 90),
    adjustHue(color, 180),
    adjustHue(color, 270),
  ];
}

/**
 * Check if color is dark
 *
 * @param {string} color - Input color
 * @param {number} threshold - Luminance threshold (0-1, default: 0.5)
 * @returns {boolean} True if dark
 */
export function isDarkColor(color, threshold = 0.5) {
  try {
    return chroma(color).luminance() < threshold;
  } catch (e) {
    return false;
  }
}

/**
 * Check if color is light
 *
 * @param {string} color - Input color
 * @param {number} threshold - Luminance threshold (0-1, default: 0.5)
 * @returns {boolean} True if light
 */
export function isLightColor(color, threshold = 0.5) {
  return !isDarkColor(color, threshold);
}

/**
 * Get color temperature
 *
 * Categorizes color as warm or cool.
 *
 * @param {string} color - Input color
 * @returns {string} 'warm' or 'cool'
 */
export function getColorTemperature(color) {
  try {
    const [h] = chroma(color).hsl();

    // Warm: red-yellow (0-60°, 300-360°)
    // Cool: green-blue (60-300°)
    if ((h >= 0 && h < 60) || (h >= 300 && h <= 360)) {
      return 'warm';
    } else {
      return 'cool';
    }
  } catch (e) {
    return 'neutral';
  }
}

/**
 * Find nearest color in palette
 *
 * Finds the closest color in a palette using CIELAB ΔE.
 *
 * @param {string} color - Target color
 * @param {Array} palette - Array of colors
 * @returns {Object} Nearest color and distance
 */
export function findNearestColor(color, palette) {
  let nearestColor = palette[0];
  let minDistance = Infinity;

  for (const paletteColor of palette) {
    const distance = labDistance(color, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      nearestColor = paletteColor;
    }
  }

  return {
    color: nearestColor,
    distance: minDistance,
    perceptible: minDistance > 1.0,
  };
}

/**
 * Generate harmonious palette
 *
 * Creates a color palette based on color theory.
 *
 * @param {string} baseColor - Base color
 * @param {string} scheme - Color scheme ('analogous', 'triadic', 'complementary', 'split-complementary', 'tetradic')
 * @returns {Array} Color palette
 */
export function generateHarmoniousPalette(baseColor, scheme = 'analogous') {
  switch (scheme) {
    case 'analogous':
      return getAnalogousColors(baseColor);
    case 'triadic':
      return getTriadicColors(baseColor);
    case 'complementary':
      return [baseColor, getComplementaryColor(baseColor)];
    case 'split-complementary':
      return getSplitComplementaryColors(baseColor);
    case 'tetradic':
      return getTetradicColors(baseColor);
    default:
      return [baseColor];
  }
}

/**
 * Blend colors
 *
 * Blends multiple colors together.
 *
 * @param {Array} colors - Array of colors to blend
 * @param {string} mode - Blend mode ('rgb', 'lab', 'lch')
 * @returns {string} Blended color (hex)
 */
export function blendColors(colors, mode = 'lab') {
  try {
    const chromaColors = colors.map(c => chroma(c));
    return chroma.average(chromaColors, mode).hex();
  } catch (e) {
    return colors[0] || '#000000';
  }
}

/**
 * Get color from gradient
 *
 * Samples a color from a gradient at a specific position.
 *
 * @param {Array} gradientColors - Array of gradient stop colors
 * @param {number} position - Position (0-1)
 * @param {string} space - Color space for interpolation
 * @returns {string} Sampled color (hex)
 */
export function getColorFromGradient(gradientColors, position, space = 'lab') {
  try {
    const scale = chroma.scale(gradientColors).mode(space);
    return scale(position).hex();
  } catch (e) {
    return gradientColors[0] || '#000000';
  }
}

/**
 * Normalize color
 *
 * Converts color to standard hex format.
 *
 * @param {string} color - Input color (any format)
 * @returns {string} Normalized color (hex)
 */
export function normalizeColor(color) {
  try {
    return chroma(color).hex();
  } catch (e) {
    return '#000000';
  }
}

/**
 * Validate color
 *
 * Checks if color string is valid.
 *
 * @param {string} color - Color string
 * @returns {boolean} True if valid
 */
export function isValidColor(color) {
  try {
    chroma(color);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get color components
 *
 * Extracts RGB, HSL, and LAB components.
 *
 * @param {string} color - Input color
 * @returns {Object} Color components
 */
export function getColorComponents(color) {
  try {
    const c = chroma(color);
    const [r, g, b] = c.rgb();
    const [h, s, l] = c.hsl();
    const [L, a, labB] = c.lab();
    const [lchL, chroma_c, lchH] = c.lch();

    return {
      hex: c.hex(),
      rgb: { r, g, b },
      hsl: { h: h || 0, s, l },
      lab: { L, a, b: labB },
      lch: { L: lchL, c: chroma_c, h: lchH || 0 },
      luminance: c.luminance(),
    };
  } catch (e) {
    return null;
  }
}

/**
 * Create color from components
 *
 * @param {Object} components - Color components
 * @param {string} space - Color space ('rgb', 'hsl', 'lab')
 * @returns {string} Color (hex)
 */
export function createColorFromComponents(components, space = 'rgb') {
  try {
    switch (space) {
      case 'rgb':
        return chroma.rgb(components.r, components.g, components.b).hex();
      case 'hsl':
        return chroma.hsl(components.h, components.s, components.l).hex();
      case 'lab':
        return chroma.lab(components.L, components.a, components.b).hex();
      default:
        return '#000000';
    }
  } catch (e) {
    return '#000000';
  }
}

/**
 * Clamp color to gamut
 *
 * Ensures color is within displayable RGB gamut.
 *
 * @param {string} color - Input color
 * @returns {string} Clamped color (hex)
 */
export function clampToGamut(color) {
  try {
    const c = chroma(color);
    return c.clipped() ? c.hex() : c.hex();
  } catch (e) {
    return '#000000';
  }
}

/**
 * Generate random color
 *
 * @param {Object} options - Options
 * @param {number} options.luminance - Target luminance (0-1)
 * @param {number} options.hue - Target hue (0-360)
 * @param {number} options.saturation - Target saturation (0-1)
 * @returns {string} Random color (hex)
 */
export function generateRandomColor(options = {}) {
  try {
    if (options.luminance !== undefined) {
      return chroma.random().luminance(options.luminance).hex();
    }

    if (options.hue !== undefined && options.saturation !== undefined) {
      const l = Math.random();
      return chroma.hsl(options.hue, options.saturation, l).hex();
    }

    return chroma.random().hex();
  } catch (e) {
    return '#000000';
  }
}

export default {
  ColorSpace,
  convertColorSpace,
  rgbDistance,
  labDistance,
  ciede2000Distance,
  interpolateColor,
  createColorScale,
  lightenColor,
  darkenColor,
  saturateColor,
  desaturateColor,
  adjustHue,
  getComplementaryColor,
  getTriadicColors,
  getAnalogousColors,
  getSplitComplementaryColors,
  getTetradicColors,
  isDarkColor,
  isLightColor,
  getColorTemperature,
  findNearestColor,
  generateHarmoniousPalette,
  blendColors,
  getColorFromGradient,
  normalizeColor,
  isValidColor,
  getColorComponents,
  createColorFromComponents,
  clampToGamut,
  generateRandomColor,
};
