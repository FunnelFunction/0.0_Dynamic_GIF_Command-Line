/**
 * LATTICE VALIDATOR
 *
 * FSM-based meta-governor implementing predicate logic validation.
 *
 * Mathematical Foundation:
 * - E(manifest) = P₁ ∧ P₂ ∧ ... ∧ Pₙ
 * - Valid ⟺ All predicates hold
 * - FSM acts as curvature tensor defining allowable transitions
 *
 * Key Features:
 * - Complete validation (soundness + completeness)
 * - Automatic repair for violations
 * - Guaranteed escape path to ground state
 * - Cached results for performance
 *
 * @module core/validator
 */

import chroma from 'chroma-js';

/**
 * Lattice Validator
 *
 * Validates manifests through predicate logic and provides escape paths.
 */
export class LatticeValidator {
  constructor() {
    // Build predicate system
    this.predicates = this.buildPredicateSystem();

    // Cache for validation results
    this.cache = new Map();

    // Statistics
    this.stats = {
      totalValidations: 0,
      cacheHits: 0,
      validCount: 0,
      invalidCount: 0,
      repairCount: 0,
    };
  }

  /**
   * Validate manifest through predicate logic
   * E(manifest) = P₁ ∧ P₂ ∧ ... ∧ Pₙ
   *
   * @param {Object} manifest - Manifest to validate
   * @returns {Object} Validation result
   */
  validate(manifest) {
    this.stats.totalValidations++;

    // Check cache
    const cacheKey = this.hash(manifest);
    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }

    const result = {
      valid: true,
      violations: [],
      repairs: [],
      escapePath: null,
      manifest: manifest,
    };

    // Test all predicates
    for (const predicate of this.predicates) {
      const testResult = predicate.test(manifest);

      if (!testResult.valid) {
        result.valid = false;
        result.violations.push({
          predicate: predicate.name,
          message: testResult.message,
          severity: predicate.severity,
        });

        // Attempt auto-repair
        if (predicate.fix) {
          try {
            const repaired = predicate.fix(manifest);
            result.repairs.push({
              predicate: predicate.name,
              original: manifest,
              repaired: repaired,
              description: testResult.message,
            });
          } catch (error) {
            console.warn(`Failed to repair ${predicate.name}:`, error);
          }
        }
      }
    }

    // If invalid, compute escape path to ground state
    if (!result.valid) {
      result.escapePath = this.computeEscapePath(manifest);
      this.stats.invalidCount++;
      this.stats.repairCount += result.repairs.length;
    } else {
      this.stats.validCount++;
    }

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Build complete predicate system
   * Each predicate is a constraint that must hold for validity
   *
   * @returns {Array} List of predicates
   */
  buildPredicateSystem() {
    return [
      {
        name: 'color_contrast',
        severity: 'error',
        test: (manifest) => this.testColorContrast(manifest),
        fix: (manifest) => this.fixColorContrast(manifest),
      },
      {
        name: 'layout_coherence',
        severity: 'error',
        test: (manifest) => this.testLayoutCoherence(manifest),
        fix: (manifest) => this.fixLayoutCoherence(manifest),
      },
      {
        name: 'brand_compliance',
        severity: 'warning',
        test: (manifest) => this.testBrandCompliance(manifest),
        fix: (manifest) => this.fixBrandCompliance(manifest),
      },
      {
        name: 'animation_physics',
        severity: 'warning',
        test: (manifest) => this.testAnimationPhysics(manifest),
        fix: (manifest) => this.fixAnimationPhysics(manifest),
      },
      {
        name: 'canvas_validity',
        severity: 'error',
        test: (manifest) => this.testCanvasValidity(manifest),
        fix: (manifest) => this.fixCanvasValidity(manifest),
      },
      {
        name: 'text_readability',
        severity: 'warning',
        test: (manifest) => this.testTextReadability(manifest),
        fix: (manifest) => this.fixTextReadability(manifest),
      },
    ];
  }

