/**
 * INTERPOLATION UTILITIES
 *
 * Implements smooth interpolation and easing functions for animations
 * and visual transitions.
 *
 * Easing Functions:
 * - Linear
 * - Quadratic (ease-in, ease-out, ease-in-out)
 * - Cubic, Quartic, Quintic
 * - Sinusoidal
 * - Exponential
 * - Circular
 * - Elastic
 * - Back
 * - Bounce
 *
 * Reference: https://easings.net/
 *
 * @module utils/interpolation
 */

import BezierEasing from 'bezier-easing';

/**
 * Easing function types
 */
export const EasingType = {
  LINEAR: 'linear',
  EASE_IN_QUAD: 'easeInQuad',
  EASE_OUT_QUAD: 'easeOutQuad',
  EASE_IN_OUT_QUAD: 'easeInOutQuad',
  EASE_IN_CUBIC: 'easeInCubic',
  EASE_OUT_CUBIC: 'easeOutCubic',
  EASE_IN_OUT_CUBIC: 'easeInOutCubic',
  EASE_IN_QUART: 'easeInQuart',
  EASE_OUT_QUART: 'easeOutQuart',
  EASE_IN_OUT_QUART: 'easeInOutQuart',
  EASE_IN_QUINT: 'easeInQuint',
  EASE_OUT_QUINT: 'easeOutQuint',
  EASE_IN_OUT_QUINT: 'easeInOutQuint',
  EASE_IN_SINE: 'easeInSine',
  EASE_OUT_SINE: 'easeOutSine',
  EASE_IN_OUT_SINE: 'easeInOutSine',
  EASE_IN_EXPO: 'easeInExpo',
  EASE_OUT_EXPO: 'easeOutExpo',
  EASE_IN_OUT_EXPO: 'easeInOutExpo',
  EASE_IN_CIRC: 'easeInCirc',
  EASE_OUT_CIRC: 'easeOutCirc',
  EASE_IN_OUT_CIRC: 'easeInOutCirc',
  EASE_IN_ELASTIC: 'easeInElastic',
  EASE_OUT_ELASTIC: 'easeOutElastic',
  EASE_IN_OUT_ELASTIC: 'easeInOutElastic',
  EASE_IN_BACK: 'easeInBack',
  EASE_OUT_BACK: 'easeOutBack',
  EASE_IN_OUT_BACK: 'easeInOutBack',
  EASE_IN_BOUNCE: 'easeInBounce',
  EASE_OUT_BOUNCE: 'easeOutBounce',
  EASE_IN_OUT_BOUNCE: 'easeInOutBounce',
};

/**
 * Linear interpolation
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function linear(t) {
  return t;
}

/**
 * Quadratic ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInQuad(t) {
  return t * t;
}

/**
 * Quadratic ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutQuad(t) {
  return t * (2 - t);
}

/**
 * Quadratic ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Cubic ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInCubic(t) {
  return t * t * t;
}

/**
 * Cubic ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

/**
 * Cubic ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Quartic ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInQuart(t) {
  return t * t * t * t;
}

/**
 * Quartic ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutQuart(t) {
  return 1 - (--t) * t * t * t;
}

/**
 * Quartic ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

/**
 * Quintic ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInQuint(t) {
  return t * t * t * t * t;
}

/**
 * Quintic ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutQuint(t) {
  return 1 + (--t) * t * t * t * t;
}

/**
 * Quintic ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
}

/**
 * Sinusoidal ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInSine(t) {
  return 1 - Math.cos(t * Math.PI / 2);
}

/**
 * Sinusoidal ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutSine(t) {
  return Math.sin(t * Math.PI / 2);
}

/**
 * Sinusoidal ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * Exponential ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInExpo(t) {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

/**
 * Exponential ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Exponential ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutExpo(t) {
  if (t === 0 || t === 1) return t;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

/**
 * Circular ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInCirc(t) {
  return 1 - Math.sqrt(1 - t * t);
}

/**
 * Circular ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutCirc(t) {
  return Math.sqrt(1 - (--t) * t);
}

/**
 * Circular ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutCirc(t) {
  return t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
}

/**
 * Elastic ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInElastic(t) {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
}

/**
 * Elastic ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Elastic ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutElastic(t) {
  if (t === 0 || t === 1) return t;
  const c5 = (2 * Math.PI) / 4.5;
  return t < 0.5
    ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
}

/**
 * Back ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
}

/**
 * Back ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Back ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutBack(t) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}

/**
 * Bounce ease-out helper
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
function bounceOut(t) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

/**
 * Bounce ease-in
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInBounce(t) {
  return 1 - bounceOut(1 - t);
}

/**
 * Bounce ease-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeOutBounce(t) {
  return bounceOut(t);
}

/**
 * Bounce ease-in-out
 *
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased progress
 */
export function easeInOutBounce(t) {
  return t < 0.5
    ? (1 - bounceOut(1 - 2 * t)) / 2
    : (1 + bounceOut(2 * t - 1)) / 2;
}

/**
 * Get easing function by name
 *
 * @param {string} name - Easing function name
 * @returns {Function} Easing function
 */
