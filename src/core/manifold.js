/**
 * VISUAL STATE MANIFOLD
 *
 * Implements the Riemannian manifold structure for visual state space.
 *
 * Mathematical Foundation:
 * - V = ℝⁿ (n ≈ 128 dimensions)
 * - Metric: g(v) defining distance between visual states
 * - Brand Submanifold: B ⊂ V where brand constraints hold
 *
 * @module core/manifold
 */

import chroma from 'chroma-js';

/**
 * Visual State Manifold
 *
 * Represents the high-dimensional space of all possible visual configurations.
 */
export class VisualManifold {
  /**
   * @param {Object} brandProfile - Brand profile defining constraints
   */
  constructor(brandProfile = null) {
    // Dimensionality of the manifold (~128 dimensions)
    this.dimensions = {
      color: 3,         // RGB per color
      colorCount: 5,    // primary, secondary, tertiary, accent, background
      position: 2,      // x, y coordinates
      scale: 2,         // width, height
      typography: 8,    // font, size, weight, spacing, lineHeight, letterSpacing, wordSpacing, textAlign
      animation: 6,     // duration, delay, easing, loop, direction, fillMode
      effects: 4,       // shadow, glow, blur, opacity
      layout: 6,        // gridColumns, gridRows, marginTop, marginRight, marginBottom, marginLeft
      decorations: 3,   // type, position, scale
    };

    // Total dimensionality
    this.totalDimensions = Object.values(this.dimensions).reduce((a, b) => a + b, 0);

    // Brand profile (defines submanifold)
    this.brandProfile = brandProfile;

    // Define brand constraints
    this.constraints = this.buildConstraints(brandProfile);

    // Define Riemannian metric
    this.metric = this.defineMetric();

    // Cache for performance
    this.cache = new Map();
  }

  /**
   * Build brand constraints from profile
   * These define the brand submanifold B ⊂ V
   *
   * @param {Object} profile - Brand profile
   * @returns {Object} Constraint functions
   */
  buildConstraints(profile) {
    if (!profile) {
      // Default constraints (minimal)
      return {
        colorPalette: null,
        fontFamily: null,
        wcagMinimum: 4.5,
        layoutGrid: null,
      };
    }

    return {
      colorPalette: profile.colors || null,
      fontFamily: profile.fonts || null,
      wcagMinimum: profile.accessibility?.contrastRatio || 4.5,
      layoutGrid: profile.layout?.grid || null,
      tonalRange: profile.colors?.tonalRange || null,
    };
  }

  /**
   * Define Riemannian metric g(v)
   * Determines how distance is measured between visual states
   *
   * @returns {Function} Metric function
   */
  defineMetric() {
    return (state) => {
      // Diagonal metric (dimensions are independent)
      const g = {};

      // Color dimensions: Perceptual distance (CIELAB)
      g.color = 1.0;

      // Position dimensions: Euclidean
      g.position = 1.0;

      // Typography dimensions: Weighted by visual impact
      g.typography = {
        font: 2.0,      // Font change is highly visible
        size: 1.5,      // Size change is visible
        weight: 1.2,    // Weight change is noticeable
        spacing: 0.8,   // Spacing is subtle
      };

      // Animation dimensions: Temporal distance
      g.animation = 0.5;  // Animations are less critical for static distance

      // Layout dimensions: Spatial distance
      g.layout = 1.0;

      return g;
    };
  }

  /**
   * Coordinate Chart: CLI Command → Visual State
   * φ: Hash → V
   *
   * Maps CLI commands to points on the manifold
   *
   * @param {Object} command - Parsed CLI command
   * @returns {Object} Visual state (point on manifold)
   */
  coordinateChart(command) {
    const cacheKey = JSON.stringify(command);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const state = {
      // Color coordinates
      colors: this.parseColorVector(command),

      // Layout coordinates
      layout: this.parseLayoutVector(command),

      // Typography coordinates
      typography: this.parseTypographyVector(command),

      // Motion coordinates
      motion: this.parseMotionVector(command),

      // Effect coordinates
      effects: this.parseEffectVector(command),

      // Metadata
      scene: command.scene || 'minimal',
      canvas: command.canvas || '1:1',
      profile: command.profile || null,
    };

    this.cache.set(cacheKey, state);
    return state;
  }

