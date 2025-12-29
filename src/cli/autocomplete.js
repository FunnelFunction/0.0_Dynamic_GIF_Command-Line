/**
 * CLI AUTOCOMPLETE ENGINE
 *
 * Provides intelligent autocomplete suggestions based on:
 * - Current context (what user is typing)
 * - Grammar rules from syntax.js
 * - Available profiles and scenes
 * - Recent commands (history)
 *
 * @module cli/autocomplete
 */

import {
  getIdentifierSuggestions,
  getModifierSuggestions,
  getValueSuggestions,
  ALL_IDENTIFIERS,
  MODIFIERS,
} from './syntax.js';
import { getCursorContext } from './parser.js';

/**
 * Autocomplete Engine
 */
export class AutocompleteEngine {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.profiles = options.profiles || [];
    this.scenes = options.scenes || [];
    this.history = options.history || [];
    this.maxSuggestions = options.maxSuggestions || 10;
  }

  /**
   * Get autocomplete suggestions
   *
   * @param {string} command - Current command
   * @param {number} cursorPosition - Cursor position
   * @returns {Array} Suggestions
   */
  getSuggestions(command, cursorPosition) {
    // Get cursor context
    const context = getCursorContext(command, cursorPosition);

    switch (context.type) {
      case 'identifier':
        return this.getIdentifierCompletions(context.value);

      case 'modifier':
        return this.getModifierCompletions(context.value);

      case 'value':
        return this.getValueCompletions(context.identifier, context.value);

      case 'unknown':
        // Suggest starting with identifier or modifier
        return this.getStartingSuggestions(context.value);

      default:
        return [];
    }
  }

  /**
   * Get identifier completions
   *
   * @param {string} prefix - Current identifier prefix
   * @returns {Array} Suggestions
   */
  getIdentifierCompletions(prefix) {
    const suggestions = getIdentifierSuggestions(prefix);

    return suggestions.slice(0, this.maxSuggestions).map(s => ({
      type: 'identifier',
      text: s.identifier + '=',
      display: s.identifier,
      description: s.description,
      category: this.getIdentifierCategory(s.identifier),
      priority: this.calculatePriority(s.identifier, prefix),
    }));
  }

  /**
   * Get modifier completions
   *
   * @param {string} prefix - Current modifier prefix
   * @returns {Array} Suggestions
   */
  getModifierCompletions(prefix) {
    const suggestions = getModifierSuggestions(prefix);

    return suggestions.slice(0, this.maxSuggestions).map(s => ({
      type: 'modifier',
      text: s.modifier,
      display: s.modifier,
      description: s.description,
      category: 'Modifiers',
      priority: this.calculatePriority(s.modifier.slice(2), prefix),
    }));
  }

  /**
   * Get value completions
   *
   * @param {string} identifier - Identifier name
   * @param {string} prefix - Current value prefix
   * @returns {Array} Suggestions
   */
  getValueCompletions(identifier, prefix) {
    const suggestions = [];

    // Check for special completions
    if (identifier === 'scene') {
      suggestions.push(...this.getSceneCompletions(prefix));
    } else if (identifier === 'profile') {
      suggestions.push(...this.getProfileCompletions(prefix));
    } else if (identifier === 'canvas') {
      suggestions.push(...this.getCanvasCompletions(prefix));
    }

    // Add syntax-based completions
    const syntaxSuggestions = getValueSuggestions(identifier, prefix);
    for (const s of syntaxSuggestions) {
      suggestions.push({
        type: 'value',
        text: s.value,
        display: s.value,
        description: s.description,
        category: s.type === 'enum' ? 'Options' : 'Examples',
        priority: this.calculatePriority(s.value, prefix),
      });
    }

    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, this.maxSuggestions);
  }

  /**
   * Get starting suggestions
   *
   * When user hasn't typed anything yet.
   *
   * @param {string} prefix - Current prefix
   * @returns {Array} Suggestions
   */
  getStartingSuggestions(prefix) {
    const suggestions = [];

    // Core identifiers (scene, text, profile)
    if ('scene'.startsWith(prefix)) {
      suggestions.push({
        type: 'identifier',
        text: 'scene=',
        display: 'scene',
        description: 'Scene template',
        category: 'Core',
        priority: 100,
      });
    }

    if ('text'.startsWith(prefix)) {
      suggestions.push({
        type: 'identifier',
        text: 'text=',
        display: 'text',
        description: 'Text content',
        category: 'Core',
        priority: 95,
      });
    }

    if ('profile'.startsWith(prefix)) {
      suggestions.push({
        type: 'identifier',
        text: 'profile=',
        display: 'profile',
        description: 'Brand profile',
        category: 'Core',
        priority: 90,
      });
    }

    // Popular modifiers
    if ('::bold'.startsWith('::' + prefix)) {
      suggestions.push({
        type: 'modifier',
        text: '::bold',
        display: '::bold',
        description: 'Bold text',
        category: 'Modifiers',
        priority: 85,
      });
    }

    return suggestions.slice(0, this.maxSuggestions);
  }

  /**
   * Get scene completions
   *
   * @param {string} prefix - Prefix
   * @returns {Array} Suggestions
   */
  getSceneCompletions(prefix) {
    const suggestions = [];

    for (const scene of this.scenes) {
      const sceneName = typeof scene === 'string' ? scene : scene.name;
      if (sceneName && sceneName.startsWith(prefix)) {
        suggestions.push({
          type: 'value',
          text: sceneName,
          display: sceneName,
          description: typeof scene === 'object' ? scene.description : 'Scene template',
          category: 'Scenes',
          priority: this.calculatePriority(sceneName, prefix) + 10, // Boost scenes
        });
      }
    }

    return suggestions;
  }

  /**
   * Get profile completions
   *
   * @param {string} prefix - Prefix
   * @returns {Array} Suggestions
   */
  getProfileCompletions(prefix) {
    const suggestions = [];

    for (const profile of this.profiles) {
      const profileName = typeof profile === 'string' ? profile : profile.name;
      if (profileName && profileName.startsWith(prefix)) {
        suggestions.push({
          type: 'value',
          text: profileName,
          display: profileName,
          description: typeof profile === 'object' ? profile.description : 'Brand profile',
          category: 'Profiles',
          priority: this.calculatePriority(profileName, prefix) + 10, // Boost profiles
        });
      }
    }

    return suggestions;
  }

  /**
   * Get canvas completions
   *
   * @param {string} prefix - Prefix
   * @returns {Array} Suggestions
   */
  getCanvasCompletions(prefix) {
    const ratios = [
      { value: '1:1', description: 'Square (Instagram)' },
      { value: '16:9', description: 'Landscape (YouTube)' },
      { value: '9:16', description: 'Portrait (Stories)' },
      { value: '4:3', description: 'Standard' },
      { value: '21:9', description: 'Ultra-wide' },
    ];

    const suggestions = [];

    for (const ratio of ratios) {
      if (ratio.value.startsWith(prefix)) {
        suggestions.push({
          type: 'value',
          text: ratio.value,
          display: ratio.value,
          description: ratio.description,
          category: 'Canvas',
          priority: this.calculatePriority(ratio.value, prefix),
        });
      }
    }

    return suggestions;
  }

  /**
   * Calculate suggestion priority
   *
   * Higher priority = better match.
   *
   * @param {string} suggestion - Suggestion text
   * @param {string} prefix - User input prefix
   * @returns {number} Priority score
   */
  calculatePriority(suggestion, prefix) {
    if (!prefix) return 50;

    const suggestionLower = suggestion.toLowerCase();
    const prefixLower = prefix.toLowerCase();

    let priority = 0;

    // Exact match
    if (suggestionLower === prefixLower) {
      priority += 100;
    }

    // Starts with prefix
    if (suggestionLower.startsWith(prefixLower)) {
      priority += 80;
    }

    // Contains prefix
    if (suggestionLower.includes(prefixLower)) {
      priority += 40;
    }

    // Length similarity (prefer shorter)
    const lengthDiff = Math.abs(suggestion.length - prefix.length);
    priority -= lengthDiff * 2;

    // Boost frequently used (from history)
    const historyCount = this.history.filter(cmd => cmd.includes(suggestion)).length;
    priority += historyCount * 5;

    return Math.max(0, priority);
  }

  /**
   * Get identifier category
   *
   * @param {string} identifier - Identifier name
   * @returns {string} Category
   */
  getIdentifierCategory(identifier) {
    if (identifier.startsWith('colors.')) return 'Colors';
    if (identifier.startsWith('typography.')) return 'Typography';
    if (identifier.startsWith('layout.')) return 'Layout';
    if (identifier.startsWith('motion.')) return 'Motion';
    if (identifier.startsWith('effects.')) return 'Effects';
    return 'Core';
  }

  /**
   * Update profiles
   *
   * @param {Array} profiles - New profile list
   */
  updateProfiles(profiles) {
    this.profiles = profiles;
  }

  /**
   * Update scenes
   *
   * @param {Array} scenes - New scene list
   */
  updateScenes(scenes) {
    this.scenes = scenes;
  }

  /**
   * Add command to history
   *
   * @param {string} command - Command string
   */
  addToHistory(command) {
    this.history.unshift(command);
    // Keep last 100 commands
    this.history = this.history.slice(0, 100);
  }

  /**
   * Get command history
   *
   * @param {number} limit - Maximum number of commands
   * @returns {Array} Recent commands
   */
  getHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }
}

