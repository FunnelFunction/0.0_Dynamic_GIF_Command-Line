/**
 * CLI COMMAND EXECUTOR
 *
 * Executes CLI commands by coordinating:
 * - Parser (command → manifest)
 * - Lattice Brain (manifest → resolved visual state)
 * - Rendering Pipeline (visual state → GIF/PNG/SVG)
 *
 * Provides the main execution interface for the application.
 *
 * @module cli/executor
 */

import { parse, serialize, validateSyntax } from './parser.js';
import { LatticeBrain, ResolutionMode } from '../core/lattice.js';
import { validateIdentifierValue } from './syntax.js';

/**
 * Execution result types
 */
export const ExecutionStatus = {
  SUCCESS: 'success',
  PARTIAL: 'partial', // Executed with warnings
  FAILED: 'failed',   // Execution failed
};

/**
 * Command Executor
 *
 * Main execution engine for CLI commands.
 */
export class CommandExecutor {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Lattice brain
    this.lattice = options.lattice || new LatticeBrain({
      brandProfile: options.brandProfile,
      profiles: options.profiles,
      scenes: options.scenes,
      mode: options.mode || ResolutionMode.BALANCED,
    });

    // Rendering pipeline (optional, will be set later)
    this.renderer = options.renderer || null;

    // Execution options
    this.validateBeforeExecution = options.validateBeforeExecution !== false;
    this.autoRepair = options.autoRepair !== false;

    // Statistics
    this.stats = {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      averageExecutionTime: 0,
    };

