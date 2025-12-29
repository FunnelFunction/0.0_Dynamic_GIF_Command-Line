<script>
  /**
   * PREVIEW COMPONENT
   *
   * Displays information about the current state of the lattice.
   * Shows the emerged specification, convergence state, and validation details.
   */

  import { fade, slide } from 'svelte/transition';
  import {
    parsedCommand,
    validatedManifest,
    emergedSpec,
    convergedState,
    hasValidOutput,
  } from '@state/stores.js';

  let selectedTab = 'manifest';
  let expandedSections = {
    colors: true,
    typography: false,
    layout: false,
    animation: false,
  };

  function toggleSection(section) {
    expandedSections[section] = !expandedSections[section];
  }

  function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
  }
</script>

<div class="preview">
  <!-- Tabs -->
  <div class="preview-tabs">
    <button
      class="tab"
      class:active={selectedTab === 'manifest'}
      on:click={() => selectedTab = 'manifest'}
    >
      Manifest
    </button>
    <button
      class="tab"
      class:active={selectedTab === 'emerged'}
      on:click={() => selectedTab = 'emerged'}
    >
      Emerged
    </button>
    <button
      class="tab"
      class:active={selectedTab === 'converged'}
      on:click={() => selectedTab = 'converged'}
    >
      Converged
    </button>
    <button
      class="tab"
      class:active={selectedTab === 'validation'}
      on:click={() => selectedTab = 'validation'}
    >
      Validation
    </button>
  </div>

  <!-- Content -->
  <div class="preview-content">
    {#if selectedTab === 'manifest'}
      <div class="tab-content" transition:fade={{ duration: 150 }}>
        <h3 class="section-title">Parsed Manifest</h3>
        {#if $parsedCommand && !$parsedCommand.error}
          <div class="info-grid">
            {#if $parsedCommand.scene}
              <div class="info-item">
                <span class="info-label">Scene:</span>
                <span class="info-value">{$parsedCommand.scene}</span>
              </div>
            {/if}
            {#if $parsedCommand.text}
              <div class="info-item">
                <span class="info-label">Text:</span>
                <span class="info-value">{$parsedCommand.text}</span>
              </div>
            {/if}
            {#if $parsedCommand.profile}
              <div class="info-item">
                <span class="info-label">Profile:</span>
                <span class="info-value">{$parsedCommand.profile}</span>
              </div>
            {/if}
            {#if $parsedCommand.canvas}
              <div class="info-item">
                <span class="info-label">Canvas:</span>
                <span class="info-value">{$parsedCommand.canvas}</span>
              </div>
            {/if}
            {#if $parsedCommand.animation}
              <div class="info-item">
                <span class="info-label">Animation:</span>
                <span class="info-value">{$parsedCommand.animation}</span>
              </div>
            {/if}
          </div>

          <details class="json-details">
            <summary>View Raw JSON</summary>
            <pre class="json-code">{formatJSON($parsedCommand)}</pre>
          </details>
        {:else if $parsedCommand?.error}
          <div class="error-message">
            <span class="error-icon">⚠</span>
            <span>{$parsedCommand.error}</span>
          </div>
        {:else}
          <div class="placeholder">
            <p>Enter a command to see the parsed manifest</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'emerged'}
      <div class="tab-content" transition:fade={{ duration: 150 }}>
        <h3 class="section-title">Emerged Specification</h3>
        {#if $emergedSpec && !$emergedSpec.error}
          <!-- Colors -->
          <div class="collapsible-section">
            <button class="section-header" on:click={() => toggleSection('colors')}>
              <span class="header-icon">{expandedSections.colors ? '▼' : '▶'}</span>
              <span>Colors</span>
            </button>
            {#if expandedSections.colors}
              <div class="section-body" transition:slide={{ duration: 200 }}>
                {#if $emergedSpec.colors}
                  <div class="color-grid">
                    {#each Object.entries($emergedSpec.colors) as [name, color]}
                      <div class="color-item">
                        <div class="color-swatch" style="background: {color}"></div>
                        <div class="color-info">
                          <span class="color-name">{name}</span>
                          <span class="color-value">{color}</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Typography -->
          <div class="collapsible-section">
            <button class="section-header" on:click={() => toggleSection('typography')}>
              <span class="header-icon">{expandedSections.typography ? '▼' : '▶'}</span>
              <span>Typography</span>
            </button>
            {#if expandedSections.typography}
              <div class="section-body" transition:slide={{ duration: 200 }}>
                {#if $emergedSpec.typography}
                  <div class="info-grid">
                    {#each Object.entries($emergedSpec.typography) as [key, value]}
                      <div class="info-item">
                        <span class="info-label">{key}:</span>
                        <span class="info-value">{value}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <details class="json-details">
            <summary>View Full Specification</summary>
            <pre class="json-code">{formatJSON($emergedSpec)}</pre>
          </details>
        {:else if $emergedSpec?.error}
          <div class="error-message">
            <span class="error-icon">⚠</span>
            <span>{$emergedSpec.error}</span>
          </div>
        {:else}
          <div class="placeholder">
            <p>Waiting for emergence...</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'converged'}
      <div class="tab-content" transition:fade={{ duration: 150 }}>
        <h3 class="section-title">Converged State</h3>
        {#if $convergedState && !$convergedState.error}
          <div class="convergence-info">
            <div class="info-badge success">
              <span class="badge-icon">✓</span>
              <span>Converged to brand attractor</span>
            </div>

            {#if $convergedState.iterations}
              <div class="info-item">
                <span class="info-label">Iterations:</span>
                <span class="info-value">{$convergedState.iterations}</span>
              </div>
            {/if}

            {#if $convergedState.energy !== undefined}
              <div class="info-item">
                <span class="info-label">Final Energy:</span>
                <span class="info-value">{$convergedState.energy.toFixed(4)}</span>
              </div>
            {/if}
          </div>

          <details class="json-details">
            <summary>View Converged State</summary>
            <pre class="json-code">{formatJSON($convergedState)}</pre>
          </details>
        {:else if $convergedState?.error}
          <div class="error-message">
            <span class="error-icon">⚠</span>
            <span>{$convergedState.error}</span>
          </div>
        {:else}
          <div class="placeholder">
            <p>Waiting for convergence...</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'validation'}
      <div class="tab-content" transition:fade={{ duration: 150 }}>
        <h3 class="section-title">Validation Results</h3>
        {#if $validatedManifest}
          {#if $validatedManifest.valid}
            <div class="info-badge success">
              <span class="badge-icon">✓</span>
              <span>All validation checks passed</span>
            </div>
          {:else}
            <div class="info-badge error">
              <span class="badge-icon">✗</span>
              <span>{$validatedManifest.violations.length} violation(s) found</span>
            </div>

            <div class="violations-list">
              {#each $validatedManifest.violations as violation}
                <div class="violation-item" class:error={violation.severity === 'error'} class:warning={violation.severity === 'warning'}>
                  <div class="violation-header">
                    <span class="violation-severity">{violation.severity}</span>
                    <span class="violation-predicate">{violation.predicate}</span>
                  </div>
                  <div class="violation-message">{violation.message}</div>
                </div>
              {/each}
            </div>

            {#if $validatedManifest.repairs && $validatedManifest.repairs.length > 0}
              <div class="info-badge warning">
                <span class="badge-icon">🔧</span>
                <span>{$validatedManifest.repairs.length} auto-repair(s) available</span>
              </div>
            {/if}
          {/if}

          {#if $validatedManifest.escapePath}
            <details class="json-details">
              <summary>View Escape Path</summary>
              <pre class="json-code">{formatJSON($validatedManifest.escapePath)}</pre>
            </details>
          {/if}
        {:else}
          <div class="placeholder">
            <p>No validation data</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    height: 50%;
    border-bottom: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
  }

  /* Tabs */
  .preview-tabs {
    display: flex;
    border-bottom: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-primary);
  }

  .tab {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .tab:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
  }

  .tab.active {
    color: var(--color-accent-primary);
    border-bottom-color: var(--color-accent-primary);
    background: var(--color-bg-secondary);
  }

  /* Content */
  .preview-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .section-title {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background: var(--color-bg-primary);
    border-radius: 6px;
  }

  .info-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-value {
    font-size: 0.875rem;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
  }

  /* Color Grid */
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-sm);
  }

  .color-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-bg-primary);
    border-radius: 6px;
  }

  .color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid var(--color-bg-tertiary);
  }

  .color-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .color-name {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: capitalize;
  }

  .color-value {
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  /* Collapsible Sections */
  .collapsible-section {
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    overflow: hidden;
  }

  .section-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-primary);
    border: none;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .section-header:hover {
    background: var(--color-bg-tertiary);
  }

  .header-icon {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
  }

  .section-body {
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
  }

  /* Badges */
  .info-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .info-badge.success {
    background: rgba(0, 255, 136, 0.1);
    color: var(--color-success);
  }

  .info-badge.error {
    background: rgba(255, 51, 102, 0.1);
    color: var(--color-error);
  }

  .info-badge.warning {
    background: rgba(255, 170, 0, 0.1);
    color: var(--color-warning);
  }

  /* Violations */
  .violations-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }

  .violation-item {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-primary);
    border-left: 3px solid var(--color-warning);
    border-radius: 4px;
  }

  .violation-item.error {
    border-left-color: var(--color-error);
  }

  .violation-header {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    font-size: 0.75rem;
  }

  .violation-severity {
    text-transform: uppercase;
    font-weight: 600;
    color: var(--color-warning);
  }

  .violation-item.error .violation-severity {
    color: var(--color-error);
  }

  .violation-predicate {
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .violation-message {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  /* JSON Details */
  .json-details {
    margin-top: var(--spacing-md);
  }

  .json-details summary {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .json-details summary:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .json-code {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--color-bg-primary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    overflow-x: auto;
  }

  /* Placeholder */
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-tertiary);
    text-align: center;
  }

  /* Error Message */
  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: rgba(255, 51, 102, 0.1);
    border: 1px solid var(--color-error);
    border-radius: 6px;
    color: var(--color-error);
  }

  .error-icon {
    font-size: 1.25rem;
  }
</style>