/**
 * Create autocomplete engine
 *
 * @param {Object} options - Configuration options
 * @returns {AutocompleteEngine} Engine instance
 */
export function createAutocompleteEngine(options = {}) {
  return new AutocompleteEngine(options);
}

/**
 * Fuzzy match
 *
 * Checks if needle matches pattern with fuzzy logic.
 *
 * @param {string} needle - Search string
 * @param {string} haystack - Target string
 * @returns {boolean} True if matches
 */
export function fuzzyMatch(needle, haystack) {
  const needleLower = needle.toLowerCase();
  const haystackLower = haystack.toLowerCase();

  let needleIndex = 0;
  let haystackIndex = 0;

  while (needleIndex < needleLower.length && haystackIndex < haystackLower.length) {
    if (needleLower[needleIndex] === haystackLower[haystackIndex]) {
      needleIndex++;
    }
    haystackIndex++;
  }

  return needleIndex === needleLower.length;
}

/**
 * Get command templates
 *
 * Common command patterns.
 *
 * @returns {Array} Templates
 */
export function getCommandTemplates() {
  return [
    {
      name: 'Basic',
      template: '#scene=minimal|text=Hello',
      description: 'Minimal scene with text',
    },
    {
      name: 'Corporate',
      template: '#scene=corporate|profile=workspace_ai|text=Innovation',
      description: 'Corporate scene with brand profile',
    },
    {
      name: 'Creative',
      template: '#scene=creative|text=Design|::bold|::shadow',
      description: 'Creative scene with effects',
    },
    {
      name: 'Animated',
      template: '#text=Welcome|motion.animation=fade|motion.duration=2s',
      description: 'Text with fade animation',
    },
    {
      name: 'Custom Colors',
      template: '#text=Brand|colors.primary=#0066cc|colors.background=#ffffff',
      description: 'Custom color palette',
    },
  ];
}

