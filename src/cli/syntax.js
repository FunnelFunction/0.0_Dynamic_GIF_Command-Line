/**
 * CLI SYNTAX DEFINITIONS
 *
 * Defines the complete grammar, identifiers, modifiers, and values
 * for the CLI command language.
 *
 * Provides:
 * - Valid identifiers and their types
 * - Valid modifiers and their effects
 * - Value constraints and validation
 * - Autocomplete suggestions
 *
 * @module cli/syntax
 */

/**
 * Core identifiers
 *
 * Top-level manifest properties.
 */
export const CORE_IDENTIFIERS = {
  scene: {
    type: 'string',
    description: 'Scene template name',
    examples: ['minimal', 'corporate', 'creative', 'tech', 'elegant'],
    required: false,
  },
  text: {
    type: 'string',
    description: 'Primary text content',
    examples: ['Hello', 'Innovation', 'Welcome'],
    required: false,
  },
  profile: {
    type: 'string',
    description: 'Brand profile name',
    examples: ['workspace_ai', 'acme_corp', 'john_doe', 'workspace_ai+acme_corp'],
    required: false,
  },
  canvas: {
    type: 'string',
    description: 'Canvas aspect ratio',
    examples: ['1:1', '16:9', '9:16', '4:3', '21:9'],
    required: false,
  },
};

/**
 * Color identifiers
 *
 * Nested under "colors.*"
 */
export const COLOR_IDENTIFIERS = {
  primary: {
    type: 'color',
    description: 'Primary brand color',
    examples: ['#0066cc', 'blue', 'rgb(0,102,204)'],
  },
  secondary: {
    type: 'color',
    description: 'Secondary brand color',
    examples: ['#666666', 'gray', '#ff6600'],
  },
  tertiary: {
    type: 'color',
    description: 'Tertiary color',
    examples: ['#999999', '#cccccc'],
  },
  accent: {
    type: 'color',
    description: 'Accent color for highlights',
    examples: ['#ff6600', '#00cc66', 'orange'],
  },
  background: {
    type: 'color',
    description: 'Background color',
    examples: ['#ffffff', 'white', '#f0f0f0'],
  },
  text: {
    type: 'color',
    description: 'Text color',
    examples: ['#000000', 'black', '#333333'],
  },
};

/**
 * Typography identifiers
 *
 * Nested under "typography.*"
 */
export const TYPOGRAPHY_IDENTIFIERS = {
  fontFamily: {
    type: 'string',
    description: 'Font family',
    examples: ['Arial', 'Helvetica', 'Georgia', 'Roboto', 'Open Sans'],
  },
  fontSize: {
    type: 'size',
    description: 'Font size',
    examples: ['16px', '24px', '48px', '2rem', '1.5em'],
  },
  fontWeight: {
    type: 'number',
    description: 'Font weight (100-900)',
    examples: ['400', '700', '300', '600'],
    min: 100,
    max: 900,
  },
  lineHeight: {
    type: 'number',
    description: 'Line height multiplier',
    examples: ['1.2', '1.5', '1.8'],
    min: 0.5,
    max: 3.0,
  },
  letterSpacing: {
    type: 'size',
    description: 'Letter spacing',
    examples: ['0em', '0.05em', '2px', '-0.02em'],
  },
  textAlign: {
    type: 'enum',
    description: 'Text alignment',
    values: ['left', 'center', 'right', 'justify'],
    examples: ['center', 'left'],
  },
  textTransform: {
    type: 'enum',
    description: 'Text transformation',
    values: ['none', 'uppercase', 'lowercase', 'capitalize'],
    examples: ['uppercase', 'none'],
  },
};

/**
 * Layout identifiers
 *
 * Nested under "layout.*"
 */
export const LAYOUT_IDENTIFIERS = {
  type: {
    type: 'enum',
    description: 'Layout type',
    values: ['centered', 'left', 'right', 'top', 'bottom', 'grid', 'flex'],
    examples: ['centered', 'grid'],
  },
  x: {
    type: 'position',
    description: 'Horizontal position',
    examples: ['50%', '100px', '0%', '25%'],
  },
  y: {
    type: 'position',
    description: 'Vertical position',
    examples: ['50%', '100px', '0%', '75%'],
  },
  width: {
    type: 'size',
    description: 'Element width',
    examples: ['80%', '500px', '100%', 'auto'],
  },
  height: {
    type: 'size',
    description: 'Element height',
    examples: ['auto', '300px', '50%'],
  },
  anchor: {
    type: 'enum',
    description: 'Anchor point',
    values: ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    examples: ['center', 'top-left'],
  },
};

