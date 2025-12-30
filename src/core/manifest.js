/**
 * MANIFEST PARSER
 * ================
 * 
 * Transforms URL command strings into structured Lattice Manifests.
 * 
 * Input: "scene=corporate|text=Hello|canvas=1:1|animate=fadeIn"
 * Output: { scene: 'corporate', text: 'Hello', canvas: { aspect: '1:1' }, animate: 'fadeIn' }
 * 
 * ITT Interpretation:
 *   The URL is the Φ field - raw scalar potential
 *   Parsing is ∇Φ - detecting where values change (| separators)
 *   The manifest is σ-accumulation - structured regions
 */

// Canvas dimension presets
const CANVAS_PRESETS = {
  '1:1':   { width: 400, height: 400 },
  '4:5':   { width: 400, height: 500 },
  '16:9':  { width: 640, height: 360 },
  '9:16':  { width: 360, height: 640 },
  'story': { width: 360, height: 640 },
  'post':  { width: 400, height: 400 },
  'cover': { width: 640, height: 360 },
};

// Color palettes
const COLOR_PALETTES = {
  future_tech: {
    primary: '#0a0a0f',
    secondary: '#13131a',
    accent: '#00d4ff',
    text: '#e8e8f0',
    gradient: ['#0a0a0f', '#1a1a2e', '#16213e'],
  },
  oceanic: {
    primary: '#1a237e',
    secondary: '#283593',
    accent: '#00bcd4',
    text: '#ffffff',
    gradient: ['#1a237e', '#0d47a1', '#006064'],
  },
  brutalism: {
    primary: '#ffeb3b',
    secondary: '#000000',
    accent: '#f44336',
    text: '#000000',
    gradient: ['#ffeb3b', '#ffc107', '#ff9800'],
  },
  forest: {
    primary: '#1b5e20',
    secondary: '#2e7d32',
    accent: '#8bc34a',
    text: '#ffffff',
    gradient: ['#1b5e20', '#388e3c', '#4caf50'],
  },
  sunset: {
    primary: '#ff6f00',
    secondary: '#ff8f00',
    accent: '#ffab00',
    text: '#ffffff',
    gradient: ['#d32f2f', '#ff5722', '#ff9800'],
  },
};

// Scene templates
const SCENE_TEMPLATES = {
  minimal: {
    background: 'solid',
    layers: ['text'],
    defaults: { palette: 'future_tech' },
  },
  corporate: {
    background: 'gradient',
    layers: ['background', 'text', 'decoration'],
    defaults: { palette: 'future_tech', animate: 'fadeIn' },
  },
  gradient: {
    background: 'gradient',
    layers: ['background', 'text'],
    defaults: { palette: 'oceanic' },
  },
  celebration: {
    background: 'gradient',
    layers: ['background', 'particles', 'text'],
    defaults: { palette: 'sunset', animate: 'sparkle' },
  },
};

/**
 * Parse command string into manifest object
 * 
 * @param {string} command_string - The raw command (e.g., "scene=corporate|text=Hello")
 * @returns {object} Parsed manifest with all parameters
 */
export function parse_command_string_into_manifest(command_string) {
  const manifest = {
    raw: command_string,
    params: {},
    canvas: { width: 400, height: 400, aspect: '1:1' },
    palette: COLOR_PALETTES.future_tech,
    scene: null,
    layers: [],
    errors: [],
  };

  if (!command_string || command_string.trim() === '') {
    manifest.errors.push('EMPTY_COMMAND');
    return manifest;
  }

  // Remove leading # if present
  const clean_command = command_string.replace(/^#/, '').trim();

  // Split by | (the ∇Φ detection - where values separate)
  const pairs = clean_command.split('|');

  for (const pair of pairs) {
    const [key, ...value_parts] = pair.split('=');
    const value = value_parts.join('='); // Rejoin in case value contains =

    if (!key) continue;

    const clean_key = key.trim().toLowerCase();
    const clean_value = value?.trim() || '';

    manifest.params[clean_key] = clean_value;

    // Process specific parameters
    switch (clean_key) {
      case 'canvas':
        if (CANVAS_PRESETS[clean_value]) {
          manifest.canvas = { ...CANVAS_PRESETS[clean_value], aspect: clean_value };
        } else {
          // Try to parse custom dimensions (e.g., "800x600")
          const match = clean_value.match(/^(\d+)x(\d+)$/);
          if (match) {
            manifest.canvas = {
              width: parseInt(match[1]),
              height: parseInt(match[2]),
              aspect: 'custom',
            };
          }
        }
        break;

      case 'palette':
        if (COLOR_PALETTES[clean_value]) {
          manifest.palette = COLOR_PALETTES[clean_value];
        }
        break;

      case 'scene':
        if (SCENE_TEMPLATES[clean_value]) {
          manifest.scene = {
            name: clean_value,
            ...SCENE_TEMPLATES[clean_value],
          };
          // Apply scene defaults
          manifest.palette = COLOR_PALETTES[manifest.scene.defaults.palette] || manifest.palette;
        }
        break;
    }
  }

  return manifest;
}

/**
 * Extract value from URL hash or query string
 */
export function extract_manifest_from_url() {
  const hash = window.location.hash.substring(1);
  const search = window.location.search.substring(1);
  
  // Prefer hash, fall back to search
  const command = hash || search;
  
  return parse_command_string_into_manifest(command);
}

/**
 * Build URL from manifest
 */
export function build_url_from_manifest(manifest) {
  const parts = [];
  
  for (const [key, value] of Object.entries(manifest.params)) {
    if (value) {
      parts.push(`${key}=${value}`);
    }
  }
  
  return '#' + parts.join('|');
}

// Export palettes and presets for external use
export { COLOR_PALETTES, CANVAS_PRESETS, SCENE_TEMPLATES };