/**
 * Suggest next statements
 *
 * Based on current command, suggest what to add next.
 *
 * @param {string} command - Current command
 * @returns {Array} Suggestions
 */
export function suggestNextStatements(command) {
  const suggestions = [];

  // Parse command to see what's missing
  const hasScene = command.includes('scene=');
  const hasText = command.includes('text=');
  const hasProfile = command.includes('profile=');
  const hasColors = command.includes('colors.');
  const hasAnimation = command.includes('motion.animation');

  if (!hasScene) {
    suggestions.push({
      statement: 'scene=minimal',
      description: 'Add scene template',
      priority: 90,
    });
  }

  if (!hasText) {
    suggestions.push({
      statement: 'text=Hello',
      description: 'Add text content',
      priority: 85,
    });
  }

  if (!hasProfile) {
    suggestions.push({
      statement: 'profile=<name>',
      description: 'Add brand profile',
      priority: 80,
    });
  }

  if (!hasColors) {
    suggestions.push({
      statement: 'colors.primary=#0066cc',
      description: 'Set primary color',
      priority: 70,
    });
  }

  if (!hasAnimation) {
    suggestions.push({
      statement: 'motion.animation=fade',
      description: 'Add animation',
      priority: 60,
    });
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}

export default {
  AutocompleteEngine,
  createAutocompleteEngine,
  fuzzyMatch,
  getCommandTemplates,
  suggestNextStatements,
};