/**
 * Motion identifiers
 *
 * Nested under "motion.*"
 */
export const MOTION_IDENTIFIERS = {
  animation: {
    type: 'enum',
    description: 'Animation type',
    values: ['none', 'fade', 'slide', 'zoom', 'bounce', 'rotate', 'pulse'],
    examples: ['fade', 'zoom'],
  },
  duration: {
    type: 'time',
    description: 'Animation duration',
    examples: ['1s', '500ms', '2s', '0.5s'],
  },
  delay: {
    type: 'time',
    description: 'Animation delay',
    examples: ['0s', '500ms', '1s'],
  },
  easing: {
    type: 'enum',
    description: 'Easing function',
    values: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier'],
    examples: ['ease-out', 'ease-in-out'],
  },
  loop: {
    type: 'number',
    description: 'Loop count (0 = infinite)',
    examples: ['1', '0', '3'],
    min: 0,
  },
  direction: {
    type: 'enum',
    description: 'Animation direction',
    values: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    examples: ['normal', 'alternate'],
  },
};

/**
 * Effect identifiers
 *
 * Nested under "effects.*"
 */
export const EFFECT_IDENTIFIERS = {
  shadow: {
    type: 'string',
    description: 'Drop shadow',
    examples: ['0px 4px 6px rgba(0,0,0,0.1)', 'none', '2px 2px 4px #000000'],
  },
  glow: {
    type: 'string',
    description: 'Glow effect',
    examples: ['0px 0px 10px currentColor', 'none', '0 0 20px #0066cc'],
  },
  blur: {
    type: 'size',
    description: 'Blur radius',
    examples: ['0px', '4px', '10px'],
  },
  opacity: {
    type: 'number',
    description: 'Opacity (0-1)',
    examples: ['1.0', '0.5', '0.8'],
    min: 0,
    max: 1,
  },
};

/**
 * All identifiers (flat)
 */
export const ALL_IDENTIFIERS = {
  ...CORE_IDENTIFIERS,
  // Nested identifiers with dot notation
  'colors.primary': COLOR_IDENTIFIERS.primary,
  'colors.secondary': COLOR_IDENTIFIERS.secondary,
  'colors.tertiary': COLOR_IDENTIFIERS.tertiary,
  'colors.accent': COLOR_IDENTIFIERS.accent,
  'colors.background': COLOR_IDENTIFIERS.background,
  'colors.text': COLOR_IDENTIFIERS.text,
  'typography.fontFamily': TYPOGRAPHY_IDENTIFIERS.fontFamily,
  'typography.fontSize': TYPOGRAPHY_IDENTIFIERS.fontSize,
  'typography.fontWeight': TYPOGRAPHY_IDENTIFIERS.fontWeight,
  'typography.lineHeight': TYPOGRAPHY_IDENTIFIERS.lineHeight,
  'typography.letterSpacing': TYPOGRAPHY_IDENTIFIERS.letterSpacing,
  'typography.textAlign': TYPOGRAPHY_IDENTIFIERS.textAlign,
  'typography.textTransform': TYPOGRAPHY_IDENTIFIERS.textTransform,
  'layout.type': LAYOUT_IDENTIFIERS.type,
  'layout.x': LAYOUT_IDENTIFIERS.x,
  'layout.y': LAYOUT_IDENTIFIERS.y,
  'layout.width': LAYOUT_IDENTIFIERS.width,
  'layout.height': LAYOUT_IDENTIFIERS.height,
  'layout.anchor': LAYOUT_IDENTIFIERS.anchor,
  'motion.animation': MOTION_IDENTIFIERS.animation,
  'motion.duration': MOTION_IDENTIFIERS.duration,
  'motion.delay': MOTION_IDENTIFIERS.delay,
  'motion.easing': MOTION_IDENTIFIERS.easing,
  'motion.loop': MOTION_IDENTIFIERS.loop,
  'motion.direction': MOTION_IDENTIFIERS.direction,
  'effects.shadow': EFFECT_IDENTIFIERS.shadow,
  'effects.glow': EFFECT_IDENTIFIERS.glow,
  'effects.blur': EFFECT_IDENTIFIERS.blur,
  'effects.opacity': EFFECT_IDENTIFIERS.opacity,
};

