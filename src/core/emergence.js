/**
 * FIBER BUNDLE EMERGENCE ENGINE
 *
 * Implements the fiber bundle structure for property emergence.
 *
 * Mathematical Foundation:
 * - π: E → B (projection from total space to base space)
 * - E = Total Space (emerged properties)
 * - B = Base Space (input manifest)
 * - F = Fiber (profile properties at each point)
 *
 * Emergence Gain:
 * - Input: 5 properties (scene, text, profile)
 * - Output: 50+ properties (colors, fonts, animations, decorations)
 * - Gain: dim(E) - dim(B) ≈ 45 dimensions
 *
 * @module core/emergence
 */

import { VisualManifold } from './manifold.js';
import chroma from 'chroma-js';

/**
 * Emergence Engine
 *
 * Performs fiber bundle projection to amplify sparse commands
 * into complete visual specifications.
 */
export class EmergenceEngine {
  /**
   * @param {Object} options - Configuration options
   * @param {Object} options.profiles - Profile registry
   * @param {Object} options.scenes - Scene templates
   * @param {VisualManifold} options.manifold - Visual manifold instance
   */
  constructor(options = {}) {
    this.profiles = options.profiles || new Map();
    this.scenes = options.scenes || new Map();
    this.manifold = options.manifold || new VisualManifold();

    // Emergence statistics
    this.stats = {
      totalEmergences: 0,
      averageGain: 0,
      profileHits: new Map(),
      sceneHits: new Map(),
    };

    // Cache for performance
    this.cache = new Map();
  }

  /**
   * Project manifest through fiber bundle
   * π: E → B
   *
   * Takes sparse input manifest and projects it onto the fiber bundle,
   * attaching profile and scene fibers to create full specification.
   *
   * @param {Object} manifest - Input manifest (base space)
   * @returns {Object} Emerged manifest (total space)
   */
  emerge(manifest) {
    const cacheKey = this.getCacheKey(manifest);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Count input dimensionality
    const inputDim = this.countDimensions(manifest);

    // Step 1: Load scene fiber
    const sceneProperties = this.attachSceneFiber(manifest);

    // Step 2: Load profile fiber(s)
    const profileProperties = this.attachProfileFiber(manifest);

    // Step 3: Compose fibers (profile overrides scene)
    const emerged = this.composeFibers(manifest, sceneProperties, profileProperties);

    // Step 4: Fill remaining defaults
    const complete = this.fillDefaults(emerged);

    // Count output dimensionality
    const outputDim = this.countDimensions(complete);
    const gain = outputDim - inputDim;

    // Update statistics
    this.stats.totalEmergences++;
    this.stats.averageGain =
      (this.stats.averageGain * (this.stats.totalEmergences - 1) + gain) /
      this.stats.totalEmergences;

    // Cache result
    this.cache.set(cacheKey, complete);

    return complete;
  }

  /**
   * Attach scene fiber
   * Loads scene template and extracts properties
   *
   * @param {Object} manifest - Input manifest
   * @returns {Object} Scene properties
   */
  attachSceneFiber(manifest) {
    const sceneName = manifest.scene || 'minimal';
    const scene = this.getScene(sceneName);

    // Track scene usage
    this.stats.sceneHits.set(
      sceneName,
      (this.stats.sceneHits.get(sceneName) || 0) + 1
    );

    if (!scene) {
      return this.getDefaultScene();
    }

    return {
      colors: scene.colors || {},
      typography: scene.typography || {},
      layout: scene.layout || {},
      motion: scene.motion || {},
      effects: scene.effects || {},
      decorations: scene.decorations || [],
      animations: scene.animations || {},
      gradients: scene.gradients || {},
    };
  }

  /**
   * Attach profile fiber
   * Loads brand profile and extracts constraints
   *
   * @param {Object} manifest - Input manifest
   * @returns {Object} Profile properties
   */
  attachProfileFiber(manifest) {
    const profileName = manifest.profile;

    if (!profileName) {
      return {}; // No profile specified
    }

    // Track profile usage
    this.stats.profileHits.set(
      profileName,
      (this.stats.profileHits.get(profileName) || 0) + 1
    );

    // Handle CEO mode (composed profile)
    if (profileName.includes('+')) {
      return this.composeCEOProfile(profileName);
    }

    // Single profile
    const profile = this.getProfile(profileName);
    if (!profile) {
      return {};
    }

    return this.extractProfileProperties(profile);
  }

  /**
   * Compose CEO mode profile
   * individual + company = CEO
   *
   * @param {string} profileSpec - "individual+company" format
   * @returns {Object} Composed profile properties
   */
  composeCEOProfile(profileSpec) {
    const [individualName, companyName] = profileSpec.split('+').map(s => s.trim());

    const individual = this.getProfile(individualName);
    const company = this.getProfile(companyName);

    if (!individual || !company) {
      return {};
    }

    const individualProps = this.extractProfileProperties(individual);
    const companyProps = this.extractProfileProperties(company);

    // Compose: individual ⊕ company
    // Individual properties override company properties
    return this.blendProfiles(companyProps, individualProps, 0.7);
  }

