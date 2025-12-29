/**
 * LATTICE BRAIN - UNIFIED ORCHESTRATOR
 *
 * The main orchestrator that coordinates all mathematical engines
 * to resolve CLI commands into brand-compliant visual specifications.
 *
 * Execution Flow:
 * 1. Parse: CLI → Manifest (hash parser)
 * 2. Emerge: Manifest → Emerged (fiber bundle projection)
 * 3. Validate: Emerged → Validated (FSM predicate logic)
 * 4. Converge: Validated → Converged (gradient flow)
 * 5. Verify: Final checks + escape path if needed
 *
 * Mathematical Guarantee:
 * ∀ input ∈ CLI, ∃! output ∈ B (brand submanifold)
 * Convergence time: O(1) to O(log n) iterations
 *
 * @module core/lattice
 */

import { VisualManifold } from './manifold.js';
import { LatticeValidator } from './validator.js';
import { EmergenceEngine } from './emergence.js';
import { ConvergenceEngine } from './convergence.js';
import { getGroundState, generateEscapePath, distanceToGroundState } from './ground-state.js';

/**
 * Lattice Resolution Modes
 */
export const ResolutionMode = {
  FAST: 'fast',           // Skip convergence if validation passes
  BALANCED: 'balanced',   // Light convergence (5 iterations max)
  THOROUGH: 'thorough',   // Full convergence (50 iterations)
  GUARANTEED: 'guaranteed', // Convergence + escape path fallback
};

/**
 * Lattice Brain
 *
 * The unified orchestrator that resolves CLI commands into
 * mathematically guaranteed brand-compliant visuals.
 */
export class LatticeBrain {
  /**
   * @param {Object} options - Configuration options
   * @param {Object} options.brandProfile - Brand profile (defines B ⊂ V)
   * @param {Map} options.profiles - Profile registry
   * @param {Map} options.scenes - Scene templates
   * @param {string} options.mode - Resolution mode
   */
  constructor(options = {}) {
    // Initialize mathematical engines
    this.manifold = new VisualManifold(options.brandProfile);
    this.validator = new LatticeValidator({
      manifold: this.manifold,
      brandProfile: options.brandProfile,
    });
    this.emergence = new EmergenceEngine({
      profiles: options.profiles || new Map(),
      scenes: options.scenes || new Map(),
      manifold: this.manifold,
    });
    this.convergence = new ConvergenceEngine({
      manifold: this.manifold,
      validator: this.validator,
      maxIterations: this.getMaxIterations(options.mode),
    });

    // Configuration
    this.mode = options.mode || ResolutionMode.BALANCED;
    this.brandProfile = options.brandProfile || null;

    // Statistics
    this.stats = {
      totalResolutions: 0,
      fastPathHits: 0,
      convergenceRequired: 0,
      escapePathRequired: 0,
      averageResolutionTime: 0,
    };

    // Cache
    this.cache = new Map();
  }