/**
 * Modifier definitions
 */
export const MODIFIERS = {
  // Text styling
  bold: {
    description: 'Bold text (font-weight: 700)',
    effect: { typography: { fontWeight: 700 } },
  },
  italic: {
    description: 'Italic text',
    effect: { typography: { fontStyle: 'italic' } },
  },
  underline: {
    description: 'Underlined text',
    effect: { typography: { textDecoration: 'underline' } },
  },
  uppercase: {
    description: 'UPPERCASE TEXT',
    effect: { typography: { textTransform: 'uppercase' } },
  },
  lowercase: {
    description: 'lowercase text',
    effect: { typography: { textTransform: 'lowercase' } },
  },

  // Alignment
  left: {
    description: 'Left-aligned text',
    effect: { typography: { textAlign: 'left' } },
  },
  center: {
    description: 'Centered text',
    effect: { typography: { textAlign: 'center' } },
  },
  right: {
    description: 'Right-aligned text',
    effect: { typography: { textAlign: 'right' } },
  },

  // Effects
  shadow: {
    description: 'Add drop shadow',
    effect: { effects: { shadow: '0px 4px 6px rgba(0,0,0,0.1)' } },
  },
  glow: {
    description: 'Add glow effect',
    effect: { effects: { glow: '0px 0px 10px currentColor' } },
  },
  blur: {
    description: 'Add blur effect',
    effect: { effects: { blur: '4px' } },
  },

  // Animation
  fade: {
    description: 'Fade in/out animation',
    effect: { motion: { animation: 'fade' } },
  },
  slide: {
    description: 'Slide in animation',
    effect: { motion: { animation: 'slide' } },
  },
  zoom: {
    description: 'Zoom in/out animation',
    effect: { motion: { animation: 'zoom' } },
  },
  bounce: {
    description: 'Bounce animation',
    effect: { motion: { animation: 'bounce' } },
  },
  pulse: {
    description: 'Pulse animation',
    effect: { motion: { animation: 'pulse' } },
  },
  rotate: {
    description: 'Rotation animation',
    effect: { motion: { animation: 'rotate' } },
  },

  // Canvas
  square: {
    description: 'Square canvas (1:1)',
    effect: { canvas: '1:1' },
  },
  landscape: {
    description: 'Landscape canvas (16:9)',
    effect: { canvas: '16:9' },
  },
  portrait: {
    description: 'Portrait canvas (9:16)',
    effect: { canvas: '9:16' },
  },
  wide: {
    description: 'Ultra-wide canvas (21:9)',
    effect: { canvas: '21:9' },
  },
};

/**
 * Value type validators
 */
export const VALUE_VALIDATORS = {
  /**
   * Validate color
   */
  color: (value) => {
    // Hex
    if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return { valid: true };
    // RGB/RGBA
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/.test(value)) return { valid: true };
    // HSL/HSLA
    if (/^hsla?\(/.test(value)) return { valid: true };
    // Named colors
    const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white', 'gray'];
    if (namedColors.includes(value.toLowerCase())) return { valid: true };

    return { valid: false, error: 'Invalid color format' };
  },

  /**
   * Validate size
   */
  size: (value) => {
    if (/^-?\d+(\.\d+)?(px|em|rem|%|vh|vw)$/.test(value)) return { valid: true };
    if (value === 'auto') return { valid: true };
    return { valid: false, error: 'Invalid size format (expected: 10px, 1.5em, 50%, auto)' };
  },

  /**
   * Validate position
   */
  position: (value) => {
    if (/^-?\d+(\.\d+)?(px|%|em|rem)$/.test(value)) return { valid: true };
    return { valid: false, error: 'Invalid position format (expected: 50%, 100px)' };
  },

  /**
   * Validate time
   */
  time: (value) => {
    if (/^\d+(\.\d+)?(s|ms)$/.test(value)) return { valid: true };
    return { valid: false, error: 'Invalid time format (expected: 1s, 500ms)' };
  },

  /**
   * Validate number
   */
  number: (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return { valid: false, error: 'Invalid number' };
    return { valid: true };
  },

  /**
   * Validate enum
   */
  enum: (value, definition) => {
    if (!definition.values) return { valid: true };
    if (definition.values.includes(value)) return { valid: true };
    return {
      valid: false,
      error: `Invalid value. Expected one of: ${definition.values.join(', ')}`,
    };
  },

  /**
   * Validate string
   */
  string: (value) => {
    return { valid: true };
  },
};