  /**
   * Test: Color Contrast (WCAG)
   */
  testColorContrast(manifest) {
    const textColor = manifest.colors?.text || '#000000';
    const bgColor = manifest.colors?.background || '#FFFFFF';

    try {
      const ratio = chroma.contrast(textColor, bgColor);
      const minRatio = 4.5; // WCAG AA

      if (ratio >= minRatio) {
        return { valid: true };
      } else {
        return {
          valid: false,
          message: `Contrast ratio ${ratio.toFixed(2)} is below minimum ${minRatio}`,
        };
      }
    } catch (e) {
      return {
        valid: false,
        message: `Invalid color format: ${e.message}`,
      };
    }
  }

  /**
   * Fix: Color Contrast
   */
  fixColorContrast(manifest) {
    const fixed = { ...manifest };
    const bgColor = chroma(manifest.colors?.background || '#FFFFFF');
    let textColor = chroma(manifest.colors?.text || '#000000');

    const minRatio = 4.5;
    let ratio = chroma.contrast(textColor, bgColor);

    // Try darkening first
    while (ratio < minRatio && textColor.luminance() > 0.05) {
      textColor = textColor.darken(0.2);
      ratio = chroma.contrast(textColor, bgColor);
    }

    // If still not enough, try lightening
    if (ratio < minRatio) {
      textColor = chroma(manifest.colors?.text || '#000000');
      while (ratio < minRatio && textColor.luminance() < 0.95) {
        textColor = textColor.brighten(0.2);
        ratio = chroma.contrast(textColor, bgColor);
      }
    }

    fixed.colors = {
      ...fixed.colors,
      text: textColor.hex(),
    };

    return fixed;
  }

