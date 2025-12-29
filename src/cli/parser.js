/**
 * CLI COMMAND PARSER
 *
 * Parses hash-based CLI commands into structured manifests (AST).
 *
 * Grammar:
 * command      ::= "#" statement ("|" statement)*
 * statement    ::= assignment | modifier
 * assignment   ::= identifier "=" value
 * modifier     ::= "::" identifier ("=" value)?
 * value        ::= string | number | color | identifier
 *
 * Examples:
 * - #scene=corporate|text=Hello
 * - #text=Innovation|color=blue|::bold
 * - #profile=workspace_ai|colors.primary=#0066cc
 *
 * @module cli/parser
 */

/**
 * Parse CLI command string
 *
 * @param {string} command - Command string (with or without #)
 * @returns {Object} Parsed manifest
 */
export function parse(command) {
  // Remove leading # if present
  const cleanCommand = command.trim().startsWith('#')
    ? command.trim().slice(1)
    : command.trim();

  if (cleanCommand === '') {
    return getDefaultManifest();
  }

  // Split into statements
  const statements = cleanCommand.split('|').map(s => s.trim()).filter(s => s);

  // Parse manifest
  const manifest = getDefaultManifest();
  const errors = [];

  for (const statement of statements) {
    try {
      if (statement.startsWith('::')) {
        // Modifier
        parseModifier(manifest, statement);
      } else if (statement.includes('=')) {
        // Assignment
        parseAssignment(manifest, statement);
      } else {
        // Invalid statement
        errors.push({
          statement,
          error: 'Invalid statement format',
        });
      }
    } catch (error) {
      errors.push({
        statement,
        error: error.message,
      });
    }
  }

  if (errors.length > 0) {
    manifest._errors = errors;
  }

  return manifest;
}

/**
 * Parse assignment statement
 *
 * identifier = value
 *
 * @param {Object} manifest - Manifest to update
 * @param {string} statement - Assignment statement
 */
function parseAssignment(manifest, statement) {
  const equalIndex = statement.indexOf('=');
  if (equalIndex === -1) {
    throw new Error('Assignment must contain "="');
  }

  const identifier = statement.slice(0, equalIndex).trim();
  const valueStr = statement.slice(equalIndex + 1).trim();

  if (!identifier) {
    throw new Error('Identifier cannot be empty');
  }

  const value = parseValue(valueStr);

  // Handle nested properties (e.g., "colors.primary")
  setNestedProperty(manifest, identifier, value);
}

/**
 * Parse modifier statement
 *
 * ::identifier or ::identifier=value
 *
 * @param {Object} manifest - Manifest to update
 * @param {string} statement - Modifier statement
 */
function parseModifier(manifest, statement) {
  const modifierStr = statement.slice(2).trim(); // Remove "::"

  if (!modifierStr) {
    throw new Error('Modifier cannot be empty');
  }

  // Check if modifier has value
  const equalIndex = modifierStr.indexOf('=');
  let modifierName, modifierValue;

  if (equalIndex !== -1) {
    modifierName = modifierStr.slice(0, equalIndex).trim();
    modifierValue = parseValue(modifierStr.slice(equalIndex + 1).trim());
  } else {
    modifierName = modifierStr;
    modifierValue = true;
  }

  // Apply modifier
  applyModifier(manifest, modifierName, modifierValue);
}

/**
 * Parse value from string
 *
 * Detects type and converts accordingly.
 *
 * @param {string} valueStr - Value string
 * @returns {*} Parsed value
 */
function parseValue(valueStr) {
  if (!valueStr) return '';

  // Boolean
  if (valueStr === 'true') return true;
  if (valueStr === 'false') return false;

  // Null/undefined
  if (valueStr === 'null') return null;
  if (valueStr === 'undefined') return undefined;

  // Number (including px, %, s, ms units)
  if (/^-?\d+(\.\d+)?(px|%|em|rem|vh|vw|s|ms)?$/.test(valueStr)) {
    return valueStr;
  }

  // Color (hex)
  if (/^#[0-9a-fA-F]{3,8}$/.test(valueStr)) {
    return valueStr;
  }

  // Color (rgb, rgba)
  if (/^rgba?\(/.test(valueStr)) {
    return valueStr;
  }

  // Color (hsl, hsla)
  if (/^hsla?\(/.test(valueStr)) {
    return valueStr;
  }

  // URL-encoded string (decode)
  if (valueStr.includes('%20') || valueStr.includes('+')) {
    try {
      return decodeURIComponent(valueStr.replace(/\+/g, ' '));
    } catch (e) {
      return valueStr;
    }
  }

  // String (unquoted)
  return valueStr;
}

/**
 * Set nested property on object
 *
 * Handles dot notation: "colors.primary" → manifest.colors.primary
 *
 * @param {Object} obj - Target object
 * @param {string} path - Property path
 * @param {*} value - Value to set
 */
function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    } else if (typeof current[part] !== 'object' || current[part] === null) {
      // Override non-object values
      current[part] = {};
    }
    current = current[part];
  }

  const finalPart = parts[parts.length - 1];
  current[finalPart] = value;
}