    // History
    this.history = [];
  }

  /**
   * Execute CLI command
   *
   * Main execution flow:
   * 1. Parse command → manifest
   * 2. Validate syntax
   * 3. Validate values
   * 4. Resolve via lattice brain
   * 5. Render (optional)
   *
   * @param {string} command - CLI command string
   * @param {Object} options - Execution options
   * @returns {Object} Execution result
   */
  async execute(command, options = {}) {
    const startTime = performance.now();
    const result = {
      command,
      status: ExecutionStatus.SUCCESS,
      manifest: null,
      resolved: null,
      rendered: null,
      errors: [],
      warnings: [],
      metadata: {
        executionTime: 0,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Step 1: Parse command
      result.manifest = parse(command);

      // Check parse errors
      if (result.manifest._errors) {
        for (const error of result.manifest._errors) {
          result.warnings.push({
            stage: 'parse',
            message: error.error,
            statement: error.statement,
          });
        }
      }

      // Step 2: Validate syntax
      if (this.validateBeforeExecution) {
        const syntaxValidation = validateSyntax(command);
        if (!syntaxValidation.valid) {
          for (const error of syntaxValidation.errors) {
            result.errors.push({
              stage: 'syntax',
              message: error.message,
              type: error.type,
            });
          }
        }
      }

      // Step 3: Validate values
      if (this.validateBeforeExecution) {
        const valueErrors = this.validateManifestValues(result.manifest);
        if (valueErrors.length > 0) {
          result.warnings.push(...valueErrors);
        }
      }

      // Stop if critical errors
      if (result.errors.length > 0) {
        result.status = ExecutionStatus.FAILED;
        return result;
      }

      // Step 4: Resolve via lattice brain
      const resolution = this.lattice.resolve(result.manifest);
      result.resolved = resolution;

      // Check resolution success
      if (!resolution.metadata.guarantees.allGuarantees) {
        result.warnings.push({
          stage: 'resolution',
          message: 'Not all mathematical guarantees satisfied',
          guarantees: resolution.metadata.guarantees,
        });
      }

      // Step 5: Render (if renderer available and requested)
      if (this.renderer && options.render !== false) {
        try {
          result.rendered = await this.renderer.render(resolution.final, options.renderOptions);
        } catch (error) {
          result.errors.push({
            stage: 'render',
            message: error.message,
          });
        }
      }

      // Set final status
      if (result.warnings.length > 0) {
        result.status = ExecutionStatus.PARTIAL;
      }

      // Update stats
      this.stats.successCount++;

    } catch (error) {
      result.status = ExecutionStatus.FAILED;
      result.errors.push({
        stage: 'execution',
        message: error.message,
        stack: error.stack,
      });
      this.stats.failureCount++;
    } finally {
      // Record execution time
      result.metadata.executionTime = performance.now() - startTime;

      // Update stats
      this.stats.totalExecutions++;
      this.stats.averageExecutionTime =
        (this.stats.averageExecutionTime * (this.stats.totalExecutions - 1) +
          result.metadata.executionTime) /
        this.stats.totalExecutions;

      // Add to history
      this.addToHistory(result);
    }

    return result;
  }

  /**
   * Execute multiple commands in batch
   *
   * @param {Array} commands - Array of command strings
   * @param {Object} options - Execution options
   * @returns {Array} Array of execution results
   */
  async executeBatch(commands, options = {}) {
    const results = [];

    for (const command of commands) {
      const result = await this.execute(command, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Dry run (execute without rendering)
   *
   * @param {string} command - CLI command
   * @returns {Object} Execution result (no render)
   */
  async dryRun(command) {
    return this.execute(command, { render: false });
  }

  /**
   * Preview command
   *
   * Returns what would be executed without actually executing.
   *
   * @param {string} command - CLI command
   * @returns {Object} Preview data
   */
  preview(command) {
    const manifest = parse(command);
    const syntaxValidation = validateSyntax(command);

    return {
      command,
      manifest,
      syntaxValid: syntaxValidation.valid,
      syntaxErrors: syntaxValidation.errors,
      serialized: serialize(manifest),
      estimatedProperties: this.estimateOutputProperties(manifest),
    };
  }

  /**
   * Validate manifest values
   *
   * @param {Object} manifest - Parsed manifest
   * @returns {Array} Validation warnings
   */
  validateManifestValues(manifest) {
    const warnings = [];

    // Validate colors
    if (manifest.colors) {
      for (const [key, value] of Object.entries(manifest.colors)) {
        const validation = validateIdentifierValue(`colors.${key}`, value);
        if (!validation.valid) {
          warnings.push({
            stage: 'validation',
            property: `colors.${key}`,
            value,
            message: validation.error,
          });
        }
      }
    }

    // Validate typography
    if (manifest.typography) {
      for (const [key, value] of Object.entries(manifest.typography)) {
        const validation = validateIdentifierValue(`typography.${key}`, value);
        if (!validation.valid) {
          warnings.push({
            stage: 'validation',
            property: `typography.${key}`,
            value,
            message: validation.error,
          });
        }
      }
    }

    // Validate layout
    if (manifest.layout) {
      for (const [key, value] of Object.entries(manifest.layout)) {
        const validation = validateIdentifierValue(`layout.${key}`, value);
        if (!validation.valid) {
          warnings.push({
            stage: 'validation',
            property: `layout.${key}`,
            value,
            message: validation.error,
          });
        }
      }
    }

    return warnings;
  }

  /**
   * Estimate output properties
   *
   * Predicts what the output will contain.
   *
   * @param {Object} manifest - Manifest
   * @returns {Object} Estimated properties
   */
  estimateOutputProperties(manifest) {
    return {
      hasText: !!manifest.text,
      hasAnimation: !!(manifest.motion && manifest.motion.animation && manifest.motion.animation !== 'none'),
      hasEffects: !!(manifest.effects && Object.values(manifest.effects).some(v => v && v !== 'none')),
      hasProfile: !!manifest.profile,
      hasScene: !!manifest.scene,
      colorCount: manifest.colors ? Object.keys(manifest.colors).length : 0,
      estimatedComplexity: this.calculateComplexity(manifest),
    };
  }

  /**
   * Calculate manifest complexity
   *
   * @param {Object} manifest - Manifest
   * @returns {string} Complexity level
   */
  calculateComplexity(manifest) {
    let score = 0;

    if (manifest.text) score += 1;
    if (manifest.scene) score += 1;
    if (manifest.profile) score += 2;
    if (manifest.colors) score += Object.keys(manifest.colors).length * 0.5;
    if (manifest.typography) score += Object.keys(manifest.typography).length * 0.3;
    if (manifest.layout && manifest.layout.type !== 'centered') score += 1;
    if (manifest.motion && manifest.motion.animation !== 'none') score += 2;
    if (manifest.effects) score += Object.keys(manifest.effects).length * 0.8;

    if (score < 3) return 'simple';
    if (score < 8) return 'moderate';
    return 'complex';
  }

  /**
   * Add to history
   *
   * @param {Object} result - Execution result
   */
  addToHistory(result) {
    this.history.unshift({
      command: result.command,
      status: result.status,
      timestamp: result.metadata.timestamp,
      executionTime: result.metadata.executionTime,
    });

    // Keep last 100 commands
    this.history = this.history.slice(0, 100);
  }

  /**
   * Get execution history
   *
   * @param {number} limit - Maximum number of results
   * @returns {Array} Recent executions
   */
  getHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  /**
   * Get execution statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.totalExecutions > 0
        ? this.stats.successCount / this.stats.totalExecutions
        : 0,
      latticeStats: this.lattice.getStats(),
    };
  }

  /**
   * Set renderer
   *
   * @param {Object} renderer - Rendering pipeline
   */
  setRenderer(renderer) {
    this.renderer = renderer;
  }

  /**
   * Update resolution mode
   *
   * @param {string} mode - Resolution mode
   */
  setMode(mode) {
    this.lattice.setMode(mode);
  }

  /**
   * Update brand profile
   *
   * @param {Object} profile - Brand profile
   */
  updateBrandProfile(profile) {
    this.lattice.updateBrandProfile(profile);
  }

  /**
   * Register profile
   *
   * @param {string} name - Profile name
   * @param {Object} profile - Profile data
   */
  registerProfile(name, profile) {
    this.lattice.registerProfile(name, profile);
  }

  /**
   * Register scene
   *
   * @param {string} name - Scene name
   * @param {Object} scene - Scene data
   */
  registerScene(name, scene) {
    this.lattice.registerScene(name, scene);
  }

  /**
   * Clear caches
   */
  clearCache() {
    this.lattice.clearCache();
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      averageExecutionTime: 0,
    };
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }
}

/**
 * Create command executor
 *
 * @param {Object} options - Configuration options
 * @returns {CommandExecutor} Executor instance
 */
export function createCommandExecutor(options = {}) {
  return new CommandExecutor(options);
}

/**
 * Quick execute
 *
 * One-shot execution without creating executor instance.
 *
 * @param {string} command - CLI command
 * @param {Object} options - Options
 * @returns {Object} Execution result
 */
export async function quickExecute(command, options = {}) {
  const executor = createCommandExecutor(options);
  return executor.execute(command, options);
}

export default {
  CommandExecutor,
  ExecutionStatus,
  createCommandExecutor,
  quickExecute,
};
