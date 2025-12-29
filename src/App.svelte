<script>
  /**
   * MAIN APP COMPONENT
   *
   * Root Svelte component that orchestrates the entire UI.
   *
   * Layout:
   *   ┌─────────────────────────────────────┐
   *   │  Header (Logo + Controls)           │
   *   ├──────────────┬──────────────────────┤
   *   │              │                      │
   *   │  Terminal    │    Preview Canvas    │
   *   │  (CLI)       │    (SVG Output)      │
   *   │              │                      │
   *   ├──────────────┴──────────────────────┤
   *   │  Footer (Metrics + Status)          │
   *   └─────────────────────────────────────┘
   */

  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  // Components (will create these next)
  import Terminal from '@components/Terminal.svelte';
  import Preview from '@components/Preview.svelte';
  import Canvas from '@components/Canvas.svelte';

  // Stores
  import {
    commandInput,
    activeProfile,
    metrics,
    ui,
    theme,
    hasValidOutput,
    currentError,
    validationWarnings,
    isProcessing,
    toggleHelp,
    toggleSettings,
    togglePreview,
    clearHistory,
    exportOutput,
  } from '@state/stores.js';

  // Props
  export let version = '1.0.0';
  export let buildTime = new Date().toISOString();

  // Local state
  let showMetrics = false;
  let exportInProgress = false;
  let exportError = null;

  // Reactive statements
  $: isDark = $theme === 'dark';
  $: showSidebar = !$ui.sidebarCollapsed;

  // Lifecycle
  onMount(() => {
    console.log('App mounted');

    // Listen for global keyboard shortcuts
    const handleShowHelp = () => toggleHelp();
    window.addEventListener('show-help', handleShowHelp);

    return () => {
      window.removeEventListener('show-help', handleShowHelp);
    };
  });

  // Methods
  async function handleExport(format) {
    exportInProgress = true;
    exportError = null;

    try {
      await exportOutput(format);
      console.log(`Exported as ${format}`);
    } catch (error) {
      console.error('Export failed:', error);
      exportError = error.message;
    } finally {
      exportInProgress = false;
    }
  }

  function toggleTheme() {
    theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  function toggleMetrics() {
    showMetrics = !showMetrics;
  }
</script>

<main class="app" class:dark={isDark}>
  <!-- Header -->
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">AUTO-GIF-CUSTOMER</span>
        <span class="logo-version">v{version}</span>
      </h1>
    </div>

    <div class="header-center">
      {#if $currentError}
        <div class="status-badge error" transition:fade>
          <span class="badge-icon">⚠</span>
          <span class="badge-text">{$currentError}</span>
        </div>
      {:else if $isProcessing}
        <div class="status-badge processing" transition:fade>
          <span class="badge-icon spinner">◌</span>
          <span class="badge-text">Processing...</span>
        </div>
      {:else if $hasValidOutput}
        <div class="status-badge success" transition:fade>
          <span class="badge-icon">✓</span>
          <span class="badge-text">Ready</span>
        </div>
      {/if}

      {#if $validationWarnings.length > 0}
        <div class="status-badge warning" transition:fade>
          <span class="badge-icon">!</span>
          <span class="badge-text">{$validationWarnings.length} warning{$validationWarnings.length > 1 ? 's' : ''}</span>
        </div>
      {/if}
    </div>

    <div class="header-right">
      <button class="icon-btn" on:click={toggleMetrics} title="Performance Metrics">
        <span>📊</span>
      </button>
      <button class="icon-btn" on:click={toggleHelp} title="Help (Ctrl+/)">
        <span>?</span>
      </button>
      <button class="icon-btn" on:click={toggleSettings} title="Settings">
        <span>⚙</span>
      </button>
      <button class="icon-btn" on:click={toggleTheme} title="Toggle Theme">
        <span>{isDark ? '☀' : '🌙'}</span>
      </button>
    </div>
  </header>

  <!-- Main Content -->
  <div class="app-content">
    <!-- Terminal Section -->
    <section class="terminal-section" class:collapsed={!showSidebar}>
      <Terminal />
    </section>

    <!-- Preview Section -->
    <section class="preview-section" class:full-width={!showSidebar}>
      {#if $ui.showPreview}
        <div class="preview-container">
          <Preview />
          <Canvas />
        </div>
      {:else}
        <div class="preview-placeholder">
          <p>Preview hidden. Click to show.</p>
          <button on:click={togglePreview}>Show Preview</button>
        </div>
      {/if}
    </section>
  </div>

  <!-- Footer -->
  <footer class="app-footer">
    <div class="footer-left">
      <span class="footer-text">
        {#if $activeProfile}
          Profile: <strong>{$activeProfile}</strong>
        {:else}
          No profile active
        {/if}
      </span>
    </div>

    <div class="footer-center">
      {#if showMetrics}
        <div class="metrics" transition:slide>
          <span class="metric">Parse: {$metrics.parseTime.toFixed(1)}ms</span>
          <span class="metric">Validate: {$metrics.validateTime.toFixed(1)}ms</span>
          <span class="metric">Emerge: {$metrics.emergeTime.toFixed(1)}ms</span>
          <span class="metric">Converge: {$metrics.convergeTime.toFixed(1)}ms</span>
          <span class="metric">Render: {$metrics.renderTime.toFixed(1)}ms</span>
          <span class="metric total">Total: {$metrics.totalTime.toFixed(1)}ms</span>
        </div>
      {/if}
    </div>

    <div class="footer-right">
      {#if $hasValidOutput}
        <button class="export-btn" on:click={() => handleExport('png')} disabled={exportInProgress}>
          {exportInProgress ? 'Exporting...' : 'Export PNG'}
        </button>
        <button class="export-btn" on:click={() => handleExport('gif')} disabled={exportInProgress}>
          {exportInProgress ? 'Exporting...' : 'Export GIF'}
        </button>
      {/if}
    </div>
  </footer>

  <!-- Help Panel -->
  {#if $ui.showHelp}
    <div class="overlay" on:click={toggleHelp} transition:fade></div>
    <aside class="help-panel" transition:slide>
      <div class="panel-header">
        <h2>Help & Syntax</h2>
        <button class="close-btn" on:click={toggleHelp}>×</button>
      </div>
      <div class="panel-content">
        <section>
          <h3>Basic Syntax</h3>
          <code>#command1=value1|command2=value2</code>
        </section>
        <section>
          <h3>Examples</h3>
          <ul>
            <li><code>#text=Hello World|canvas=1:1</code></li>
            <li><code>#scene=corporate|profile=auto_workspace_ai|text=Innovation</code></li>
            <li><code>#text=Launch|animation=fadeIn|export=gif</code></li>
          </ul>
        </section>
        <section>
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><kbd>Ctrl/Cmd</kbd> + <kbd>K</kbd> - Focus command input</li>
            <li><kbd>Ctrl/Cmd</kbd> + <kbd>/</kbd> - Toggle help</li>
            <li><kbd>Esc</kbd> - Clear/blur input</li>
          </ul>
        </section>
      </div>
    </aside>
  {/if}

  <!-- Settings Panel -->
  {#if $ui.showSettings}
    <div class="overlay" on:click={toggleSettings} transition:fade></div>
    <aside class="settings-panel" transition:slide>
      <div class="panel-header">
        <h2>Settings</h2>
        <button class="close-btn" on:click={toggleSettings}>×</button>
      </div>
      <div class="panel-content">
        <p>Settings coming soon...</p>
      </div>
    </aside>
  {/if}
</main>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    position: relative;
    z-index: 1;
  }

  /* Header */
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-bg-tertiary);
    backdrop-filter: blur(var(--blur-md));
  }

  .app-logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-version {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: var(--font-mono);
  }

  .status-badge.success {
    background: rgba(0, 255, 136, 0.1);
    color: var(--color-success);
  }

  .status-badge.error {
    background: rgba(255, 51, 102, 0.1);
    color: var(--color-error);
  }

  .status-badge.warning {
    background: rgba(255, 170, 0, 0.1);
    color: var(--color-warning);
  }

  .status-badge.processing {
    background: rgba(0, 212, 255, 0.1);
    color: var(--color-accent-primary);
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .header-right {
    display: flex;
    gap: var(--spacing-xs);
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 1.125rem;
  }

  .icon-btn:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-accent-primary);
  }

  /* Main Content */
  .app-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .terminal-section {
    width: 400px;
    border-right: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
    transition: width var(--transition-base);
  }

  .terminal-section.collapsed {
    width: 0;
    border-right: none;
  }

  .preview-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .preview-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Footer */
  .app-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-bg-tertiary);
    font-size: 0.875rem;
  }

  .metrics {
    display: flex;
    gap: var(--spacing-md);
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  .metric {
    color: var(--color-text-tertiary);
  }

  .metric.total {
    color: var(--color-accent-primary);
    font-weight: 600;
  }

  .export-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--color-accent-primary);
    color: var(--color-bg-primary);
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .export-btn:hover:not(:disabled) {
    background: var(--color-accent-secondary);
    transform: translateY(-1px);
  }

  .export-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Panels */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }

  .help-panel,
  .settings-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: var(--color-bg-secondary);
    border-left: 1px solid var(--color-bg-tertiary);
    z-index: 101;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-bg-tertiary);
  }

  .panel-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
  }

  .close-btn:hover {
    color: var(--color-text-primary);
  }

  .panel-content {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
  }

  .panel-content h3 {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    font-size: 1rem;
    color: var(--color-accent-primary);
  }

  .panel-content code {
    background: var(--color-bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .panel-content ul {
    list-style: none;
    padding: 0;
  }

  .panel-content li {
    padding: var(--spacing-xs) 0;
  }

  .panel-content kbd {
    background: var(--color-bg-tertiary);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    border: 1px solid var(--color-bg-primary);
  }
</style>