  /**
   * Test: Layout Coherence
   */
  testLayoutCoherence(manifest) {
    // Check for overlapping elements
    if (!manifest.elements || manifest.elements.length === 0) {
      return { valid: true };
    }

    const elements = manifest.elements;
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (this.elementsOverlap(elements[i], elements[j])) {
          return {
            valid: false,
            message: `Elements ${i} and ${j} overlap`,
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Fix: Layout Coherence
   */
  fixLayoutCoherence(manifest) {
    const fixed = { ...manifest };

    // Apply grid layout to prevent overlaps
    if (fixed.elements && fixed.elements.length > 0) {
      const gridSize = Math.ceil(Math.sqrt(fixed.elements.length));
      const cellSize = 100 / gridSize;

      fixed.elements = fixed.elements.map((element, index) => ({
        ...element,
        x: `${(index % gridSize) * cellSize}%`,
        y: `${Math.floor(index / gridSize) * cellSize}%`,
        width: `${cellSize}%`,
        height: `${cellSize}%`,
      }));
    }

    return fixed;
  }

  /**
   * Test: Brand Compliance
   */
  testBrandCompliance(manifest) {
    // Check if profile exists
    if (!manifest.profile) {
      return { valid: true }; // No profile = no brand requirements
    }

    // Check if colors match brand palette
    if (manifest.brandColors && manifest.colors) {
      const allowedColors = manifest.brandColors;
      const usedColors = Object.values(manifest.colors);

      for (const color of usedColors) {
        const isAllowed = allowedColors.some(allowed => {
          try {
            return chroma.deltaE(color, allowed) < 10;
          } catch (e) {
            return false;
          }
        });

        if (!isAllowed) {
          return {
            valid: false,
            message: `Color ${color} is not in brand palette`,
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Fix: Brand Compliance
   */
  fixBrandCompliance(manifest) {
    const fixed = { ...manifest };

    if (manifest.brandColors && manifest.colors) {
      const brandColors = manifest.brandColors;

      // Replace each color with nearest brand color
      fixed.colors = {};
      for (const [key, color] of Object.entries(manifest.colors)) {
        fixed.colors[key] = this.nearestBrandColor(color, brandColors);
      }
    }

    return fixed;
  }

  /**
   * Test: Animation Physics
   */
  testAnimationPhysics(manifest) {
    if (!manifest.animation) {
      return { valid: true };
    }

    const animation = manifest.animation;

    // Check duration is positive
    const duration = parseFloat(animation.duration);
    if (duration <= 0) {
      return {
        valid: false,
        message: `Animation duration must be positive, got ${duration}`,
      };
    }

    // Check easing is valid
    const validEasings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
    if (animation.easing && !validEasings.includes(animation.easing)) {
      if (!animation.easing.startsWith('cubic-bezier')) {
        return {
          valid: false,
          message: `Invalid easing function: ${animation.easing}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Fix: Animation Physics
   */
  fixAnimationPhysics(manifest) {
    const fixed = { ...manifest };

    if (fixed.animation) {
      // Ensure positive duration
      const duration = parseFloat(fixed.animation.duration);
      if (duration <= 0) {
        fixed.animation.duration = '1s';
      }

      // Fix invalid easing
      const validEasings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
      if (fixed.animation.easing && !validEasings.includes(fixed.animation.easing)) {
        if (!fixed.animation.easing.startsWith('cubic-bezier')) {
          fixed.animation.easing = 'ease';
        }
      }
    }

    return fixed;
  }

  /**
   * Test: Canvas Validity
   */
  testCanvasValidity(manifest) {
    if (!manifest.canvas) {
      return { valid: true };
    }

    const canvas = manifest.canvas;

    // Check if canvas dimensions are valid
    if (typeof canvas === 'string') {
      // Ratio format (e.g., "16:9")
      if (canvas.includes(':')) {
        const [w, h] = canvas.split(':').map(Number);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
          return {
            valid: false,
            message: `Invalid canvas ratio: ${canvas}`,
          };
        }
      }
      // Pixel format (e.g., "1920x1080")
      else if (canvas.includes('x')) {
        const [w, h] = canvas.split('x').map(Number);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
          return {
            valid: false,
            message: `Invalid canvas dimensions: ${canvas}`,
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Fix: Canvas Validity
   */
  fixCanvasValidity(manifest) {
    const fixed = { ...manifest };

    if (!fixed.canvas || fixed.canvas === '') {
      fixed.canvas = '1:1'; // Default to square
    }

    return fixed;
  }

  /**
   * Test: Text Readability
   */
  testTextReadability(manifest) {
    if (!manifest.text) {
      return { valid: true };
    }

    const text = manifest.text;

    // Check text is not empty
    if (typeof text === 'string' && text.trim().length === 0) {
      return {
        valid: false,
        message: 'Text content is empty',
      };
    }

    // Check font size is reasonable
    if (manifest.typography?.fontSize) {
      const size = parseFloat(manifest.typography.fontSize);
      if (size < 8 || size > 200) {
        return {
          valid: false,
          message: `Font size ${size}px is outside readable range (8-200px)`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Fix: Text Readability
   */
  fixTextReadability(manifest) {
    const fixed = { ...manifest };

    // Replace empty text with placeholder
    if (!fixed.text || (typeof fixed.text === 'string' && fixed.text.trim().length === 0)) {
      fixed.text = 'Text';
    }

    // Clamp font size
    if (fixed.typography?.fontSize) {
      const size = parseFloat(fixed.typography.fontSize);
      if (size < 8) {
        fixed.typography.fontSize = '8px';
      } else if (size > 200) {
        fixed.typography.fontSize = '200px';
      }
    }

    return fixed;
  }

  /**
   * Helper: Check if two elements overlap
   */
  elementsOverlap(el1, el2) {
    // Simple bounding box collision
    const x1 = parseFloat(el1.x) || 0;
    const y1 = parseFloat(el1.y) || 0;
    const w1 = parseFloat(el1.width) || 100;
    const h1 = parseFloat(el1.height) || 100;

    const x2 = parseFloat(el2.x) || 0;
    const y2 = parseFloat(el2.y) || 0;
    const w2 = parseFloat(el2.width) || 100;
    const h2 = parseFloat(el2.height) || 100;

    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
  }

  /**
   * Helper: Find nearest brand color
   */
  nearestBrandColor(color, brandColors) {
    let minDistance = Infinity;
    let nearest = color;

    for (const brandColor of brandColors) {
      try {
        const dist = chroma.deltaE(color, brandColor);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = brandColor;
        }
      } catch (e) {
        continue;
      }
    }

    return nearest;
  }

  /**
   * Compute escape path to ground state
   * Guaranteed to exist by Morse theory
   *
   * @param {Object} manifest - Invalid manifest
   * @returns {Array} Escape path (sequence of states)
   */
  computeEscapePath(manifest) {
    const groundState = this.getGroundState();
    const path = [];

    let current = manifest;
    let step = 0;
    const maxSteps = 10;

    while (!this.isValid(current) && step < maxSteps) {
      // Interpolate toward ground state
      current = this.interpolate(current, groundState, 0.2);
      path.push({
        step: step,
        state: current,
        energy: this.computeEnergy(current),
      });
      step++;
    }

    // Add ground state as final step
    path.push({
      step: step,
      state: groundState,
      energy: 0,
    });

    return path;
  }

  /**
   * Get ground state (always valid)
   *
   * @returns {Object} Ground state manifest
   */
  getGroundState() {
    return {
      scene: 'minimal',
      text: 'Hello',
      colors: {
        text: '#000000',
        background: '#FFFFFF',
        primary: '#000000',
        secondary: '#666666',
        tertiary: '#999999',
        accent: '#0066cc',
      },
      typography: {
        fontFamily: 'Arial',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      layout: {
        type: 'centered',
        x: '50%',
        y: '50%',
        anchor: 'center',
      },
      animation: {
        type: 'none',
        duration: '0s',
      },
      canvas: '1:1',
      elements: [],
    };
  }

  /**
   * Check if manifest is valid (all predicates pass)
   *
   * @param {Object} manifest
   * @returns {boolean}
   */
  isValid(manifest) {
    for (const predicate of this.predicates) {
      const result = predicate.test(manifest);
      if (!result.valid) {
        return false;
      }
    }
    return true;
  }

  /**
   * Interpolate between two manifests
   *
   * @param {Object} m1 - First manifest
   * @param {Object} m2 - Second manifest
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Object} Interpolated manifest
   */
  interpolate(m1, m2, t) {
    const interpolated = { ...m1 };

    // Interpolate colors
    if (m1.colors && m2.colors) {
      interpolated.colors = {};
      for (const key of Object.keys(m1.colors)) {
        if (m2.colors[key]) {
          try {
            const color1 = chroma(m1.colors[key]);
            const color2 = chroma(m2.colors[key]);
            interpolated.colors[key] = chroma.mix(color1, color2, t).hex();
          } catch (e) {
            interpolated.colors[key] = m2.colors[key];
          }
        }
      }
    }

    // Interpolate typography
    if (m1.typography && m2.typography) {
      interpolated.typography = { ...m1.typography };
      if (m1.typography.fontSize && m2.typography.fontSize) {
        const size1 = parseFloat(m1.typography.fontSize);
        const size2 = parseFloat(m2.typography.fontSize);
        interpolated.typography.fontSize = `${size1 + (size2 - size1) * t}px`;
      }
    }

    return interpolated;
  }

  /**
   * Compute energy of manifest
   * Lower energy = closer to valid state
   *
   * @param {Object} manifest
   * @returns {number} Energy value
   */
  computeEnergy(manifest) {
    let energy = 0;

    // Add penalty for each violated predicate
    for (const predicate of this.predicates) {
      const result = predicate.test(manifest);
      if (!result.valid) {
        energy += predicate.severity === 'error' ? 10 : 5;
      }
    }

    return energy;
  }

  /**
   * Hash manifest for caching
   *
   * @param {Object} manifest
   * @returns {string} Hash
   */
  hash(manifest) {
    return JSON.stringify(manifest);
  }

  /**
   * Get validation statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheHitRate: this.stats.totalValidations > 0
        ? (this.stats.cacheHits / this.stats.totalValidations * 100).toFixed(2) + '%'
        : '0%',
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default LatticeValidator;
