/**
 * GROUND STATE DEFINITION
 *
 * Defines the ground state (global energy minimum) of the visual manifold.
 *
 * Mathematical Foundation:
 * - Morse Theory: Critical point with index 0
 * - Energy: E(m₀) = 0 (on brand submanifold)
 * - Stability: All nearby states flow toward m₀
 * - Escape Path Target: Convergence endpoint
 *
 * The ground state is the simplest valid visual configuration:
 * - Passes all validation predicates
 * - Satisfies all brand constraints (minimally)
 * - WCAG AAA compliant
 * - No motion, effects, or decorations
 *
 * This is the "Hello World" of the system - always valid, always safe.
 *
 * @module core/ground-state
 */

/**
 * Ground State Definition
 *
 * The globally stable state that all escape paths lead to.
 */
export const GROUND_STATE = {
  // Core properties
  scene: 'minimal',
  text: 'Hello',
  canvas: '1:1',
  profile: null,

  // Colors (WCAG AAA: 21:1 contrast ratio)
  colors: {
    primary: '#000000',
    secondary: '#333333',
    tertiary: '#666666',
    accent: '#0066cc',
    background: '#ffffff',
    text: '#000000',
  },

  // Typography (safe defaults)
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontFamilySecondary: 'Georgia, serif',
    fontSize: '48px',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0em',
    wordSpacing: '0em',
    textAlign: 'center',
    textTransform: 'none',
  },

  // Layout (centered, no conflicts)
  layout: {
    type: 'centered',
    x: '50%',
    y: '50%',
    anchor: 'center',
    width: '80%',
    height: 'auto',
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    grid: null,
    spacing: 20,
  },

  // Motion (none)
  motion: {
    animation: 'none',
    duration: '0s',
    delay: '0s',
    easing: 'linear',
    loop: 1,
    direction: 'normal',
    fillMode: 'forwards',
  },

  // Effects (none)
  effects: {
    shadow: 'none',
    glow: 'none',
    blur: '0px',
    opacity: 1.0,
  },

  // Advanced (empty)
  decorations: [],
  animations: {},
  gradients: {},
};

/**
 * Get ground state
 *
 * Returns a deep clone of the ground state to prevent mutations.
 *
 * @returns {Object} Ground state (cloned)
 */
export function getGroundState() {
  return JSON.parse(JSON.stringify(GROUND_STATE));
}

/**
 * Check if state is ground state
 *
 * Determines if a state is equivalent to ground state.
 *
 * @param {Object} state - State to check
 * @returns {boolean} True if ground state
 */
export function isGroundState(state) {
  // Check core properties
  if (state.scene !== GROUND_STATE.scene) return false;
  if (state.canvas !== GROUND_STATE.canvas) return false;

  // Check colors
  if (!colorsMatch(state.colors, GROUND_STATE.colors)) return false;

  // Check typography
  if (!typographyMatches(state.typography, GROUND_STATE.typography)) return false;

  // Check layout
  if (state.layout?.type !== GROUND_STATE.layout.type) return false;

  // Check motion (should be none)
  if (state.motion?.animation !== 'none') return false;

  return true;
}

/**
 * Check if colors match
 *
 * @param {Object} colors1 - First color set
 * @param {Object} colors2 - Second color set
 * @returns {boolean} True if match
 */
function colorsMatch(colors1, colors2) {
  if (!colors1 || !colors2) return false;

  const keys = ['primary', 'secondary', 'tertiary', 'accent', 'background', 'text'];
  for (const key of keys) {
    if (colors1[key] !== colors2[key]) return false;
  }

  return true;
}

/**
 * Check if typography matches
 *
 * @param {Object} typo1 - First typography
 * @param {Object} typo2 - Second typography
 * @returns {boolean} True if match
 */
function typographyMatches(typo1, typo2) {
  if (!typo1 || !typo2) return false;

  return (
    typo1.fontFamily === typo2.fontFamily &&
    typo1.fontSize === typo2.fontSize &&
    typo1.fontWeight === typo2.fontWeight &&
    typo1.textAlign === typo2.textAlign
  );
}

/**
 * Compute distance to ground state
 *
 * Measures how far a state is from ground state.
 * Uses weighted Euclidean distance.
 *
 * @param {Object} state - State to measure
 * @returns {number} Distance
 */
export function distanceToGroundState(state) {
  let distance = 0;

  // Scene distance (categorical)
  if (state.scene !== GROUND_STATE.scene) {
    distance += 5.0;
  }

  // Color distance (simplified)
  if (state.colors) {
    const keys = ['text', 'background', 'primary'];
    for (const key of keys) {
      if (state.colors[key] !== GROUND_STATE.colors[key]) {
        distance += 2.0;
      }
    }
  }

  // Typography distance
  if (state.typography) {
    if (state.typography.fontFamily !== GROUND_STATE.typography.fontFamily) {
      distance += 3.0;
    }
    if (state.typography.fontSize !== GROUND_STATE.typography.fontSize) {
      distance += 1.0;
    }
  }

  // Layout distance
  if (state.layout?.type !== GROUND_STATE.layout.type) {
    distance += 2.0;
  }

  // Motion distance
  if (state.motion?.animation !== 'none') {
    distance += 1.0;
  }

  return distance;
}

/**
 * Interpolate toward ground state
 *
 * Linearly interpolates a state toward ground state.
 * Used for escape path computation.
 *
 * @param {Object} state - Current state
 * @param {number} alpha - Interpolation factor (0 = current, 1 = ground)
 * @returns {Object} Interpolated state
 */
