/**
 * TEMPORAL MANIFOLD ENGINE
 * 
 * Implements multi-frame GIF generation through ITT (Intent Tensor Theory) 
 * recursive collapse dynamics.
 * 
 * Mathematical Foundation:
 * ========================
 * Each frame represents a collapse state on the visual manifold V.
 * A multi-frame GIF is a geodesic path γ(t) through brand attractor space B ⊂ V.
 * 
 * State Trajectory:
 *   Φ → ∇Φ → ∇×F → ∇²Φ → ρq
 *   
 * Where:
 *   Φ = Scalar tension field (frame content)
 *   ∇Φ = Collapse gradient (transition direction)
 *   ∇×F = Memory loop (style consistency)
 *   ∇²Φ = Curvature lock (brand convergence)
 *   ρq = Boundary charge (visual output)
 * 
 * The temporal dimension emerges from ∂Φ/∂t - the rate of recursive transition.
 * 
 * @module temporal-manifold
 * @author Armstrong Knight, Abdullah Khan, Claude (Anthropic), ChatGPT (OpenAI), Grok (xAI), Gemini (Google)
 * @see https://intent-tensor-theory.com/coordinate-system/
 * @see https://github.com/intent-tensor-theory/0.0_Coding_Principals_Intent_Tensor_Theory
 */

import { nanoid } from 'nanoid';

/**
 * Frame mode enumeration
 * Determines whether output is single-frame or multi-frame sequence
 */
export const FrameMode = {
  SINGLE: 'single',
  MULTI: 'multi',
  SEQUENCE: 'sequence',  // Alias for multi
};

/**
 * Color flow modes for multi-frame sequences
 * Defines how colors evolve across the temporal manifold
 */
export const ColorFlowMode = {
  CONSISTENT: 'consistent',  // Same colors throughout (phase-locked)
  EVOLVE: 'evolve',          // Gradual color drift (gradient flow)
  PULSE: 'pulse',            // Oscillating colors (recursive resonance)
  RANDOM: 'random',          // Stochastic color selection
};

/**
 * Background animation modes
 * Defines dynamics of background elements across frames
 */
export const BackgroundMode = {
  STATIC: 'static',
  SLIDE: 'slide',
  FADE: 'fade',
  MORPH: 'morph',
};

/**
 * Creates a temporal manifold configuration from CLI parameters
 * 
 * @param {Object} params - Parsed CLI parameters
 * @returns {Object} Temporal manifold configuration
 */
export function createTemporalManifold(params) {
  const {
    mode = FrameMode.SINGLE,
    sequence = [],
    timing = 2000,        // Default 2 seconds per frame
    colorFlow = ColorFlowMode.CONSISTENT,
    background = {},
    shapes = {},
    company = '',
    ceo = '',
    loop = true,
    frameCount = null,    // Auto-calculated if not specified
  } = params;

  // Parse sequence if string
  const frames = typeof sequence === 'string' 
    ? sequence.split('|').map(s => s.trim())
    : sequence;

  // Determine frame count
  const totalFrames = frameCount || frames.length || 1;

  // Create manifold ID for tracking
  const manifoldId = nanoid(12);

  return {
    id: manifoldId,
    mode: frames.length > 1 ? FrameMode.MULTI : mode,
    frames,
    totalFrames,
    timing: parseTimingConfig(timing),
    colorFlow,
    background: parseBackgroundConfig(background),
    shapes: parseShapesConfig(shapes),
    metadata: {
      company,
      ceo,
      createdAt: Date.now(),
    },
    loop,
    // ITT collapse state tracking
    collapseState: {
      phi: 0,           // Scalar tension
      gradPhi: [0, 0],  // Collapse gradient
      curlF: 0,         // Memory loop state
      laplacianPhi: 0,  // Curvature signature
      rhoQ: 0,          // Boundary charge
      entropy: 0,       // Recursive drift (Sθ)
    },
  };
}

/**
 * Parses timing configuration
 * Supports global timing or per-frame timing arrays
 * 
 * @param {number|string|Array} timing - Timing specification
 * @returns {Object} Parsed timing config
 */
function parseTimingConfig(timing) {
  // Handle string with units (e.g., "2s", "500ms")
  if (typeof timing === 'string') {
    const match = timing.match(/^(\d+(?:\.\d+)?)(s|ms)?$/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2] || 'ms';
      return {
        global: unit === 's' ? value * 1000 : value,
        perFrame: null,
      };
    }
  }

  // Handle array of per-frame timings
  if (Array.isArray(timing)) {
    return {
      global: null,
      perFrame: timing.map(t => typeof t === 'string' ? parseTimingConfig(t).global : t),
    };
  }

  // Handle number (milliseconds)
  return {
    global: timing,
    perFrame: null,
  };
}

/**
 * Parses background configuration for animated backgrounds
 * 
 * @param {Object|string} config - Background specification
 * @returns {Object} Parsed background config
 */