  /**
   * Extract properties from profile
   *
   * @param {Object} profile - Brand profile
   * @returns {Object} Extracted properties
   */
  extractProfileProperties(profile) {
    return {
      colors: {
        primary: profile.colors?.primary || null,
        secondary: profile.colors?.secondary || null,
        tertiary: profile.colors?.tertiary || null,
        accent: profile.colors?.accent || null,
        background: profile.colors?.background || null,
        text: profile.colors?.text || null,
      },
      typography: {
        fontFamily: profile.fonts?.primary || null,
        fontFamilySecondary: profile.fonts?.secondary || null,
        fontWeight: profile.typography?.weight || null,
        fontSize: profile.typography?.size || null,
      },
      layout: {
        type: profile.layout?.type || null,
        grid: profile.layout?.grid || null,
        spacing: profile.layout?.spacing || null,
      },
      motion: {
        animation: profile.animation?.style || null,
        duration: profile.animation?.duration || null,
        easing: profile.animation?.easing || null,
      },
      effects: {
        shadow: profile.effects?.shadow || null,
        glow: profile.effects?.glow || null,
      },
      decorations: profile.decorations || [],
      voice: profile.voice || {},
    };
  }

  /**
   * Blend two profiles
   * Used for CEO mode composition
   *
   * @param {Object} base - Base profile properties
   * @param {Object} override - Override profile properties
   * @param {number} weight - Blend weight (0 = base, 1 = override)
   * @returns {Object} Blended properties
   */
  blendProfiles(base, override, weight = 0.5) {
    const blended = JSON.parse(JSON.stringify(base)); // Deep clone

    // Override non-null properties
    for (const [category, props] of Object.entries(override)) {
      if (!blended[category]) {
        blended[category] = {};
      }

      if (Array.isArray(props)) {
        // Arrays: concatenate with priority
        blended[category] = [...props, ...(blended[category] || [])];
      } else if (typeof props === 'object' && props !== null) {
        // Objects: merge with priority
        for (const [key, value] of Object.entries(props)) {
          if (value !== null && value !== undefined) {
            blended[category][key] = value;
          }
        }
      }
    }

    return blended;
  }

  /**
   * Compose fibers
   * Combines manifest + scene + profile
   *
   * Priority: manifest > profile > scene > defaults
   *
   * @param {Object} manifest - Original manifest
   * @param {Object} scene - Scene properties
   * @param {Object} profile - Profile properties
   * @returns {Object} Composed properties
   */
  composeFibers(manifest, scene, profile) {
    const composed = {};

    // Categories to compose
    const categories = ['colors', 'typography', 'layout', 'motion', 'effects'];

    for (const category of categories) {
      composed[category] = {
        // Start with scene
        ...(scene[category] || {}),
        // Override with profile
        ...(profile[category] || {}),
        // Override with manifest
        ...(manifest[category] || {}),
      };

      // Remove null values
      composed[category] = this.removeNullValues(composed[category]);
    }

    // Handle arrays (decorations, animations)
    composed.decorations = [
      ...(scene.decorations || []),
      ...(profile.decorations || []),
      ...(manifest.decorations || []),
    ];

    composed.animations = {
      ...(scene.animations || {}),
      ...(profile.animations || {}),
      ...(manifest.animations || {}),
    };

    // Preserve top-level properties
    composed.scene = manifest.scene || 'minimal';
    composed.profile = manifest.profile || null;
    composed.text = manifest.text || '';
    composed.canvas = manifest.canvas || '1:1';

    return composed;
  }

  /**
   * Fill default values
   * Ensures all required properties exist
   *
   * @param {Object} manifest - Partially filled manifest
   * @returns {Object} Complete manifest
   */
  fillDefaults(manifest) {
    const defaults = {
      // Core
      scene: 'minimal',
      text: '',
      canvas: '1:1',
      profile: null,

      // Colors
      colors: {
        primary: '#000000',
        secondary: '#666666',
        tertiary: '#999999',
        accent: '#0066cc',
        background: '#ffffff',
        text: '#000000',
      },

      // Typography
      typography: {
        fontFamily: 'Arial, sans-serif',
        fontFamilySecondary: 'Georgia, serif',
        fontSize: '48px',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '0em',
        wordSpacing: '0em',
        textAlign: 'center',
        textTransform: 'none',
      },

      // Layout
      layout: {
        type: 'centered',
        x: '50%',
        y: '50%',
        anchor: 'center',
        width: '80%',
        height: 'auto',
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        grid: null,
        spacing: 20,
      },

      // Motion
      motion: {
        animation: 'none',
        duration: '1s',
        delay: '0s',
        easing: 'ease',
        loop: 1,
        direction: 'normal',
        fillMode: 'forwards',
      },

      // Effects
      effects: {
        shadow: 'none',
        glow: 'none',
        blur: '0px',
        opacity: 1.0,
      },

      // Advanced
      decorations: [],
      animations: {},
      gradients: {},
    };

    // Deep merge
    return this.deepMerge(defaults, manifest);
  }