/**
 * Validate identifier value
 *
 * @param {string} identifier - Identifier name
 * @param {*} value - Value to validate
 * @returns {Object} Validation result {valid, error}
 */
export function validateIdentifierValue(identifier, value) {
  const definition = ALL_IDENTIFIERS[identifier];
  if (!definition) {
    return { valid: true }; // Unknown identifier, allow it
  }

  const validator = VALUE_VALIDATORS[definition.type];
  if (!validator) {
    return { valid: true };
  }

  const result = validator(value, definition);

  // Check min/max constraints
  if (result.valid && definition.type === 'number') {
    const num = parseFloat(value);
    if (definition.min !== undefined && num < definition.min) {
      return { valid: false, error: `Value must be >= ${definition.min}` };
    }
    if (definition.max !== undefined && num > definition.max) {
      return { valid: false, error: `Value must be <= ${definition.max}` };
    }
  }

  return result;
}

/**
 * Get autocomplete suggestions for identifier
 *
 * @param {string} prefix - Identifier prefix
 * @returns {Array} Suggestions
 */
export function getIdentifierSuggestions(prefix = '') {
  const suggestions = [];

  for (const [identifier, definition] of Object.entries(ALL_IDENTIFIERS)) {
    if (identifier.startsWith(prefix)) {
      suggestions.push({
        identifier,
        type: definition.type,
        description: definition.description,
        examples: definition.examples,
      });
    }
  }

  return suggestions.sort((a, b) => a.identifier.localeCompare(b.identifier));
}

/**
 * Get autocomplete suggestions for modifier
 *
 * @param {string} prefix - Modifier prefix
 * @returns {Array} Suggestions
 */
export function getModifierSuggestions(prefix = '') {
  const suggestions = [];

  for (const [modifier, definition] of Object.entries(MODIFIERS)) {
    if (modifier.startsWith(prefix)) {
      suggestions.push({
        modifier: '::' + modifier,
        description: definition.description,
      });
    }
  }

  return suggestions.sort((a, b) => a.modifier.localeCompare(b.modifier));
}

/**
 * Get autocomplete suggestions for value
 *
 * @param {string} identifier - Identifier name
 * @param {string} prefix - Value prefix
 * @returns {Array} Suggestions
 */
export function getValueSuggestions(identifier, prefix = '') {
  const definition = ALL_IDENTIFIERS[identifier];
  if (!definition) return [];

  const suggestions = [];

  // Enum values
  if (definition.type === 'enum' && definition.values) {
    for (const value of definition.values) {
      if (value.startsWith(prefix)) {
        suggestions.push({
          value,
          type: 'enum',
          description: definition.description,
        });
      }
    }
  }

  // Examples
  if (definition.examples) {
    for (const example of definition.examples) {
      if (String(example).startsWith(prefix)) {
        suggestions.push({
          value: example,
          type: 'example',
          description: `Example ${definition.type}`,
        });
      }
    }
  }

  return suggestions;
}

export default {
  CORE_IDENTIFIERS,
  COLOR_IDENTIFIERS,
  TYPOGRAPHY_IDENTIFIERS,
  LAYOUT_IDENTIFIERS,
  MOTION_IDENTIFIERS,
  EFFECT_IDENTIFIERS,
  ALL_IDENTIFIERS,
  MODIFIERS,
  VALUE_VALIDATORS,
  validateIdentifierValue,
  getIdentifierSuggestions,
  getModifierSuggestions,
  getValueSuggestions,
};
