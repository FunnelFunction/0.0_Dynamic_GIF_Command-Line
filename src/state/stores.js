/**
 * REACTIVE STATE STORES
 *
 * Svelte reactive stores implementing the core state management.
 * This is where the magic happens - automatic reactivity through stores.
 *
 * Flow:
 *   commandInput (writable)
 *     ↓
 *   parsedCommand (derived) - CLI parser
 *     ↓
 *   validatedManifest (derived) - FSM validator
 *     ↓
 *   emergedSpec (derived) - Fiber bundle emergence
 *     ↓
 *   convergedState (derived) - Gradient flow convergence
 *     ↓
 *   finalSVG (derived) - SVG generator
 *
 * @module state/stores
 */

import { writable, derived, readable, get } from 'svelte/store';
import { CLIParser } from '@cli/parser.js';
import { LatticeValidator } from '@core/validator.js';
import { EmergenceEngine } from '@core/emergence.js';
import { ConvergenceEngine } from '@core/convergence.js';
import { VisualManifold } from '@core/manifold.js';
import { LatticeBrain } from '@core/lattice.js';
import { SVGGenerator } from '@rendering/svg-generator.js';

// ============================================================================
// CORE INSTANCES (singletons)
// ============================================================================

const parser = new CLIParser();
const validator = new LatticeValidator();
const emergenceEngine = new EmergenceEngine();
const convergenceEngine = new ConvergenceEngine();
const svgGenerator = new SVGGenerator();

// ============================================================================
// WRITABLE STORES (User Input)
// ============================================================================

/**
 * Command input from terminal
 * Example: "#text=Hello World|canvas=1:1|export=png"
 */
export const commandInput = writable('');

/**
 * Active brand profile
 * Example: "auto_workspace_ai", "ceo/armstrong", etc.
 */
export const activeProfile = writable(null);

/**
 * Canvas dimensions
 */
export const canvasDimensions = writable({ width: 1080, height: 1080 });

/**
 * Export format
 */
export const exportFormat = writable('png');

/**
 * Theme (light/dark)
 */
export const theme = writable('dark');

/**
 * UI state
 */
export const ui = writable({
  showHelp: false,
  showSettings: false,
  showPreview: true,
  sidebarCollapsed: false,
  terminalHistory: [],
});

/**
 * Performance metrics
 */
export const metrics = writable({
  parseTime: 0,
  validateTime: 0,
  emergeTime: 0,
  convergeTime: 0,
  renderTime: 0,
  totalTime: 0,
});

// ============================================================================
// DERIVED STORES (Automatic Computation)
// ============================================================================

/**
 * Parsed command → Abstract Syntax Tree
 * Auto-updates when commandInput changes
 */
export const parsedCommand = derived(
  commandInput,
  ($commandInput, set) => {
    if (!$commandInput || $commandInput.trim().length === 0) {
      set(null);
      return;
    }

    const startTime = performance.now();

    try {
      const parsed = parser.parse($commandInput);
      const parseTime = performance.now() - startTime;

      // Update metrics
      metrics.update(m => ({ ...m, parseTime }));

      set(parsed);
    } catch (error) {
      console.error('Parse error:', error);
      set({ error: error.message, raw: $commandInput });
    }
  },
  null
);

/**
 * Validated manifest with FSM validation
 * Auto-updates when parsedCommand changes
 */
export const validatedManifest = derived(
  [parsedCommand, activeProfile],
  ([$parsedCommand, $activeProfile], set) => {
    if (!$parsedCommand || $parsedCommand.error) {
      set(null);
      return;
    }

    const startTime = performance.now();

    try {
      // Merge profile into command
      const manifestWithProfile = {
        ...$parsedCommand,
        profile: $activeProfile || $parsedCommand.profile,
      };

      // Validate through FSM
      const validated = validator.validate(manifestWithProfile);
      const validateTime = performance.now() - startTime;

      // Update metrics
      metrics.update(m => ({ ...m, validateTime }));

      set(validated);
    } catch (error) {
      console.error('Validation error:', error);
      set({ error: error.message, manifest: $parsedCommand });
    }
  },
  null
);

/**
 * Emerged specification (fiber bundle projection)
 * Auto-updates when validatedManifest changes
 */
export const emergedSpec = derived(
  validatedManifest,
  ($validatedManifest, set) => {
    if (!$validatedManifest || $validatedManifest.error) {
      set(null);
      return;
    }

    const startTime = performance.now();

    try {
      // Use auto-repair if needed
      const manifest = $validatedManifest.valid
        ? $validatedManifest.manifest
        : $validatedManifest.repairs[0]?.repaired || $validatedManifest.manifest;

      // Emerge full specification
      const emerged = emergenceEngine.emerge(manifest);
      const emergeTime = performance.now() - startTime;

      // Update metrics
      metrics.update(m => ({ ...m, emergeTime }));

      set(emerged);
    } catch (error) {
      console.error('Emergence error:', error);
      set({ error: error.message });
    }
  },
  null
);

/**
 * Converged state (gradient flow to brand attractor)
 * Auto-updates when emergedSpec changes
 */
export const convergedState = derived(
  emergedSpec,
  ($emergedSpec, set) => {
    if (!$emergedSpec || $emergedSpec.error) {
      set(null);
      return;
    }

    const startTime = performance.now();

    try {
      // Apply convergence dynamics
      const converged = convergenceEngine.converge($emergedSpec);
      const convergeTime = performance.now() - startTime;

      // Update metrics
      metrics.update(m => ({ ...m, convergeTime }));

      set(converged);
    } catch (error) {
      console.error('Convergence error:', error);
      set({ error: error.message });
    }
  },
  null
);

