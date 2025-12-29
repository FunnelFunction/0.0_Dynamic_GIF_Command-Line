/**
 * VALIDATOR UI
 *
 * Provides UI-friendly formatting for validation results.
 * Converts technical validation output into user-friendly messages.
 *
 * @module cli/validator-ui
 */

/**
 * Format validation result for display
 *
 * @param {Object} result - Validation result from LatticeValidator
 * @returns {Object} Formatted result with UI-friendly messages
 */
export function formatValidationResult(result) {
  if (!result) {
    return {
      status: 'unknown',
      message: 'No validation result',
      details: [],
    };
  }

  if (result.valid) {
    return {
      status: 'success',
      message: '✓ All validation checks passed',
      details: [],
    };
  }

  // Format violations
  const formattedViolations = result.violations.map(formatViolation);

  return {
    status: 'error',
    message: `✗ ${result.violations.length} validation issue${result.violations.length > 1 ? 's' : ''}`,
    details: formattedViolations,
    repairs: result.repairs || [],
  };
}

/**
 * Format a single violation
 *
 * @param {Object} violation - Violation object
 * @returns {Object} Formatted violation
 */
function formatViolation(violation) {
  const { predicate, message, severity } = violation;

  // User-friendly predicate names
  const predicateNames = {
    color_contrast: 'Color Contrast',
    layout_coherence: 'Layout Coherence',
    brand_compliance: 'Brand Compliance',
    animation_physics: 'Animation Physics',
    canvas_validity: 'Canvas Validity',
    text_readability: 'Text Readability',
  };

  // Severity icons
  const severityIcons = {
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  return {
    icon: severityIcons[severity] || '•',
    severity,
    predicate: predicateNames[predicate] || predicate,
    message,
    suggestion: getSuggestion(predicate, message),
  };
}

/**
 * Get suggestion for fixing a violation
 *
 * @param {string} predicate - Predicate name
 * @param {string} message - Violation message
 * @returns {string} Suggestion
 */
function getSuggestion(predicate, message) {
  const suggestions = {
    color_contrast: 'Try using darker text or lighter background colors',
    layout_coherence: 'Adjust element positions to prevent overlapping',
    brand_compliance: 'Use colors from your brand palette',
    animation_physics: 'Check animation duration and easing values',
    canvas_validity: 'Use valid canvas dimensions (e.g., 1:1, 16:9, 1920x1080)',
    text_readability: 'Ensure text content is not empty and font size is readable',
  };

  return suggestions[predicate] || 'Review the configuration and try again';
}

/**
 * Format escape path for display
 *
 * @param {Array} escapePath - Escape path from validator
 * @returns {string} Formatted path description
 */
export function formatEscapePath(escapePath) {
  if (!escapePath || escapePath.length === 0) {
    return 'No escape path needed';
  }

  const steps = escapePath.map((step, index) => {
    return `Step ${index + 1}: Energy ${step.energy.toFixed(4)}`;
  });

  return `Escape path to ground state:\n${steps.join('\n')}`;
}

/**
 * Generate color-coded console output for validation result
 *
 * @param {Object} result - Validation result
 */
export function logValidationResult(result) {
  const formatted = formatValidationResult(result);

  if (formatted.status === 'success') {
    console.log('%c' + formatted.message, 'color: #00ff88; font-weight: bold;');
    return;
  }

  console.log('%c' + formatted.message, 'color: #ff3366; font-weight: bold;');

  formatted.details.forEach((violation) => {
    const color = violation.severity === 'error' ? '#ff3366' : '#ffaa00';
    console.log(
      `%c${violation.icon} ${violation.predicate}`,
      `color: ${color}; font-weight: bold;`
    );
    console.log(`  ${violation.message}`);
    console.log(`  Suggestion: ${violation.suggestion}`);
  });

  if (formatted.repairs && formatted.repairs.length > 0) {
    console.log(
      `%c🔧 ${formatted.repairs.length} auto-repair${formatted.repairs.length > 1 ? 's' : ''} available`,
      'color: #ffaa00; font-weight: bold;'
    );
  }
}

/**
 * Create validation badge HTML
 *
 * @param {Object} result - Validation result
 * @returns {string} HTML string for badge
 */
export function createValidationBadge(result) {
  const formatted = formatValidationResult(result);

  const colors = {
    success: '#00ff88',
    error: '#ff3366',
    warning: '#ffaa00',
  };

  const color = colors[formatted.status] || colors.warning;

  return `
    <div class="validation-badge" style="
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: ${color}20;
      border: 1px solid ${color};
      border-radius: 6px;
      color: ${color};
      font-size: 0.875rem;
      font-weight: 600;
    ">
      <span>${formatted.message}</span>
    </div>
  `;
}

/**
 * Get validation summary statistics
 *
 * @param {Object} result - Validation result
 * @returns {Object} Summary statistics
 */
export function getValidationSummary(result) {
  if (!result) {
    return {
      total: 0,
      errors: 0,
      warnings: 0,
      valid: false,
      repairsAvailable: 0,
    };
  }

  const errors = result.violations?.filter(v => v.severity === 'error').length || 0;
  const warnings = result.violations?.filter(v => v.severity === 'warning').length || 0;

  return {
    total: result.violations?.length || 0,
    errors,
    warnings,
    valid: result.valid,
    repairsAvailable: result.repairs?.length || 0,
  };
}

export default {
  formatValidationResult,
  formatEscapePath,
  logValidationResult,
  createValidationBadge,
  getValidationSummary,
};