  /**
   * Deep merge objects
   * Recursively merges nested objects
   *
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        if (Array.isArray(source[key])) {
          output[key] = source[key];
        } else {
          output[key] = this.deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  /**
   * Remove null/undefined values from object
   *
   * @param {Object} obj - Object to clean
   * @returns {Object} Cleaned object
   */
  removeNullValues(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  /**
   * Count dimensionality of manifest
   * Counts number of specified properties
   *
   * @param {Object} manifest - Manifest to measure
   * @returns {number} Dimension count
   */
  countDimensions(manifest) {
    let count = 0;

    const countObject = (obj) => {
      for (const value of Object.values(obj)) {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            countObject(value);
          } else {
            count++;
          }
        }
      }
    };

    countObject(manifest);
    return count;
  }

  /**
   * Get scene by name
   *
   * @param {string} name - Scene name
   * @returns {Object|null} Scene template
   */
  getScene(name) {
    return this.scenes.get(name) || null;
  }

  /**
   * Get profile by name
   *
   * @param {string} name - Profile name
   * @returns {Object|null} Profile data
   */
  getProfile(name) {
    return this.profiles.get(name) || null;
  }

  /**
   * Get default scene
   *
   * @returns {Object} Default scene properties
   */
  getDefaultScene() {
    return {
      name: 'minimal',
      colors: {
        background: '#ffffff',
        text: '#000000',
      },
      typography: {
        fontFamily: 'Arial',
        fontSize: '48px',
      },
      layout: {
        type: 'centered',
      },
      motion: {
        animation: 'none',
      },
      effects: {},
      decorations: [],
    };
  }

  /**
   * Register scene template
   *
   * @param {string} name - Scene name
   * @param {Object} scene - Scene template
   */
  registerScene(name, scene) {
    this.scenes.set(name, scene);
  }

  /**
   * Register brand profile
   *
   * @param {string} name - Profile name
   * @param {Object} profile - Profile data
   */
  registerProfile(name, profile) {
    this.profiles.set(name, profile);
  }

  /**
   * Load profiles from directory
   *
   * @param {Object[]} profileList - Array of profile objects
   */
  loadProfiles(profileList) {
    for (const profile of profileList) {
      if (profile.name) {
        this.registerProfile(profile.name, profile);
      }
    }
  }

  /**
   * Load scenes from directory
   *
   * @param {Object[]} sceneList - Array of scene objects
   */
  loadScenes(sceneList) {
    for (const scene of sceneList) {
      if (scene.name) {
        this.registerScene(scene.name, scene);
      }
    }
  }

  /**
   * Calculate emergence gain
   * Measures dimensional increase from input to output
   *
   * @param {Object} input - Input manifest
   * @param {Object} output - Output manifest
   * @returns {number} Dimensional gain
   */
  calculateEmergenceGain(input, output) {
    const inputDim = this.countDimensions(input);
    const outputDim = this.countDimensions(output);
    return outputDim - inputDim;
  }

  /**
   * Get emergence statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      profileCount: this.profiles.size,
      sceneCount: this.scenes.size,
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Generate cache key for manifest
   *
   * @param {Object} manifest - Manifest
   * @returns {string} Cache key
   */
  getCacheKey(manifest) {
    return JSON.stringify({
      scene: manifest.scene,
      profile: manifest.profile,
      text: manifest.text,
      canvas: manifest.canvas,
    });
  }

  /**
   * Get fiber at point
   * Returns the fiber F attached at manifest point
   *
   * @param {Object} manifest - Base point
   * @returns {Object} Fiber properties
   */
  getFiberAt(manifest) {
    const scene = this.attachSceneFiber(manifest);
    const profile = this.attachProfileFiber(manifest);
    return { scene, profile };
  }

  /**
   * Visualize fiber bundle
   * Returns dimensional structure
   *
   * @returns {Object} Bundle structure
   */
  visualizeFiberBundle() {
    return {
      baseSpace: {
        description: 'Input manifests (sparse commands)',
        dimensions: ['scene', 'text', 'profile', 'canvas'],
        cardinality: this.scenes.size * this.profiles.size,
      },
      totalSpace: {
        description: 'Emerged manifests (complete specifications)',
        dimensions: [
          'colors (6 properties)',
          'typography (8 properties)',
          'layout (6 properties)',
          'motion (6 properties)',
          'effects (4 properties)',
          'decorations (variable)',
        ],
        averageDim: 30 + this.stats.averageGain,
      },
      fiber: {
        description: 'Properties attached at each base point',
        sources: ['scene template', 'brand profile', 'defaults'],
        gain: this.stats.averageGain,
      },
      projection: {
        description: 'π: E → B',
        function: 'emerge(manifest)',
      },
    };
  }
}

/**
 * Create emergence engine with default configuration
 *
 * @param {Object} options - Configuration options
 * @returns {EmergenceEngine} Engine instance
 */
export function createEmergenceEngine(options = {}) {
  return new EmergenceEngine(options);
}

export default EmergenceEngine;