function parseBackgroundConfig(config) {
  if (typeof config === 'string') {
    // Parse shorthand: "pinstripes::animate=slide"
    const parts = config.split('::');
    const type = parts[0];
    const modifiers = {};
    
    parts.slice(1).forEach(mod => {
      const [key, value] = mod.split('=');
      modifiers[key] = value;
    });

    return {
      type,
      animate: modifiers.animate || BackgroundMode.STATIC,
      speed: parseFloat(modifiers.speed) || 1,
      direction: modifiers.direction || 'right',
      opacity: parseFloat(modifiers.opacity) || 1,
    };
  }

  return {
    type: config.type || 'solid',
    animate: config.animate || BackgroundMode.STATIC,
    speed: config.speed || 1,
    direction: config.direction || 'right',
    opacity: config.opacity || 1,
    ...config,
  };
}

/**
 * Parses shapes configuration for animated shape overlays
 * 
 * @param {Object|string} config - Shapes specification
 * @returns {Object} Parsed shapes config
 */
function parseShapesConfig(config) {
  if (typeof config === 'string') {
    // Parse shorthand: "circles::fill=gradient::count=5"
    const parts = config.split('::');
    const type = parts[0];
    const modifiers = {};
    
    parts.slice(1).forEach(mod => {
      const [key, value] = mod.split('=');
      modifiers[key] = value;
    });

    return {
      type,
      fill: modifiers.fill || 'solid',
      count: parseInt(modifiers.count) || 3,
      animate: modifiers.animate !== 'false',
      size: modifiers.size || 'medium',
    };
  }

  return {
    type: config.type || 'none',
    fill: config.fill || 'solid',
    count: config.count || 3,
    animate: config.animate !== false,
    size: config.size || 'medium',
    ...config,
  };
}

/**
 * Generates frame states for a multi-frame sequence
 * Implements ITT collapse dynamics across temporal dimension
 * 
 * @param {Object} manifold - Temporal manifold configuration
 * @param {Object} baseState - Base visual state from emergence
 * @returns {Array} Array of frame states
 */
export function generateFrameStates(manifold, baseState) {
  const { frames, colorFlow, background, shapes, timing } = manifold;
  const frameStates = [];

  // Calculate color evolution based on flow mode
  const colorEvolution = calculateColorEvolution(baseState.colors, frames.length, colorFlow);

  for (let i = 0; i < frames.length; i++) {
    const frameText = frames[i];
    const t = i / Math.max(frames.length - 1, 1); // Normalized time [0, 1]

    // Calculate collapse state for this frame
    const collapseState = calculateCollapseState(t, manifold);

    // Determine frame timing
    const frameTiming = timing.perFrame 
      ? timing.perFrame[i] || timing.perFrame[timing.perFrame.length - 1]
      : timing.global;

    // Generate frame state
    frameStates.push({
      index: i,
      text: frameText,
      timing: frameTiming,
      colors: colorEvolution[i],
      background: interpolateBackground(background, t, i),
      shapes: interpolateShapes(shapes, t, i),
      collapseState,
      // Visual properties
      opacity: 1,
      scale: 1,
      rotation: 0,
      // Transition metadata
      transition: {
        from: i > 0 ? 'previous' : 'initial',
        easing: 'ease-in-out',
        type: determineTransitionType(frames[i - 1], frameText),
      },
    });
  }

  return frameStates;
}

/**
 * Calculates ITT collapse state at time t
 * 
 * Based on the Collapse Genesis Stack:
 *   Φ → ∇Φ → ∇×F → ∇²Φ → ρq
 * 
 * @param {number} t - Normalized time [0, 1]
 * @param {Object} manifold - Temporal manifold configuration
 * @returns {Object} Collapse state vector
 */
function calculateCollapseState(t, manifold) {
  // Scalar tension - oscillates based on frame position
  const phi = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;

  // Collapse gradient - direction of visual change
  const gradPhi = [
    Math.cos(t * Math.PI * 2),
    Math.sin(t * Math.PI * 2),
  ];

  // Memory loop (curl) - maintains style consistency
  // Higher values = stronger brand memory retention
  const curlF = manifold.colorFlow === ColorFlowMode.CONSISTENT ? 1.0 : 0.5;

  // Curvature lock - how tightly converged to brand attractor
  const laplacianPhi = manifold.colorFlow === ColorFlowMode.EVOLVE 
    ? 0.3 + 0.7 * (1 - t)  // Relaxes over time
    : 0.9;                  // Stays locked

  // Boundary charge - visual output intensity
  const rhoQ = 1.0;

  // Entropy drift - recursive phase stability
  const entropy = manifold.colorFlow === ColorFlowMode.RANDOM ? 0.8 : 0.1;

  return {
    phi,
    gradPhi,
    curlF,
    laplacianPhi,
    rhoQ,
    entropy,
    t, // Store normalized time
  };
}

/**
 * Calculates color evolution across frames based on flow mode
 * 
 * @param {Object} baseColors - Base color palette
 * @param {number} frameCount - Number of frames
 * @param {string} flowMode - Color flow mode
 * @returns {Array} Array of color palettes per frame
 */