/**
 * Apply modifier to manifest
 *
 * Modifiers are shortcuts for common property changes.
 *
 * @param {Object} manifest - Manifest
 * @param {string} name - Modifier name
 * @param {*} value - Modifier value
 */
function applyModifier(manifest, name, value) {
  switch (name) {
    // Text styling
    case 'bold':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.fontWeight = 700;
      break;
    case 'italic':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.fontStyle = 'italic';
      break;
    case 'underline':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textDecoration = 'underline';
      break;
    case 'uppercase':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textTransform = 'uppercase';
      break;
    case 'lowercase':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textTransform = 'lowercase';
      break;

    // Alignment
    case 'left':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textAlign = 'left';
      break;
    case 'center':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textAlign = 'center';
      break;
    case 'right':
      if (!manifest.typography) manifest.typography = {};
      manifest.typography.textAlign = 'right';
      break;

    // Effects
    case 'shadow':
      if (!manifest.effects) manifest.effects = {};
      manifest.effects.shadow = typeof value === 'string' ? value : '0px 4px 6px rgba(0,0,0,0.1)';
      break;
    case 'glow':
      if (!manifest.effects) manifest.effects = {};
      manifest.effects.glow = typeof value === 'string' ? value : '0px 0px 10px currentColor';
      break;
    case 'blur':
      if (!manifest.effects) manifest.effects = {};
      manifest.effects.blur = typeof value === 'string' ? value : '4px';
      break;

    // Animation
    case 'fade':
      if (!manifest.motion) manifest.motion = {};
      manifest.motion.animation = 'fade';
      break;
    case 'slide':
      if (!manifest.motion) manifest.motion = {};
      manifest.motion.animation = 'slide';
      break;
    case 'zoom':
      if (!manifest.motion) manifest.motion = {};
      manifest.motion.animation = 'zoom';
      break;
    case 'bounce':
      if (!manifest.motion) manifest.motion = {};
      manifest.motion.animation = 'bounce';
      break;

    // Canvas
    case 'square':
      manifest.canvas = '1:1';
      break;
    case 'landscape':
      manifest.canvas = '16:9';
      break;
    case 'portrait':
      manifest.canvas = '9:16';
      break;

    // Unknown modifier - store as custom
    default:
      if (!manifest._modifiers) manifest._modifiers = {};
      manifest._modifiers[name] = value;
  }
}

/**
 * Get default manifest
 *
 * @returns {Object} Default manifest
 */
function getDefaultManifest() {
  return {
    scene: null,
    text: null,
    profile: null,
    canvas: null,
    colors: {},
    typography: {},
    layout: {},
    motion: {},
    effects: {},
    decorations: [],
  };
}

/**
 * Serialize manifest back to command string
 *
 * @param {Object} manifest - Manifest to serialize
 * @returns {string} Command string
 */
export function serialize(manifest) {
  const parts = [];

  // Core properties
  if (manifest.scene) parts.push(`scene=${encodeValue(manifest.scene)}`);
  if (manifest.text) parts.push(`text=${encodeValue(manifest.text)}`);
  if (manifest.profile) parts.push(`profile=${encodeValue(manifest.profile)}`);
  if (manifest.canvas && manifest.canvas !== '1:1') {
    parts.push(`canvas=${encodeValue(manifest.canvas)}`);
  }

  // Colors
  if (manifest.colors) {
    for (const [key, value] of Object.entries(manifest.colors)) {
      if (value) parts.push(`colors.${key}=${encodeValue(value)}`);
    }
  }

  // Typography
  if (manifest.typography) {
    for (const [key, value] of Object.entries(manifest.typography)) {
      if (value && key !== 'fontStyle' && key !== 'textDecoration') {
        parts.push(`typography.${key}=${encodeValue(value)}`);
      }
    }
  }

  // Layout
  if (manifest.layout) {
    for (const [key, value] of Object.entries(manifest.layout)) {
      if (value) parts.push(`layout.${key}=${encodeValue(value)}`);
    }
  }

  // Motion
  if (manifest.motion) {
    for (const [key, value] of Object.entries(manifest.motion)) {
      if (value && value !== 'none') {
        parts.push(`motion.${key}=${encodeValue(value)}`);
      }
    }
  }

  // Effects
  if (manifest.effects) {
    for (const [key, value] of Object.entries(manifest.effects)) {
      if (value && value !== 'none') {
        parts.push(`effects.${key}=${encodeValue(value)}`);
      }
    }
  }

  // Modifiers
  if (manifest._modifiers) {
    for (const [key, value] of Object.entries(manifest._modifiers)) {
      if (value === true) {
        parts.push(`::${key}`);
      } else {
        parts.push(`::${key}=${encodeValue(value)}`);
      }
    }
  }

  return parts.length > 0 ? '#' + parts.join('|') : '#';
}