  /**
   * Parse color vector from command
   *
   * @param {Object} command
   * @returns {Object} Color state
   */
  parseColorVector(command) {
    const colors = {
      primary: command.colors?.primary || '#000000',
      secondary: command.colors?.secondary || '#666666',
      tertiary: command.colors?.tertiary || '#999999',
      accent: command.colors?.accent || '#0066cc',
      background: command.background || '#ffffff',
      text: command.textColor || '#000000',
    };

    // Convert to LAB color space for perceptual distance
    const lab = {};
    for (const [key, value] of Object.entries(colors)) {
      try {
        const chromaColor = chroma(value);
        lab[key] = chromaColor.lab();
      } catch (e) {
        lab[key] = [0, 0, 0]; // Fallback
      }
    }

    return {
      rgb: colors,
      lab: lab,
    };
  }

  /**
   * Parse layout vector from command
   *
   * @param {Object} command
   * @returns {Object} Layout state
   */
  parseLayoutVector(command) {
    return {
      type: command.layout || 'centered',
      x: command.x || '50%',
      y: command.y || '50%',
      anchor: command.anchor || 'center',
      width: command.width || '100%',
      height: command.height || '100%',
      padding: command.padding || { top: 0, right: 0, bottom: 0, left: 0 },
      margin: command.margin || { top: 0, right: 0, bottom: 0, left: 0 },
    };
  }

  /**
   * Parse typography vector from command
   *
   * @param {Object} command
   * @returns {Object} Typography state
   */
  parseTypographyVector(command) {
    return {
      fontFamily: command.font || 'Arial',
      fontSize: command.size || '16px',
      fontWeight: command.weight || 400,
      lineHeight: command.lineHeight || 1.5,
      letterSpacing: command.letterSpacing || '0em',
      wordSpacing: command.wordSpacing || '0em',
      textAlign: command.align || 'center',
      textTransform: command.textTransform || 'none',
    };
  }

  /**
   * Parse motion vector from command
   *
   * @param {Object} command
   * @returns {Object} Motion state
   */
  parseMotionVector(command) {
    return {
      animation: command.animation || 'none',
      duration: command.duration || '1s',
      delay: command.delay || '0s',
      easing: command.easing || 'ease',
      loop: command.loop || 1,
      direction: command.direction || 'normal',
    };
  }

  /**
   * Parse effect vector from command
   *
   * @param {Object} command
   * @returns {Object} Effect state
   */
  parseEffectVector(command) {
    return {
      shadow: command.shadow || 'none',
      glow: command.glow || 'none',
      blur: command.blur || '0px',
      opacity: command.opacity !== undefined ? command.opacity : 1.0,
    };
  }

  /**
   * Calculate distance between two visual states
   * d(v₁, v₂) using Riemannian metric
   *
   * @param {Object} state1 - First visual state
   * @param {Object} state2 - Second visual state
   * @returns {number} Distance
   */
  distance(state1, state2) {
    let distanceSquared = 0;

    // Color distance (perceptual CIELAB)
    const colorDist = this.colorDistance(state1.colors, state2.colors);
    distanceSquared += colorDist ** 2;

    // Layout distance (Euclidean)
    const layoutDist = this.layoutDistance(state1.layout, state2.layout);
    distanceSquared += layoutDist ** 2;

    // Typography distance (weighted)
    const typoDist = this.typographyDistance(state1.typography, state2.typography);
    distanceSquared += typoDist ** 2;

    // Motion distance (temporal)
    const motionDist = this.motionDistance(state1.motion, state2.motion);
    distanceSquared += 0.5 * motionDist ** 2; // Lower weight

    return Math.sqrt(distanceSquared);
  }

  /**
   * Color distance (CIELAB ΔE)
   *
   * @param {Object} colors1
   * @param {Object} colors2
   * @returns {number} Distance
   */
  colorDistance(colors1, colors2) {
    let totalDistance = 0;
    const keys = ['primary', 'secondary', 'tertiary', 'accent', 'background', 'text'];

    for (const key of keys) {
      if (colors1.lab[key] && colors2.lab[key]) {
        const dist = chroma.deltaE(colors1.rgb[key], colors2.rgb[key]);
        totalDistance += dist;
      }
    }

    return totalDistance / keys.length;
  }