function calculateColorEvolution(baseColors, frameCount, flowMode) {
  const evolution = [];

  for (let i = 0; i < frameCount; i++) {
    const t = i / Math.max(frameCount - 1, 1);

    switch (flowMode) {
      case ColorFlowMode.CONSISTENT:
        // Same colors throughout - phase-locked memory loop
        evolution.push({ ...baseColors });
        break;

      case ColorFlowMode.EVOLVE:
        // Gradual hue shift - gradient flow dynamics
        evolution.push(shiftColors(baseColors, t * 30)); // 30° max hue shift
        break;

      case ColorFlowMode.PULSE:
        // Oscillating saturation/lightness - recursive resonance
        const pulseIntensity = Math.sin(t * Math.PI * 2) * 0.2;
        evolution.push(adjustColorIntensity(baseColors, pulseIntensity));
        break;

      case ColorFlowMode.RANDOM:
        // Stochastic variation within brand bounds
        evolution.push(randomizeWithinBounds(baseColors, 0.15));
        break;

      default:
        evolution.push({ ...baseColors });
    }
  }

  return evolution;
}

/**
 * Shifts colors by hue amount
 */
function shiftColors(colors, hueShift) {
  // Implementation would use chroma-js for proper color manipulation
  // For now, return base colors (actual implementation in color-math.js)
  return { ...colors };
}

/**
 * Adjusts color intensity (saturation/lightness)
 */
function adjustColorIntensity(colors, intensity) {
  return { ...colors };
}

/**
 * Randomizes colors within brand-safe bounds
 */
function randomizeWithinBounds(colors, variance) {
  return { ...colors };
}

/**
 * Interpolates background state at time t
 */
function interpolateBackground(background, t, frameIndex) {
  const { type, animate, speed, direction } = background;

  let offset = 0;
  if (animate === BackgroundMode.SLIDE) {
    offset = t * 100 * speed; // Percentage offset
  }

  return {
    ...background,
    offset,
    frameIndex,
    t,
  };
}

/**
 * Interpolates shapes state at time t
 */
function interpolateShapes(shapes, t, frameIndex) {
  if (!shapes || shapes.type === 'none') return null;

  return {
    ...shapes,
    // Animated properties
    rotation: t * 360 * (shapes.animate ? 1 : 0),
    scale: 1 + Math.sin(t * Math.PI * 2) * 0.1 * (shapes.animate ? 1 : 0),
    positions: generateShapePositions(shapes.count, t),
    frameIndex,
    t,
  };
}

/**
 * Generates positions for animated shapes
 */
function generateShapePositions(count, t) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * Math.PI;
    positions.push({
      x: 0.5 + Math.cos(angle) * 0.3,
      y: 0.5 + Math.sin(angle) * 0.3,
    });
  }
  return positions;
}

/**
 * Determines transition type between frames based on content
 */
function determineTransitionType(prevText, nextText) {
  if (!prevText) return 'fade';
  
  // If texts are similar length, use crossfade
  if (Math.abs(prevText.length - nextText.length) < 5) {
    return 'crossfade';
  }
  
  // If next is longer, use slide-up (revealing more)
  if (nextText.length > prevText.length) {
    return 'slide-up';
  }
  
  // Otherwise use slide-down
  return 'slide-down';
}

/**
 * Validates temporal manifold configuration
 * 
 * @param {Object} manifold - Temporal manifold to validate
 * @returns {Object} Validation result with any warnings
 */
export function validateTemporalManifold(manifold) {
  const warnings = [];
  const errors = [];

  // Check frame count limits
  if (manifold.frames.length > 20) {
    warnings.push('Large frame count (>20) may result in large GIF file sizes');
  }

  if (manifold.frames.length > 50) {
    errors.push('Maximum 50 frames allowed');
  }

  // Check timing constraints
  const minTiming = manifold.timing.perFrame 
    ? Math.min(...manifold.timing.perFrame)
    : manifold.timing.global;

  if (minTiming < 100) {
    warnings.push('Very fast timing (<100ms) may cause visual flicker');
  }

  // Check for empty frames
  const emptyFrames = manifold.frames.filter(f => !f || f.trim() === '');
  if (emptyFrames.length > 0) {
    warnings.push(`${emptyFrames.length} empty frame(s) detected`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    manifold,
  };
}

/**
 * Exports the temporal manifold specification for external tools
 */
export function exportManifoldSpec(manifold, frameStates) {
  return {
    version: '1.0.0',
    id: manifold.id,
    mode: manifold.mode,
    frames: frameStates.map(f => ({
      index: f.index,
      text: f.text,
      timing: f.timing,
      colors: f.colors,
      collapse: f.collapseState,
    })),
    metadata: {
      ...manifold.metadata,
      generatedAt: Date.now(),
      framework: 'Intent Tensor Theory',
      foundation: 'Collapse Genesis Stack: Φ → ∇Φ → ∇×F → ∇²Φ → ρq',
    },
  };
}