/**
 * Encode value for URL
 *
 * @param {*} value - Value to encode
 * @returns {string} Encoded value
 */
function encodeValue(value) {
  if (typeof value === 'string') {
    // Don't encode simple identifiers
    if (/^[a-zA-Z0-9_-]+$/.test(value)) {
      return value;
    }
    // Encode special characters
    return encodeURIComponent(value);
  }
  return String(value);
}

/**
 * Validate command syntax
 *
 * @param {string} command - Command string
 * @returns {Object} Validation result {valid, errors}
 */
export function validateSyntax(command) {
  const errors = [];

  // Check for leading #
  if (!command.trim().startsWith('#')) {
    errors.push({
      type: 'syntax',
      message: 'Command must start with #',
    });
  }

  // Check for balanced quotes (future)
  const quoteCount = (command.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    errors.push({
      type: 'syntax',
      message: 'Unbalanced quotes',
    });
  }

  // Parse and check for parse errors
  try {
    const manifest = parse(command);
    if (manifest._errors) {
      errors.push(...manifest._errors.map(e => ({
        type: 'parse',
        statement: e.statement,
        message: e.error,
      })));
    }
  } catch (error) {
    errors.push({
      type: 'parse',
      message: error.message,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extract tokens from command
 *
 * Used for syntax highlighting and autocomplete.
 *
 * @param {string} command - Command string
 * @returns {Array} Array of tokens {type, value, start, end}
 */
export function tokenize(command) {
  const tokens = [];
  const cleanCommand = command.startsWith('#') ? command.slice(1) : command;

  let position = 0;
  const statements = cleanCommand.split('|');

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) {
      position += statement.length + 1; // +1 for |
      continue;
    }

    if (trimmed.startsWith('::')) {
      // Modifier token
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex !== -1) {
        tokens.push({
          type: 'modifier',
          value: trimmed.slice(2, equalIndex),
          start: position + 2,
          end: position + equalIndex,
        });
        tokens.push({
          type: 'operator',
          value: '=',
          start: position + equalIndex,
          end: position + equalIndex + 1,
        });
        tokens.push({
          type: 'value',
          value: trimmed.slice(equalIndex + 1),
          start: position + equalIndex + 1,
          end: position + trimmed.length,
        });
      } else {
        tokens.push({
          type: 'modifier',
          value: trimmed.slice(2),
          start: position + 2,
          end: position + trimmed.length,
        });
      }
    } else if (trimmed.includes('=')) {
      // Assignment token
      const equalIndex = trimmed.indexOf('=');
      tokens.push({
        type: 'identifier',
        value: trimmed.slice(0, equalIndex).trim(),
        start: position,
        end: position + equalIndex,
      });
      tokens.push({
        type: 'operator',
        value: '=',
        start: position + equalIndex,
        end: position + equalIndex + 1,
      });
      tokens.push({
        type: 'value',
        value: trimmed.slice(equalIndex + 1).trim(),
        start: position + equalIndex + 1,
        end: position + trimmed.length,
      });
    }

    position += statement.length + 1; // +1 for |
  }

  return tokens;
}

/**
 * Get cursor context
 *
 * Determines what the user is typing for autocomplete.
 *
 * @param {string} command - Command string
 * @param {number} cursorPosition - Cursor position
 * @returns {Object} Context {type, value, start, end}
 */
export function getCursorContext(command, cursorPosition) {
  // Find statement containing cursor
  const beforeCursor = command.slice(0, cursorPosition);
  const lastPipe = beforeCursor.lastIndexOf('|');
  const statementStart = lastPipe === -1 ? (command.startsWith('#') ? 1 : 0) : lastPipe + 1;

  const nextPipe = command.indexOf('|', cursorPosition);
  const statementEnd = nextPipe === -1 ? command.length : nextPipe;

  const statement = command.slice(statementStart, statementEnd).trim();
  const relativePosition = cursorPosition - statementStart;

  // Determine context type
  if (statement.startsWith('::')) {
    return {
      type: 'modifier',
      value: statement.slice(2, relativePosition),
      start: statementStart,
      end: statementEnd,
    };
  } else if (statement.includes('=')) {
    const equalIndex = statement.indexOf('=');
    if (relativePosition <= equalIndex) {
      return {
        type: 'identifier',
        value: statement.slice(0, equalIndex).trim(),
        start: statementStart,
        end: statementStart + equalIndex,
      };
    } else {
      return {
        type: 'value',
        value: statement.slice(equalIndex + 1).trim(),
        start: statementStart + equalIndex + 1,
        end: statementEnd,
        identifier: statement.slice(0, equalIndex).trim(),
      };
    }
  } else {
    return {
      type: 'unknown',
      value: statement,
      start: statementStart,
      end: statementEnd,
    };
  }
}

export default {
  parse,
  serialize,
  validateSyntax,
  tokenize,
  getCursorContext,
};