  /**
   * Layout distance (spatial)
   *
   * @param {Object} layout1
   * @param {Object} layout2
   * @returns {number} Distance
   */
  layoutDistance(layout1, layout2) {
    // Convert percentages to pixels (assume 1080px canvas)
    const canvasSize = 1080;

    const x1 = this.parsePosition(layout1.x, canvasSize);
    const y1 = this.parsePosition(layout1.y, canvasSize);
    const x2 = this.parsePosition(layout2.x, canvasSize);
    const y2 = this.parsePosition(layout2.y, canvasSize);

    // Euclidean distance
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Typography distance (weighted)
   *
   * @param {Object} typo1
   * @param {Object} typo2
   * @returns {number} Distance
   */
  typographyDistance(typo1, typo2) {
    let distance = 0;

    // Font family (categorical, binary)
    if (typo1.fontFamily !== typo2.fontFamily) {
      distance += 2.0; // High weight
    }

    // Font size (continuous)
    const size1 = parseFloat(typo1.fontSize);
    const size2 = parseFloat(typo2.fontSize);
    distance += 1.5 * Math.abs(size1 - size2) / 100; // Normalized

    // Font weight (discrete)
    distance += 1.2 * Math.abs(typo1.fontWeight - typo2.fontWeight) / 1000;

    return distance;
  }

  /**
   * Motion distance (temporal)
   *
   * @param {Object} motion1
   * @param {Object} motion2
   * @returns {number} Distance
   */
  motionDistance(motion1, motion2) {
    let distance = 0;

    // Animation type (categorical)
    if (motion1.animation !== motion2.animation) {
      distance += 1.0;
    }

    // Duration (continuous)
    const dur1 = parseFloat(motion1.duration);
    const dur2 = parseFloat(motion2.duration);
    distance += Math.abs(dur1 - dur2);

    return distance;
  }

  /**
   * Check if state is on brand submanifold
   * v ∈ B ?
   *
   * @param {Object} state - Visual state
   * @returns {boolean} True if on brand
   */
  isOnBrand(state) {
    if (!this.constraints) return true;

    // Check color palette
    if (this.constraints.colorPalette) {
      if (!this.colorAllowed(state.colors)) {
        return false;
      }
    }

    // Check font family
    if (this.constraints.fontFamily) {
      if (!this.fontAllowed(state.typography)) {
        return false;
      }
    }

    // Check WCAG compliance
    if (!this.wcagCompliant(state)) {
      return false;
    }

    return true;
  }

  /**
   * Check if colors are in allowed palette
   *
   * @param {Object} colors
   * @returns {boolean}
   */
  colorAllowed(colors) {
    if (!this.constraints.colorPalette) return true;

    const allowedColors = this.constraints.colorPalette.map(c => chroma(c).hex());

    for (const color of Object.values(colors.rgb)) {
      const hex = chroma(color).hex();

      // Check if color is in palette or close enough (ΔE < 10)
      const isAllowed = allowedColors.some(allowed => {
        const dist = chroma.deltaE(hex, allowed);
        return dist < 10; // Perceptual threshold
      });

      if (!isAllowed) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if font is in allowed families
   *
   * @param {Object} typography
   * @returns {boolean}
   */
  fontAllowed(typography) {
    if (!this.constraints.fontFamily) return true;

    const allowedFonts = this.constraints.fontFamily.map(f => f.toLowerCase());
    const currentFont = typography.fontFamily.toLowerCase();

    return allowedFonts.some(font => currentFont.includes(font));
  }

  /**
   * Check WCAG compliance
   *
   * @param {Object} state
   * @returns {boolean}
   */
  wcagCompliant(state) {
    try {
      const textColor = chroma(state.colors.rgb.text);
      const bgColor = chroma(state.colors.rgb.background);
      const ratio = chroma.contrast(textColor, bgColor);
      return ratio >= this.constraints.wcagMinimum;
    } catch (e) {
      return false;
    }
  }

  /**
   * Parse position string to pixels
   *
   * @param {string} position - Position string (50%, 100px, etc.)
   * @param {number} canvasSize - Canvas dimension
   * @returns {number} Position in pixels
   */
  parsePosition(position, canvasSize) {
    if (typeof position === 'number') return position;

    const str = String(position);
    if (str.endsWith('%')) {
      return (parseFloat(str) / 100) * canvasSize;
    } else if (str.endsWith('px')) {
      return parseFloat(str);
    } else {
      return parseFloat(str);
    }
  }

  /**
   * Get dimensionality of manifold
   *
   * @returns {number} Total dimensions
   */
  getDimensionality() {
    return this.totalDimensions;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default VisualManifold;
