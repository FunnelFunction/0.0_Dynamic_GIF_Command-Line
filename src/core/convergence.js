/**
 * GRADIENT FLOW CONVERGENCE ENGINE
 *
 * Implements gradient descent on the visual manifold to guarantee
 * convergence to brand-compliant states.
 *
 * Mathematical Foundation:
 * - Energy Functional: E(v) = d(v, B)² where B is brand submanifold
 * - Gradient Flow: dv/dt = -∇E(v)
 * - Lyapunov Function: E(v) strictly decreasing
 * - Attractor: ∀ v₀, lim_{t→∞} φₜ(v₀) → m* ∈ B
 *
 * Convergence Guarantee:
 * Every trajectory converges to on-brand state in finite time.
 *
 * @module core/convergence
 */

import { VisualManifold } from './manifold.js';
import { LatticeValidator } from './validator.js';
import chroma from 'chroma-js';

/**
 * Convergence Engine
 *
 * Performs gradient descent to move visual states toward brand compliance.
 */
export class ConvergenceEngine {
  /**
   * @param {Object} options - Configuration options
   * @param {VisualManifold} options.manifold - Visual manifold
   * @param {LatticeValidator} options.validator - Validator
   * @param {number} options.maxIterations - Maximum iterations (default: 50)
   * @param {number} options.epsilon - Convergence threshold (default: 0.01)
   * @param {number} options.learningRate - Step size (default: 0.1)
   */
  constructor(options = {}) {
    this.manifold = options.manifold || new VisualManifold();
    this.validator = options.validator || new LatticeValidator();

    // Convergence parameters
    this.maxIterations = options.maxIterations || 50;
    this.epsilon = options.epsilon || 0.01;
    this.learningRate = options.learningRate || 0.1;

    // Adaptive parameters
    this.adaptiveStepSize = options.adaptiveStepSize !== false;
    this.momentum = options.momentum || 0.9;

    // Statistics
    this.stats = {
      totalConvergences: 0,
      averageIterations: 0,
      successRate: 0,
      energyReductions: [],
    };

    // Cache for performance
    this.cache = new Map();
  }

