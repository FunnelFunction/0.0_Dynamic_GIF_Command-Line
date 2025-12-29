/**
 * FRAME INTERPOLATOR
 *
 * Interpolates between keyframes to create smooth animation sequences.
 * Uses Bézier curves for natural motion easing.
 *
 * Mathematical Foundation:
 * - Cubic Bézier curves: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
 * - Temporal coherence for smooth transitions
 * - Parametric interpolation for all animatable properties
 *
 * @module rendering/frame-interpolator
 */

import BezierEasing from 'bezier-easing';

/**
 * Frame Interpolator
 *
 * Generates intermediate frames between keyframes using easing functions.
 */
export class FrameInterpolator {
  constructor() {
    // Predefined easing functions
    this.easings = {
      linear: BezierEasing(0, 0, 1, 1),
      ease: BezierEasing(0.25, 0.1, 0.25, 1),
      easeIn: BezierEasing(0.42, 0, 1, 1),
      easeOut: BezierEasing(0, 0, 0.58, 1),
      easeInOut: BezierEasing(0.42, 0, 0.58, 1),
      easeInQuad: BezierEasing(0.55, 0.085, 0.68, 0.53),
      easeOutQuad: BezierEasing(0.25, 0.46, 0.45, 0.94),
      easeInOutQuad: BezierEasing(0.455, 0.03, 0.515, 0.955),
      easeInCubic: BezierEasing(0.55, 0.055, 0.675, 0.19),
      easeOutCubic: BezierEasing(0.215, 0.61, 0.355, 1),
      easeInOutCubic: BezierEasing(0.645, 0.045, 0.355, 1),
      easeInQuart: BezierEasing(0.895, 0.03, 0.685, 0.22),
      easeOutQuart: BezierEasing(0.165, 0.84, 0.44, 1),
      easeInOutQuart: BezierEasing(0.77, 0, 0.175, 1),
    };
  }

  /**
   * Interpolate between keyframes
   *
   * @param {Array} keyframes - Array of keyframe objects
   * @param {number} totalFrames - Total number of frames to generate
   * @param {string} easing - Easing function name (default: 'ease')
   * @returns {Array} Interpolated frames
   */
  interpolate(keyframes, totalFrames, easing = 'ease') {
    if (keyframes.length === 0) {
      return [];
    }

    if (keyframes.length === 1) {
      // Single keyframe: repeat it for all frames
      return Array(totalFrames).fill(keyframes[0]);
    }

    const frames = [];
    const easingFn = this.easings[easing] || this.easings.ease;

    // Sort keyframes by frame number
    const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);

    // Generate frames
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      // Find surrounding keyframes
      const { prev, next } = this.findSurroundingKeyframes(sortedKeyframes, frameIndex);

      if (!prev || !next) {
        // Before first or after last keyframe
        frames.push(prev || next);
        continue;
      }

      if (prev === next) {
        // Exactly on a keyframe
        frames.push(prev);
        continue;
      }

      // Interpolate between prev and next
      const t = (frameIndex - prev.frame) / (next.frame - prev.frame);
      const easedT = easingFn(t);

      const interpolatedFrame = this.interpolateProperties(prev, next, easedT);
      frames.push(interpolatedFrame);
    }

    return frames;
  }

  /**
   * Find keyframes surrounding a given frame index
   *
   * @param {Array} keyframes - Sorted keyframes
   * @param {number} frameIndex - Frame index
   * @returns {Object} { prev, next }
   */
  findSurroundingKeyframes(keyframes, frameIndex) {
    let prev = null;
    let next = null;

    for (let i = 0; i < keyframes.length; i++) {
      const kf = keyframes[i];

      if (kf.frame === frameIndex) {
        // Exact match
        return { prev: kf, next: kf };
      }

      if (kf.frame < frameIndex) {
        prev = kf;
      }

      if (kf.frame > frameIndex && !next) {
        next = kf;
        break;
      }
    }

    // If no next, use last keyframe
    if (!next && keyframes.length > 0) {
      next = keyframes[keyframes.length - 1];
    }

    // If no prev, use first keyframe
    if (!prev && keyframes.length > 0) {
      prev = keyframes[0];
    }

    return { prev, next };
  }

  /**
   * Interpolate properties between two keyframes
   *
   * @param {Object} prev - Previous keyframe
   * @param {Object} next - Next keyframe
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Object} Interpolated frame
   */
  interpolateProperties(prev, next, t) {
    const frame = { ...prev };

    // Interpolate numeric properties
    const numericProps = [
      'opacity',
      'scale',
      'translateX',
      'translateY',
      'rotate',
      'blur',
      'brightness',
      'contrast',
      'saturation',
    ];

    for (const prop of numericProps) {
      if (prev[prop] !== undefined && next[prop] !== undefined) {
        frame[prop] = this.lerp(prev[prop], next[prop], t);
      } else if (next[prop] !== undefined) {
        frame[prop] = next[prop];
      }
    }

    // Interpolate colors
    if (prev.colors && next.colors) {
      frame.colors = this.interpolateColors(prev.colors, next.colors, t);
    }

    // Interpolate positions
    if (prev.x !== undefined && next.x !== undefined) {
      frame.x = this.lerp(prev.x, next.x, t);
    }

    if (prev.y !== undefined && next.y !== undefined) {
      frame.y = this.lerp(prev.y, next.y, t);
    }

    return frame;
  }

  /**
   * Linear interpolation
   *
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Interpolate colors
   *
   * @param {Object} colors1 - Start colors
   * @param {Object} colors2 - End colors
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Object} Interpolated colors
   */
  interpolateColors(colors1, colors2, t) {
    const interpolated = {};

    for (const key in colors1) {
      if (colors2[key]) {
        interpolated[key] = this.interpolateColor(colors1[key], colors2[key], t);
      } else {
        interpolated[key] = colors1[key];
      }
    }

    return interpolated;
  }

  /**
   * Interpolate a single color
   *
   * @param {string} color1 - Start color (hex)
   * @param {string} color2 - End color (hex)
   * @param {number} t - Interpolation factor (0-1)
   * @returns {string} Interpolated color (hex)
   */
  interpolateColor(color1, color2, t) {
    const c1 = this.hexToRGB(color1);
    const c2 = this.hexToRGB(color2);

    const r = Math.round(this.lerp(c1.r, c2.r, t));
    const g = Math.round(this.lerp(c1.g, c2.g, t));
    const b = Math.round(this.lerp(c1.b, c2.b, t));

    return this.rgbToHex(r, g, b);
  }

  /**
   * Convert hex color to RGB
   *
   * @param {string} hex - Hex color
   * @returns {Object} { r, g, b }
   */
  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Convert RGB to hex color
   *
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {string} Hex color
   */
  rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Create custom easing function from cubic Bézier control points
   *
   * @param {number} x1 - First control point X
   * @param {number} y1 - First control point Y
   * @param {number} x2 - Second control point X
   * @param {number} y2 - Second control point Y
   * @returns {Function} Easing function
   */
  createEasing(x1, y1, x2, y2) {
    return BezierEasing(x1, y1, x2, y2);
  }

  /**
   * Add custom easing function
   *
   * @param {string} name - Easing name
   * @param {Function} easingFn - Easing function
   */
  addEasing(name, easingFn) {
    this.easings[name] = easingFn;
  }

  /**
   * Get available easing functions
   *
   * @returns {Array} Easing names
   */
  getEasings() {
    return Object.keys(this.easings);
  }
}

export default FrameInterpolator;