/**
 * Final SVG output
 * Auto-updates when convergedState changes
 */
export const finalSVG = derived(
  [convergedState, canvasDimensions],
  ([$convergedState, $canvasDimensions], set) => {
    if (!$convergedState || $convergedState.error) {
      set(null);
      return;
    }

    const startTime = performance.now();

    try {
      // Generate SVG
      const svg = svgGenerator.generate($convergedState, $canvasDimensions);
      const renderTime = performance.now() - startTime;

      // Update metrics
      metrics.update(m => {
        const totalTime = m.parseTime + m.validateTime + m.emergeTime + m.convergeTime + renderTime;
        return { ...m, renderTime, totalTime };
      });

      set(svg);
    } catch (error) {
      console.error('SVG generation error:', error);
      set({ error: error.message });
    }
  },
  null
);

// ============================================================================
// DERIVED STORES (UI Helpers)
// ============================================================================

/**
 * Is the system currently processing?
 */
export const isProcessing = derived(
  [parsedCommand, validatedManifest, emergedSpec, convergedState, finalSVG],
  ([$parsed, $validated, $emerged, $converged, $svg]) => {
    return $parsed === undefined ||
           $validated === undefined ||
           $emerged === undefined ||
           $converged === undefined ||
           $svg === undefined;
  }
);

/**
 * Current error state (if any)
 */
export const currentError = derived(
  [parsedCommand, validatedManifest, emergedSpec, convergedState, finalSVG],
  ([$parsed, $validated, $emerged, $converged, $svg]) => {
    if ($parsed?.error) return $parsed.error;
    if ($validated?.error) return $validated.error;
    if ($emerged?.error) return $emerged.error;
    if ($converged?.error) return $converged.error;
    if ($svg?.error) return $svg.error;
    return null;
  }
);

/**
 * Validation warnings (non-blocking issues)
 */
export const validationWarnings = derived(
  validatedManifest,
  ($validatedManifest) => {
    if (!$validatedManifest || $validatedManifest.error) return [];
    return $validatedManifest.violations?.filter(v => v.severity === 'warning') || [];
  }
);

/**
 * Has valid output?
 */
export const hasValidOutput = derived(
  finalSVG,
  ($finalSVG) => {
    return $finalSVG && !$finalSVG.error;
  }
);

// ============================================================================
// ACTIONS (Functions that modify stores)
// ============================================================================

/**
 * Execute a command
 */
export function executeCommand(command) {
  // Add to history
  ui.update(state => ({
    ...state,
    terminalHistory: [...state.terminalHistory, { command, timestamp: Date.now() }],
  }));

  // Update command input (triggers reactive chain)
  commandInput.set(command);
}

/**
 * Clear current command
 */
export function clearCommand() {
  commandInput.set('');
}

/**
 * Set active profile
 */
export function setProfile(profileId) {
  activeProfile.set(profileId);
}

/**
 * Clear active profile
 */
export function clearProfile() {
  activeProfile.set(null);
}

/**
 * Toggle help panel
 */
export function toggleHelp() {
  ui.update(state => ({
    ...state,
    showHelp: !state.showHelp,
  }));
}

/**
 * Toggle settings panel
 */
export function toggleSettings() {
  ui.update(state => ({
    ...state,
    showSettings: !state.showSettings,
  }));
}

/**
 * Toggle preview panel
 */
export function togglePreview() {
  ui.update(state => ({
    ...state,
    showPreview: !state.showPreview,
  }));
}

/**
 * Clear terminal history
 */
export function clearHistory() {
  ui.update(state => ({
    ...state,
    terminalHistory: [],
  }));
}

/**
 * Export current output
 */
export async function exportOutput(format = 'png') {
  const svg = get(finalSVG);
  const state = get(convergedState);

  if (!svg || svg.error) {
    throw new Error('No valid output to export');
  }

  // Dynamic import of export module
  const { exportAs } = await import('@rendering/export.js');

  return exportAs(svg, state, format);
}

// ============================================================================
// PERSISTENCE (LocalStorage)
// ============================================================================

/**
 * Load state from localStorage
 */
export function loadPersistedState() {
  try {
    const saved = localStorage.getItem('auto-gif-customer-state');
    if (saved) {
      const state = JSON.parse(saved);

      if (state.theme) theme.set(state.theme);
      if (state.activeProfile) activeProfile.set(state.activeProfile);
      if (state.ui) ui.set({ ...get(ui), ...state.ui });
    }
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
  }
}

/**
 * Save state to localStorage
 */
export function savePersistedState() {
  try {
    const state = {
      theme: get(theme),
      activeProfile: get(activeProfile),
      ui: {
        sidebarCollapsed: get(ui).sidebarCollapsed,
        showPreview: get(ui).showPreview,
      },
    };

    localStorage.setItem('auto-gif-customer-state', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save persisted state:', error);
  }
}

// Auto-save on changes
theme.subscribe(savePersistedState);
activeProfile.subscribe(savePersistedState);
ui.subscribe(savePersistedState);

// Load on initialization
if (typeof window !== 'undefined') {
  loadPersistedState();
}

// ============================================================================
// DEBUGGING (Dev Mode)
// ============================================================================

if (import.meta.env.DEV) {
  // Expose stores for debugging
  window.__STORES__ = {
    commandInput,
    activeProfile,
    parsedCommand,
    validatedManifest,
    emergedSpec,
    convergedState,
    finalSVG,
    metrics,
    ui,
  };

  // Log state changes
  commandInput.subscribe(val => console.log('[Store] commandInput:', val));
  metrics.subscribe(val => console.log('[Store] metrics:', val));
}
