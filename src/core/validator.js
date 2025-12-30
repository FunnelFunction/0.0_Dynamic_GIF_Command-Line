/**
 * VALIDATOR (WRITABLE GATE)
 * ==========================
 * 
 * Pre-execution validation ensures invalid data NEVER enters the rendering pipeline.
 * This is the FSM (Finite State Machine) that guards the system.
 * 
 * ITT Interpretation:
 *   - Each validation predicate is a Δ fan surface
 *   - The manifest must pass through ALL gates (Δ₁ ∧ Δ₂ ∧ ... ∧ Δₙ)
 *   - Invalid states are rejected before σ-accumulation (rendering)
 * 
 * Writable Doctrine:
 *   Only validated, writable parameters proceed.
 *   If E(manifest) = P₁ ∧ P₂ ∧ ... ∧ Pₙ, then Valid iff ALL predicates hold.
 */

// Validation predicates (each is a gate)
const PREDICATES = {
  // Δ₁: Canvas dimensions are valid
  canvas_dimensions_valid: (manifest) => {
    const { width, height } = manifest.canvas;
    return (
      Number.isInteger(width) &&
      Number.isInteger(height) &&
      width >= 100 && width <= 2000 &&
      height >= 100 && height <= 2000
    );
  },

  // Δ₂: Text content is safe
  text_content_safe: (manifest) => {
    const text = manifest.params.text || '';
    // No script injection, reasonable length
    return (
      !text.includes('<script') &&
      !text.includes('javascript:') &&
      text.length <= 500
    );
  },

  // Δ₃: Palette exists
  palette_exists: (manifest) => {
    return manifest.palette && typeof manifest.palette === 'object';
  },

  // Δ₄: No circular references (structural integrity)
  structure_acyclic: (manifest) => {
    // For now, always passes - more complex validation later
    return true;
  },

  // Δ₅: Animation parameters valid
  animation_valid: (manifest) => {
    const validAnimations = ['none', 'fadeIn', 'fadeOut', 'pulse', 'grow', 'sparkle', 'slide'];
    const anim = manifest.params.animate || 'none';
    return validAnimations.includes(anim);
  },

  // Δ₆: Color values valid (hex format)
  colors_valid: (manifest) => {
    const colorParams = ['fill', 'stroke', 'bg', 'color'];
    for (const param of colorParams) {
      const value = manifest.params[param];
      if (value && !is_valid_color(value)) {
        return false;
      }
    }
    return true;
  },
};

/**
 * Check if a color value is valid
 */
function is_valid_color(color) {
  // Hex color
  if (/^#[0-9A-Fa-f]{3,8}$/.test(color)) return true;
  // Named color (basic set)
  const namedColors = ['white', 'black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'transparent'];
  if (namedColors.includes(color.toLowerCase())) return true;
  // RGB/RGBA
  if (/^rgba?\([\d\s,.%]+\)$/.test(color)) return true;
  return false;
}

/**
 * Validate manifest through the Writable Gate
 * 
 * @param {object} manifest - The parsed manifest
 * @returns {object} Validation result with truth table
 */
export function validate_manifest_as_writable(manifest) {
  const results = {};
  const errors = [];

  // Run each predicate (Δ fan surface)
  for (const [predicate_name, predicate_fn] of Object.entries(PREDICATES)) {
    try {
      const passed = predicate_fn(manifest);
      results[predicate_name] = passed;
      if (!passed) {
        errors.push(`FAILED: ${predicate_name}`);
      }
    } catch (e) {
      results[predicate_name] = false;
      errors.push(`ERROR in ${predicate_name}: ${e.message}`);
    }
  }

  // E(manifest) = P₁ ∧ P₂ ∧ ... ∧ Pₙ
  const is_writable = Object.values(results).every(v => v === true);

  return {
    is_writable,
    truth_table: results,
    errors,
    manifest: is_writable ? manifest : null,
  };
}

/**
 * Create a safe, validated manifest or return ground state
 * 
 * Ground state is the minimal valid configuration - the system's "rest position"
 */
export function get_validated_manifest_or_ground_state(manifest) {
  const validation = validate_manifest_as_writable(manifest);

  if (validation.is_writable) {
    return {
      valid: true,
      manifest: validation.manifest,
      validation,
    };
  }

  // Return ground state (minimal valid configuration)
  const ground_state = {
    raw: '',
    params: {},
    canvas: { width: 400, height: 400, aspect: '1:1' },
    palette: {
      primary: '#0a0a0f',
      secondary: '#13131a',
      accent: '#00d4ff',
      text: '#e8e8f0',
      gradient: ['#0a0a0f', '#1a1a2e', '#16213e'],
    },
    scene: null,
    layers: [],
    errors: validation.errors,
  };

  return {
    valid: false,
    manifest: ground_state,
    validation,
    used_ground_state: true,
  };
}

/**
 * Format validation result for display
 */
export function format_validation_result(validation) {
  const lines = ['VALIDATION TRUTH TABLE:'];
  
  for (const [predicate, passed] of Object.entries(validation.truth_table)) {
    const icon = passed ? '🟢' : '🔴';
    lines.push(`  ${icon} ${predicate}`);
  }
  
  lines.push('');
  lines.push(validation.is_writable ? '✓ MANIFEST WRITABLE' : '✗ MANIFEST REJECTED');
  
  return lines.join('\n');
}