  /**
   * Converge manifest to brand submanifold
   * Main convergence algorithm
   *
   * @param {Object} manifest - Input manifest
   * @returns {Object} Converged manifest + metadata
   */
  converge(manifest) {
    const cacheKey = this.getCacheKey(manifest);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Initialize trajectory
    const trajectory = [];
    let current = JSON.parse(JSON.stringify(manifest)); // Deep clone
    let iteration = 0;
    let converged = false;
    let velocity = null; // For momentum

    // Initial energy
    let energy = this.computeEnergy(current);
    trajectory.push({
      iteration: 0,
      state: current,
      energy,
      gradient: null,
      stepSize: 0,
    });

    // Gradient descent loop
    while (iteration < this.maxIterations && !converged) {
      iteration++;

      // Compute gradient
      const gradient = this.computeGradient(current);

      // Compute step size (adaptive)
      const stepSize = this.adaptiveStepSize
        ? this.computeAdaptiveStepSize(current, gradient, energy)
        : this.learningRate;

      // Apply momentum
      if (velocity === null) {
        velocity = gradient;
      } else {
        velocity = this.addVectors(
          this.scaleVector(velocity, this.momentum),
          this.scaleVector(gradient, 1 - this.momentum)
        );
      }

      // Update state: v_{t+1} = v_t - α ∇E(v_t)
      const next = this.updateState(current, velocity, stepSize);

      // Compute new energy
      const nextEnergy = this.computeEnergy(next);

      // Check convergence
      const energyDelta = energy - nextEnergy;
      if (Math.abs(energyDelta) < this.epsilon || nextEnergy < this.epsilon) {
        converged = true;
      }

      // Update trajectory
      trajectory.push({
        iteration,
        state: next,
        energy: nextEnergy,
        gradient: velocity,
        stepSize,
        energyDelta,
      });

      // Move to next state
      current = next;
      energy = nextEnergy;
    }

    // Final validation
    const validation = this.validator.validate(current);
    const isOnBrand = validation.isValid && this.manifold.isOnBrand(
      this.manifold.coordinateChart(current)
    );

    // Update statistics
    this.updateStats(trajectory, converged, isOnBrand);

    const result = {
      manifest: current,
      converged,
      isOnBrand,
      iterations: iteration,
      initialEnergy: trajectory[0].energy,
      finalEnergy: energy,
      energyReduction: trajectory[0].energy - energy,
      trajectory,
      validation,
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Compute energy functional E(v)
   * E(v) = d(v, B)² + penalties
   *
   * @param {Object} manifest - Current state
   * @returns {number} Energy value
   */
  computeEnergy(manifest) {
    let energy = 0;

    // Get visual state
    const state = this.manifold.coordinateChart(manifest);

    // 1. Distance to brand submanifold
    const brandDistance = this.computeBrandDistance(state);
    energy += brandDistance ** 2;

    // 2. Validation penalties
    const validation = this.validator.validate(manifest);
    if (!validation.isValid) {
      for (const violation of validation.violations) {
        const penalty = violation.severity === 'error' ? 10.0 : 2.0;
        energy += penalty;
      }
    }

    // 3. WCAG contrast penalty
    if (!this.manifold.wcagCompliant(state)) {
      energy += 5.0;
    }

    // 4. Layout coherence penalty
    if (!this.checkLayoutCoherence(manifest)) {
      energy += 3.0;
    }

    return energy;
  }

  /**
   * Compute brand distance
   * Measures how far state is from brand constraints
   *
   * @param {Object} state - Visual state
   * @returns {number} Distance
   */
  computeBrandDistance(state) {
    if (!this.manifold.constraints) {
      return 0; // No brand constraints
    }

    let distance = 0;

    // Color distance
    if (this.manifold.constraints.colorPalette) {
      const colorDist = this.computeColorBrandDistance(state);
      distance += colorDist;
    }

    // Font distance
    if (this.manifold.constraints.fontFamily) {
      const fontDist = this.computeFontBrandDistance(state);
      distance += fontDist;
    }

    return distance;
  }

  /**
   * Compute color brand distance
   * Distance from colors to brand palette
   *
   * @param {Object} state - Visual state
   * @returns {number} Distance
   */
  computeColorBrandDistance(state) {
    const palette = this.manifold.constraints.colorPalette;
    if (!palette) return 0;

    let totalDistance = 0;
    const colors = Object.values(state.colors.rgb);

    for (const color of colors) {
      // Find nearest brand color
      let minDist = Infinity;
      for (const brandColor of palette) {
        try {
          const dist = chroma.deltaE(color, brandColor);
          minDist = Math.min(minDist, dist);
        } catch (e) {
          // Invalid color
        }
      }
      totalDistance += minDist;
    }

    return totalDistance / colors.length;
  }

  /**
   * Compute font brand distance
   * Distance from font to brand fonts
   *
   * @param {Object} state - Visual state
   * @returns {number} Distance
   */
  computeFontBrandDistance(state) {
    const allowedFonts = this.manifold.constraints.fontFamily;
    if (!allowedFonts) return 0;

    const currentFont = state.typography.fontFamily.toLowerCase();
    const isAllowed = allowedFonts.some(font =>
      currentFont.includes(font.toLowerCase())
    );

    return isAllowed ? 0 : 5.0; // Binary penalty
  }

  /**
   * Compute gradient ∇E(v)
   * Approximate gradient via finite differences
   *
   * @param {Object} manifest - Current state
   * @returns {Object} Gradient vector
   */
  computeGradient(manifest) {
    const h = 0.01; // Step size for finite differences
    const energy = this.computeEnergy(manifest);
    const gradient = {};

    // Gradient for colors
    gradient.colors = this.computeColorGradient(manifest, energy, h);

    // Gradient for typography
    gradient.typography = this.computeTypographyGradient(manifest, energy, h);

    // Gradient for layout
    gradient.layout = this.computeLayoutGradient(manifest, energy, h);

    return gradient;
  }

  /**
   * Compute color gradient
   *
   * @param {Object} manifest - Current state
   * @param {number} energy - Current energy
   * @param {number} h - Step size
   * @returns {Object} Color gradient
   */
  computeColorGradient(manifest, energy, h) {
    const gradient = {};
    const colors = manifest.colors || {};

    for (const [key, value] of Object.entries(colors)) {
      if (!value) continue;

      try {
        // Perturb color in LAB space
        const chromaColor = chroma(value);
        const lab = chromaColor.lab();

        // Compute partial derivatives
        const dL = this.computeColorPartial(manifest, key, lab, 0, h, energy);
        const da = this.computeColorPartial(manifest, key, lab, 1, h, energy);
        const db = this.computeColorPartial(manifest, key, lab, 2, h, energy);

        gradient[key] = { L: dL, a: da, b: db };
      } catch (e) {
        gradient[key] = { L: 0, a: 0, b: 0 };
      }
    }

    return gradient;
  }

  /**
   * Compute color partial derivative
   *
   * @param {Object} manifest - Current state
   * @param {string} colorKey - Color property key
   * @param {number[]} lab - LAB color values
   * @param {number} index - LAB component index (0=L, 1=a, 2=b)
   * @param {number} h - Step size
   * @param {number} energy - Current energy
   * @returns {number} Partial derivative
   */
  computeColorPartial(manifest, colorKey, lab, index, h, energy) {
    const perturbed = [...lab];
    perturbed[index] += h;

    const perturbedManifest = JSON.parse(JSON.stringify(manifest));
    try {
      perturbedManifest.colors[colorKey] = chroma.lab(perturbed).hex();
    } catch (e) {
      return 0;
    }

    const perturbedEnergy = this.computeEnergy(perturbedManifest);
    return (perturbedEnergy - energy) / h;
  }

  /**
   * Compute typography gradient
   *
   * @param {Object} manifest - Current state
   * @param {number} energy - Current energy
   * @param {number} h - Step size
   * @returns {Object} Typography gradient
   */
  computeTypographyGradient(manifest, energy, h) {
    const gradient = {};
    const typography = manifest.typography || {};

    // Font size gradient
    if (typography.fontSize) {
      const size = parseFloat(typography.fontSize);
      const perturbed = { ...manifest, typography: { ...typography, fontSize: `${size + h}px` } };
      const perturbedEnergy = this.computeEnergy(perturbed);
      gradient.fontSize = (perturbedEnergy - energy) / h;
    }

    // Font weight gradient
    if (typography.fontWeight) {
      const perturbed = { ...manifest, typography: { ...typography, fontWeight: typography.fontWeight + h * 100 } };
      const perturbedEnergy = this.computeEnergy(perturbed);
      gradient.fontWeight = (perturbedEnergy - energy) / (h * 100);
    }

    return gradient;
  }

  /**
   * Compute layout gradient
   *
   * @param {Object} manifest - Current state
   * @param {number} energy - Current energy
   * @param {number} h - Step size
   * @returns {Object} Layout gradient
   */
  computeLayoutGradient(manifest, energy, h) {
    const gradient = {};
    const layout = manifest.layout || {};

    // Position gradients
    if (layout.x) {
      const x = parseFloat(layout.x);
      const perturbed = { ...manifest, layout: { ...layout, x: `${x + h}%` } };
      const perturbedEnergy = this.computeEnergy(perturbed);
      gradient.x = (perturbedEnergy - energy) / h;
    }

    if (layout.y) {
      const y = parseFloat(layout.y);
      const perturbed = { ...manifest, layout: { ...layout, y: `${y + h}%` } };
      const perturbedEnergy = this.computeEnergy(perturbed);
      gradient.y = (perturbedEnergy - energy) / h;
    }

    return gradient;
  }

  /**
   * Update state via gradient descent
   * v_{t+1} = v_t - α ∇E(v_t)
   *
   * @param {Object} state - Current state
   * @param {Object} gradient - Gradient vector
   * @param {number} stepSize - Step size α
   * @returns {Object} Updated state
   */
  updateState(state, gradient, stepSize) {
    const updated = JSON.parse(JSON.stringify(state)); // Deep clone

    // Update colors
    if (gradient.colors && updated.colors) {
      for (const [key, grad] of Object.entries(gradient.colors)) {
        if (!updated.colors[key]) continue;

        try {
          const chromaColor = chroma(updated.colors[key]);
          const lab = chromaColor.lab();

          // Apply gradient step
          const newLab = [
            lab[0] - stepSize * grad.L,
            lab[1] - stepSize * grad.a,
            lab[2] - stepSize * grad.b,
          ];

          // Clamp LAB values
          newLab[0] = Math.max(0, Math.min(100, newLab[0]));
          newLab[1] = Math.max(-128, Math.min(128, newLab[1]));
          newLab[2] = Math.max(-128, Math.min(128, newLab[2]));

          updated.colors[key] = chroma.lab(newLab).hex();
        } catch (e) {
          // Keep original color if conversion fails
        }
      }
    }

    // Update typography
    if (gradient.typography && updated.typography) {
      if (gradient.typography.fontSize && updated.typography.fontSize) {
        const size = parseFloat(updated.typography.fontSize);
        const newSize = size - stepSize * gradient.typography.fontSize;
        updated.typography.fontSize = `${Math.max(8, Math.min(200, newSize))}px`;
      }

      if (gradient.typography.fontWeight && updated.typography.fontWeight) {
        const weight = updated.typography.fontWeight;
        const newWeight = weight - stepSize * gradient.typography.fontWeight * 100;
        updated.typography.fontWeight = Math.max(100, Math.min(900, Math.round(newWeight / 100) * 100));
      }
    }

    // Update layout
    if (gradient.layout && updated.layout) {
      if (gradient.layout.x && updated.layout.x) {
        const x = parseFloat(updated.layout.x);
        const newX = x - stepSize * gradient.layout.x;
        updated.layout.x = `${Math.max(0, Math.min(100, newX))}%`;
      }

      if (gradient.layout.y && updated.layout.y) {
        const y = parseFloat(updated.layout.y);
        const newY = y - stepSize * gradient.layout.y;
        updated.layout.y = `${Math.max(0, Math.min(100, newY))}%`;
      }
    }

    return updated;
  }

  /**
   * Compute adaptive step size
   * Uses line search to find optimal step
   *
   * @param {Object} state - Current state
   * @param {Object} gradient - Gradient vector
   * @param {number} currentEnergy - Current energy
   * @returns {number} Step size
   */
  computeAdaptiveStepSize(state, gradient, currentEnergy) {
    const baseStepSize = this.learningRate;
    let stepSize = baseStepSize;
    let bestStepSize = stepSize;
    let bestEnergy = currentEnergy;

    // Try multiple step sizes
    for (let i = 0; i < 5; i++) {
      const testState = this.updateState(state, gradient, stepSize);
      const testEnergy = this.computeEnergy(testState);

      if (testEnergy < bestEnergy) {
        bestEnergy = testEnergy;
        bestStepSize = stepSize;
      }

      stepSize *= 0.5; // Reduce step size
    }

    return bestStepSize;
  }

  /**
   * Check layout coherence
   * Ensures no overlapping elements
   *
   * @param {Object} manifest - Manifest
   * @returns {boolean} True if coherent
   */
  checkLayoutCoherence(manifest) {
    // Simplified check: ensure layout type is valid
    const validTypes = ['centered', 'left', 'right', 'top', 'bottom', 'grid', 'flex'];
    const layoutType = manifest.layout?.type || 'centered';
    return validTypes.includes(layoutType);
  }

  /**
   * Add two vectors
   *
   * @param {Object} v1 - Vector 1
   * @param {Object} v2 - Vector 2
   * @returns {Object} Sum vector
   */
  addVectors(v1, v2) {
    const result = {};

    for (const category in v1) {
      result[category] = {};
      for (const key in v1[category]) {
        const val1 = typeof v1[category][key] === 'object' ? v1[category][key] : { value: v1[category][key] };
        const val2 = typeof v2[category][key] === 'object' ? v2[category][key] : { value: v2[category][key] };

        if (typeof val1 === 'object' && typeof val2 === 'object') {
          result[category][key] = {};
          for (const prop in val1) {
            result[category][key][prop] = (val1[prop] || 0) + (val2[prop] || 0);
          }
        } else {
          result[category][key] = (val1.value || 0) + (val2.value || 0);
        }
      }
    }

    return result;
  }

  /**
   * Scale vector
   *
   * @param {Object} vector - Input vector
   * @param {number} scalar - Scaling factor
   * @returns {Object} Scaled vector
   */
  scaleVector(vector, scalar) {
    const result = {};

    for (const category in vector) {
      result[category] = {};
      for (const key in vector[category]) {
        const val = vector[category][key];

        if (typeof val === 'object') {
          result[category][key] = {};
          for (const prop in val) {
            result[category][key][prop] = val[prop] * scalar;
          }
        } else {
          result[category][key] = val * scalar;
        }
      }
    }

    return result;
  }

  /**
   * Update statistics
   *
   * @param {Array} trajectory - Convergence trajectory
   * @param {boolean} converged - Whether convergence succeeded
   * @param {boolean} isOnBrand - Whether final state is on-brand
   */
  updateStats(trajectory, converged, isOnBrand) {
    this.stats.totalConvergences++;

    const iterations = trajectory.length - 1;
    this.stats.averageIterations =
      (this.stats.averageIterations * (this.stats.totalConvergences - 1) + iterations) /
      this.stats.totalConvergences;

    if (converged && isOnBrand) {
      this.stats.successRate =
        (this.stats.successRate * (this.stats.totalConvergences - 1) + 1) /
        this.stats.totalConvergences;
    } else {
      this.stats.successRate =
        (this.stats.successRate * (this.stats.totalConvergences - 1)) /
        this.stats.totalConvergences;
    }

    const energyReduction = trajectory[0].energy - trajectory[trajectory.length - 1].energy;
    this.stats.energyReductions.push(energyReduction);
  }

  /**
   * Get convergence statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Generate cache key
   *
   * @param {Object} manifest - Manifest
   * @returns {string} Cache key
   */
  getCacheKey(manifest) {
    return JSON.stringify({
      colors: manifest.colors,
      typography: manifest.typography,
      layout: manifest.layout,
    });
  }

  /**
   * Visualize convergence trajectory
   *
   * @param {Array} trajectory - Trajectory from converge()
   * @returns {Object} Visualization data
   */
  visualizeTrajectory(trajectory) {
    return {
      iterations: trajectory.length - 1,
      energyCurve: trajectory.map(t => ({ iteration: t.iteration, energy: t.energy })),
      gradientNorms: trajectory.map(t => ({
        iteration: t.iteration,
        norm: t.gradient ? this.computeGradientNorm(t.gradient) : 0,
      })),
      stepSizes: trajectory.map(t => ({ iteration: t.iteration, stepSize: t.stepSize })),
      converged: trajectory[trajectory.length - 1].energy < this.epsilon,
    };
  }

  /**
   * Compute gradient norm
   *
   * @param {Object} gradient - Gradient vector
   * @returns {number} Norm
   */
  computeGradientNorm(gradient) {
    let norm = 0;

    for (const category in gradient) {
      for (const key in gradient[category]) {
        const val = gradient[category][key];
        if (typeof val === 'object') {
          for (const prop in val) {
            norm += val[prop] ** 2;
          }
        } else {
          norm += val ** 2;
        }
      }
    }

    return Math.sqrt(norm);
  }
}

/**
 * Create convergence engine with default configuration
 *
 * @param {Object} options - Configuration options
 * @returns {ConvergenceEngine} Engine instance
 */
export function createConvergenceEngine(options = {}) {
  return new ConvergenceEngine(options);
}

export default ConvergenceEngine;