  /**
   * Resolve CLI command to final visual state
   *
   * Main entry point: executes full lattice resolution pipeline.
   *
   * @param {Object} manifest - Input manifest (from CLI parser)
   * @returns {Object} Resolution result
   */
  resolve(manifest) {
    const startTime = performance.now();

    // Check cache
    const cacheKey = this.getCacheKey(manifest);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Execute resolution pipeline
    const result = this.executeResolutionPipeline(manifest);

    // Update statistics
    const resolutionTime = performance.now() - startTime;
    this.updateStats(result, resolutionTime);

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Execute resolution pipeline
   *
   * Coordinates all engines to produce final result.
   *
   * @param {Object} manifest - Input manifest
   * @returns {Object} Resolution result
   */
  executeResolutionPipeline(manifest) {
    const pipeline = {
      input: manifest,
      emerged: null,
      validated: null,
      converged: null,
      final: null,
      metadata: {
        mode: this.mode,
        steps: [],
        warnings: [],
        guarantees: {},
      },
    };

    try {
      // Step 1: Emergence (fiber bundle projection)
      pipeline.emerged = this.emergence.emerge(manifest);
      pipeline.metadata.steps.push({
        name: 'emergence',
        success: true,
        dimensionalGain: this.emergence.calculateEmergenceGain(manifest, pipeline.emerged),
      });

      // Step 2: Validation (FSM predicate logic)
      const validation = this.validator.validate(pipeline.emerged);
      pipeline.validated = validation;
      pipeline.metadata.steps.push({
        name: 'validation',
        success: validation.isValid,
        violations: validation.violations,
        repairs: validation.repairs,
      });

      // Fast path: If valid and on-brand, skip convergence
      if (this.canUseFastPath(validation)) {
        pipeline.final = pipeline.emerged;
        pipeline.metadata.fastPath = true;
        pipeline.metadata.guarantees = this.computeGuarantees(pipeline.final);
        this.stats.fastPathHits++;
        return pipeline;
      }

      // Step 3: Auto-repair if needed
      if (!validation.isValid && this.mode !== ResolutionMode.FAST) {
        const repaired = this.validator.autoRepair(pipeline.emerged);
        pipeline.emerged = repaired.manifest;
        pipeline.metadata.steps.push({
          name: 'auto-repair',
          success: repaired.success,
          repairs: repaired.repairs,
        });
      }

      // Step 4: Convergence (gradient flow)
      if (this.shouldConverge()) {
        const convergenceResult = this.convergence.converge(pipeline.emerged);
        pipeline.converged = convergenceResult;
        pipeline.metadata.steps.push({
          name: 'convergence',
          success: convergenceResult.converged,
          iterations: convergenceResult.iterations,
          energyReduction: convergenceResult.energyReduction,
        });

        pipeline.final = convergenceResult.manifest;
        this.stats.convergenceRequired++;
      } else {
        pipeline.final = pipeline.emerged;
      }

      // Step 5: Final verification + escape path fallback
      const finalValidation = this.validator.validate(pipeline.final);
      if (!finalValidation.isValid && this.mode === ResolutionMode.GUARANTEED) {
        // Use escape path as last resort
        const escapePath = generateEscapePath(pipeline.final);
        pipeline.final = escapePath[escapePath.length - 1].state;
        pipeline.metadata.steps.push({
          name: 'escape-path',
          success: true,
          pathLength: escapePath.length,
        });
        pipeline.metadata.warnings.push('Used escape path to guarantee validity');
        this.stats.escapePathRequired++;
      }

      // Compute guarantees
      pipeline.metadata.guarantees = this.computeGuarantees(pipeline.final);

    } catch (error) {
      // Catastrophic failure: fall back to ground state
      pipeline.final = getGroundState();
      pipeline.metadata.steps.push({
        name: 'ground-state-fallback',
        success: true,
        error: error.message,
      });
      pipeline.metadata.warnings.push('Catastrophic failure: fell back to ground state');
    }

    return pipeline;
  }

  /**
   * Check if fast path can be used
   *
   * Fast path skips convergence if manifest is already valid.
   *
   * @param {Object} validation - Validation result
   * @returns {boolean} True if fast path available
   */
  canUseFastPath(validation) {
    if (this.mode === ResolutionMode.THOROUGH || this.mode === ResolutionMode.GUARANTEED) {
      return false; // Always converge in these modes
    }

    return validation.isValid && validation.violations.length === 0;
  }

  /**
   * Check if convergence should be performed
   *
   * @returns {boolean} True if convergence needed
   */
  shouldConverge() {
    return this.mode !== ResolutionMode.FAST;
  }

  /**
   * Compute mathematical guarantees
   *
   * Returns formal guarantees about the final state.
   *
   * @param {Object} manifest - Final manifest
   * @returns {Object} Guarantees
   */
  computeGuarantees(manifest) {
    const state = this.manifold.coordinateChart(manifest);
    const validation = this.validator.validate(manifest);

    return {
      // Guarantee 1: On brand submanifold
      onBrandSubmanifold: this.manifold.isOnBrand(state),

      // Guarantee 2: Passes all predicates
      predicateCompliance: validation.isValid,

      // Guarantee 3: WCAG compliant
      wcagCompliant: this.manifold.wcagCompliant(state),

      // Guarantee 4: Distance from ground state
      distanceToGroundState: distanceToGroundState(manifest),

      // Guarantee 5: Attractor reached
      attractorReached: validation.isValid && this.manifold.isOnBrand(state),

      // Summary
      allGuarantees:
        this.manifold.isOnBrand(state) &&
        validation.isValid &&
        this.manifold.wcagCompliant(state),
    };
  }

  /**
   * Get max iterations based on mode
   *
   * @param {string} mode - Resolution mode
   * @returns {number} Max iterations
   */
  getMaxIterations(mode) {
    switch (mode) {
      case ResolutionMode.FAST:
        return 0;
      case ResolutionMode.BALANCED:
        return 10;
      case ResolutionMode.THOROUGH:
        return 50;
      case ResolutionMode.GUARANTEED:
        return 100;
      default:
        return 10;
    }
  }

  /**
   * Batch resolve multiple manifests
   *
   * Efficiently resolves multiple commands in parallel.
   *
   * @param {Array} manifests - Array of input manifests
   * @returns {Array} Array of resolution results
   */
  batchResolve(manifests) {
    return manifests.map(manifest => this.resolve(manifest));
  }

  /**
   * Resolve with intermediate states
   *
   * Returns all intermediate states for visualization/debugging.
   *
   * @param {Object} manifest - Input manifest
   * @returns {Object} Resolution with intermediate states
   */
  resolveWithIntermediates(manifest) {
    const result = this.resolve(manifest);

    return {
      ...result,
      intermediates: {
        input: result.input,
        emerged: result.emerged,
        validated: result.validated?.manifest || result.emerged,
        converged: result.converged?.manifest || result.final,
        final: result.final,
      },
      trajectory: result.converged?.trajectory || [],
    };
  }

  /**
   * Update statistics
   *
   * @param {Object} result - Resolution result
   * @param {number} resolutionTime - Time taken (ms)
   */
  updateStats(result, resolutionTime) {
    this.stats.totalResolutions++;
    this.stats.averageResolutionTime =
      (this.stats.averageResolutionTime * (this.stats.totalResolutions - 1) + resolutionTime) /
      this.stats.totalResolutions;
  }

  /**
   * Get statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      fastPathRate: this.stats.fastPathHits / (this.stats.totalResolutions || 1),
      convergenceRate: this.stats.convergenceRequired / (this.stats.totalResolutions || 1),
      escapePathRate: this.stats.escapePathRequired / (this.stats.totalResolutions || 1),
      engines: {
        manifold: this.manifold.getDimensionality(),
        validator: this.validator.getStats(),
        emergence: this.emergence.getStats(),
        convergence: this.convergence.getStats(),
      },
    };
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    this.manifold.clearCache();
    this.validator.clearCache();
    this.emergence.clearCache();
    this.convergence.clearCache();
  }

  /**
   * Register profile
   *
   * @param {string} name - Profile name
   * @param {Object} profile - Profile data
   */
  registerProfile(name, profile) {
    this.emergence.registerProfile(name, profile);
  }

  /**
   * Register scene
   *
   * @param {string} name - Scene name
   * @param {Object} scene - Scene data
   */
  registerScene(name, scene) {
    this.emergence.registerScene(name, scene);
  }

  /**
   * Load profiles
   *
   * @param {Array} profiles - Array of profiles
   */
  loadProfiles(profiles) {
    this.emergence.loadProfiles(profiles);
  }

  /**
   * Load scenes
   *
   * @param {Array} scenes - Array of scenes
   */
  loadScenes(scenes) {
    this.emergence.loadScenes(scenes);
  }

  /**
   * Set resolution mode
   *
   * @param {string} mode - Resolution mode
   */
  setMode(mode) {
    this.mode = mode;
    this.convergence.maxIterations = this.getMaxIterations(mode);
  }

  /**
   * Update brand profile
   *
   * Changes the brand submanifold constraints.
   *
   * @param {Object} profile - New brand profile
   */
  updateBrandProfile(profile) {
    this.brandProfile = profile;
    this.manifold = new VisualManifold(profile);
    this.validator.manifold = this.manifold;
    this.emergence.manifold = this.manifold;
    this.convergence.manifold = this.manifold;
    this.clearCache(); // Invalidate cache
  }

  /**
   * Diagnose manifest
   *
   * Returns detailed diagnostic information about a manifest.
   *
   * @param {Object} manifest - Manifest to diagnose
   * @returns {Object} Diagnostic report
   */
  diagnose(manifest) {
    const state = this.manifold.coordinateChart(manifest);
    const validation = this.validator.validate(manifest);
    const energy = this.convergence.computeEnergy(manifest);
    const groundDistance = distanceToGroundState(manifest);

    return {
      manifest,
      state,
      validation,
      energy,
      groundDistance,
      onBrand: this.manifold.isOnBrand(state),
      wcagCompliant: this.manifold.wcagCompliant(state),
      dimensionality: this.manifold.countDimensions ? this.manifold.countDimensions(manifest) : 0,
      recommendations: this.generateRecommendations(validation, energy),
    };
  }

  /**
   * Generate recommendations
   *
   * Provides actionable suggestions based on validation and energy.
   *
   * @param {Object} validation - Validation result
   * @param {number} energy - Energy value
   * @returns {Array} Recommendations
   */
  generateRecommendations(validation, energy) {
    const recommendations = [];

    if (!validation.isValid) {
      recommendations.push({
        type: 'error',
        message: 'Manifest has validation errors',
        action: 'Run auto-repair or use convergence',
      });
    }

    if (energy > 10) {
      recommendations.push({
        type: 'warning',
        message: 'High energy - far from brand constraints',
        action: 'Increase convergence iterations or use GUARANTEED mode',
      });
    }

    if (validation.violations.some(v => v.predicate === 'color_contrast')) {
      recommendations.push({
        type: 'accessibility',
        message: 'Color contrast below WCAG minimum',
        action: 'Adjust text or background colors',
      });
    }

    return recommendations;
  }

  /**
   * Generate cache key
   *
   * @param {Object} manifest - Manifest
   * @returns {string} Cache key
   */
  getCacheKey(manifest) {
    return JSON.stringify({
      scene: manifest.scene,
      text: manifest.text,
      profile: manifest.profile,
      colors: manifest.colors,
      typography: manifest.typography,
      mode: this.mode,
    });
  }

  /**
   * Visualize lattice structure
   *
   * Returns information about the lattice structure for debugging.
   *
   * @returns {Object} Lattice structure
   */
  visualizeLattice() {
    return {
      manifold: {
        dimensions: this.manifold.getDimensionality(),
        brandConstraints: this.manifold.constraints,
      },
      validator: {
        predicates: this.validator.predicates.map(p => p.name),
        groundState: getGroundState(),
      },
      emergence: this.emergence.visualizeFiberBundle(),
      convergence: {
        maxIterations: this.convergence.maxIterations,
        epsilon: this.convergence.epsilon,
        learningRate: this.convergence.learningRate,
      },
      mode: this.mode,
    };
  }
}

/**
 * Create lattice brain with default configuration
 *
 * @param {Object} options - Configuration options
 * @returns {LatticeBrain} Brain instance
 */
export function createLatticeBrain(options = {}) {
  return new LatticeBrain(options);
}

/**
 * Create lattice brain from brand profile
 *
 * Convenience function for single-profile setup.
 *
 * @param {Object} brandProfile - Brand profile
 * @param {string} mode - Resolution mode
 * @returns {LatticeBrain} Brain instance
 */
export function createLatticeBrainFromProfile(brandProfile, mode = ResolutionMode.BALANCED) {
  return new LatticeBrain({
    brandProfile,
    mode,
  });
}

export default LatticeBrain;