export function getEasingFunction(name) {
  const easingFunctions = {
    [EasingType.LINEAR]: linear,
    [EasingType.EASE_IN_QUAD]: easeInQuad,
    [EasingType.EASE_OUT_QUAD]: easeOutQuad,
    [EasingType.EASE_IN_OUT_QUAD]: easeInOutQuad,
    [EasingType.EASE_IN_CUBIC]: easeInCubic,
    [EasingType.EASE_OUT_CUBIC]: easeOutCubic,
    [EasingType.EASE_IN_OUT_CUBIC]: easeInOutCubic,
    [EasingType.EASE_IN_QUART]: easeInQuart,
    [EasingType.EASE_OUT_QUART]: easeOutQuart,
    [EasingType.EASE_IN_OUT_QUART]: easeInOutQuart,
    [EasingType.EASE_IN_QUINT]: easeInQuint,
    [EasingType.EASE_OUT_QUINT]: easeOutQuint,
    [EasingType.EASE_IN_OUT_QUINT]: easeInOutQuint,
    [EasingType.EASE_IN_SINE]: easeInSine,
    [EasingType.EASE_OUT_SINE]: easeOutSine,
    [EasingType.EASE_IN_OUT_SINE]: easeInOutSine,
    [EasingType.EASE_IN_EXPO]: easeInExpo,
    [EasingType.EASE_OUT_EXPO]: easeOutExpo,
    [EasingType.EASE_IN_OUT_EXPO]: easeInOutExpo,
    [EasingType.EASE_IN_CIRC]: easeInCirc,
    [EasingType.EASE_OUT_CIRC]: easeOutCirc,
    [EasingType.EASE_IN_OUT_CIRC]: easeInOutCirc,
    [EasingType.EASE_IN_ELASTIC]: easeInElastic,
    [EasingType.EASE_OUT_ELASTIC]: easeOutElastic,
    [EasingType.EASE_IN_OUT_ELASTIC]: easeInOutElastic,
    [EasingType.EASE_IN_BACK]: easeInBack,
    [EasingType.EASE_OUT_BACK]: easeOutBack,
    [EasingType.EASE_IN_OUT_BACK]: easeInOutBack,
    [EasingType.EASE_IN_BOUNCE]: easeInBounce,
    [EasingType.EASE_OUT_BOUNCE]: easeOutBounce,
    [EasingType.EASE_IN_OUT_BOUNCE]: easeInOutBounce,
  };

  return easingFunctions[name] || linear;
}

/**
 * Interpolate number with easing
 *
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress (0-1)
 * @param {string|Function} easing - Easing function or name
 * @returns {number} Interpolated value
 */
export function interpolateNumber(start, end, progress, easing = 'linear') {
  const easingFn = typeof easing === 'function' ? easing : getEasingFunction(easing);
  const t = easingFn(progress);
  return start + (end - start) * t;
}

/**
 * Interpolate array of numbers
 *
 * @param {Array} start - Start values
 * @param {Array} end - End values
 * @param {number} progress - Progress (0-1)
 * @param {string|Function} easing - Easing function or name
 * @returns {Array} Interpolated values
 */
export function interpolateArray(start, end, progress, easing = 'linear') {
  const easingFn = typeof easing === 'function' ? easing : getEasingFunction(easing);
  const t = easingFn(progress);

  return start.map((startVal, i) => {
    const endVal = end[i] !== undefined ? end[i] : startVal;
    return startVal + (endVal - startVal) * t;
  });
}

/**
 * Create custom cubic bezier easing
 *
 * @param {number} x1 - First control point x
 * @param {number} y1 - First control point y
 * @param {number} x2 - Second control point x
 * @param {number} y2 - Second control point y
 * @returns {Function} Easing function
 */
export function createCubicBezierEasing(x1, y1, x2, y2) {
  return BezierEasing(x1, y1, x2, y2);
}

/**
 * CSS easing presets
 */
export const CSSEasing = {
  ease: createCubicBezierEasing(0.25, 0.1, 0.25, 1.0),
  easeIn: createCubicBezierEasing(0.42, 0.0, 1.0, 1.0),
  easeOut: createCubicBezierEasing(0.0, 0.0, 0.58, 1.0),
  easeInOut: createCubicBezierEasing(0.42, 0.0, 0.58, 1.0),
};

/**
 * Smooth step interpolation
 *
 * @param {number} edge0 - Lower edge
 * @param {number} edge1 - Upper edge
 * @param {number} x - Input value
 * @returns {number} Smoothed value (0-1)
 */
export function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Smoother step interpolation (improved smoothstep)
 *
 * @param {number} edge0 - Lower edge
 * @param {number} edge1 - Upper edge
 * @param {number} x - Input value
 * @returns {number} Smoothed value (0-1)
 */
export function smootherstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Clamp value between min and max
 *
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 *
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, inMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export default {
  EasingType,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  getEasingFunction,
  interpolateNumber,
  interpolateArray,
  createCubicBezierEasing,
  CSSEasing,
  smoothstep,
  smootherstep,
  clamp,
  mapRange,
};