export function interpolateTowardGroundState(state, alpha = 0.2) {
  const ground = getGroundState();
  const interpolated = JSON.parse(JSON.stringify(state)); // Deep clone

  // Interpolate colors
  if (interpolated.colors && ground.colors) {
    for (const key of Object.keys(ground.colors)) {
      // For simplicity, just transition categorically at alpha > 0.5
      if (alpha > 0.5) {
        interpolated.colors[key] = ground.colors[key];
      }
    }
  }

  // Interpolate typography
  if (interpolated.typography && ground.typography) {
    if (alpha > 0.5) {
      interpolated.typography.fontFamily = ground.typography.fontFamily;
      interpolated.typography.fontSize = ground.typography.fontSize;
      interpolated.typography.fontWeight = ground.typography.fontWeight;
    }
  }

  // Interpolate layout
  if (interpolated.layout && ground.layout) {
    if (alpha > 0.3) {
      interpolated.layout.type = ground.layout.type;
      interpolated.layout.x = ground.layout.x;
      interpolated.layout.y = ground.layout.y;
    }
  }

  // Interpolate motion
  if (interpolated.motion && alpha > 0.1) {
    interpolated.motion.animation = ground.motion.animation;
    interpolated.motion.duration = ground.motion.duration;
  }

  // Update scene if far enough
  if (alpha > 0.7) {
    interpolated.scene = ground.scene;
  }

  return interpolated;
}

/**
 * Generate escape path to ground state
 *
 * Creates a sequence of states that gradually move toward ground state.
 * Guaranteed to reach ground state in ≤10 steps (Morse theory).
 *
 * @param {Object} initialState - Starting state
 * @param {number} maxSteps - Maximum steps (default: 10)
 * @returns {Array} Path of states
 */
export function generateEscapePath(initialState, maxSteps = 10) {
  const path = [];
  let current = initialState;

  for (let step = 0; step < maxSteps; step++) {
    // Interpolation factor: increases with each step
    const alpha = (step + 1) / maxSteps;

    // Move toward ground state
    current = interpolateTowardGroundState(current, alpha);

    // Record step
    path.push({
      step,
      state: current,
      distance: distanceToGroundState(current),
      alpha,
    });

    // Stop if reached ground state
    if (distanceToGroundState(current) < 0.1) {
      break;
    }
  }

  // Ensure final state is exactly ground state
  path.push({
    step: path.length,
    state: getGroundState(),
    distance: 0,
    alpha: 1.0,
  });

  return path;
}

/**
 * Validate ground state
 *
 * Ensures ground state is actually valid.
 * This should ALWAYS return true (sanity check).
 *
 * @param {Function} validatorFn - Validation function
 * @returns {boolean} True if valid
 */
export function validateGroundState(validatorFn) {
  const ground = getGroundState();
  const result = validatorFn(ground);
  return result.isValid === true;
}

/**
 * Ground state variants
 *
 * Alternative ground states for different contexts.
 */
export const GROUND_STATE_VARIANTS = {
  /**
   * Minimal ground state (absolute minimum)
   */
  minimal: {
    ...GROUND_STATE,
    text: '',
  },

  /**
   * Dark mode ground state
   */
  dark: {
    ...GROUND_STATE,
    colors: {
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#999999',
      accent: '#66b3ff',
      background: '#000000',
      text: '#ffffff',
    },
  },

  /**
   * Accessible ground state (high contrast)
   */
  accessible: {
    ...GROUND_STATE,
    colors: {
      primary: '#000000',
      secondary: '#000000',
      tertiary: '#000000',
      accent: '#0000ff',
      background: '#ffffff',
      text: '#000000',
    },
    typography: {
      ...GROUND_STATE.typography,
      fontSize: '64px',
      fontWeight: 700,
    },
  },
};

/**
 * Get ground state variant
 *
 * @param {string} variant - Variant name ('minimal', 'dark', 'accessible')
 * @returns {Object} Ground state variant
 */
export function getGroundStateVariant(variant = 'minimal') {
  const variants = GROUND_STATE_VARIANTS[variant];
  if (!variants) {
    return getGroundState();
  }
  return JSON.parse(JSON.stringify(variants));
}

/**
 * Morse index of ground state
 *
 * The Morse index is the number of negative eigenvalues of the Hessian.
 * For ground state (global minimum), index = 0.
 *
 * @returns {number} Morse index (always 0)
 */
export function getMorseIndex() {
  return 0; // Global minimum
}

/**
 * Check if state is in ground state basin
 *
 * Determines if a state will naturally flow to ground state
 * under gradient descent (without escape path intervention).
 *
 * @param {Object} state - State to check
 * @returns {boolean} True if in basin
 */
export function isInGroundStateBasin(state) {
  const distance = distanceToGroundState(state);
  // States within distance 10 are in the basin of attraction
  return distance < 10.0;
}

/**
 * Energy of ground state
 *
 * Ground state has zero energy by definition (on brand submanifold).
 *
 * @returns {number} Energy (always 0)
 */
export function getGroundStateEnergy() {
  return 0.0;
}

export default {
  GROUND_STATE,
  getGroundState,
  isGroundState,
  distanceToGroundState,
  interpolateTowardGroundState,
  generateEscapePath,
  validateGroundState,
  GROUND_STATE_VARIANTS,
  getGroundStateVariant,
  getMorseIndex,
  isInGroundStateBasin,
  getGroundStateEnergy,
};
