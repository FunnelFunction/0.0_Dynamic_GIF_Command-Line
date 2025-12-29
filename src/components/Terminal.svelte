<script>
  /**
   * TERMINAL COMPONENT
   *
   * Command-line interface for entering CLI commands.
   * Features autocomplete, history, and real-time validation feedback.
   */

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    commandInput,
    ui,
    executeCommand,
    clearCommand,
    clearHistory,
    parsedCommand,
    validatedManifest,
  } from '@state/stores.js';

  let inputElement;
  let currentCommand = '';
  let historyIndex = -1;
  let suggestions = [];
  let showSuggestions = false;

  // Reactive
  $: history = $ui.terminalHistory;
  $: currentCommand, updateSuggestions();

  // Methods
  function handleSubmit() {
    if (!currentCommand.trim()) return;

    executeCommand(currentCommand);
    currentCommand = '';
    historyIndex = -1;
    showSuggestions = false;

    // Scroll history to bottom
    setTimeout(() => {
      const historyEl = document.querySelector('.history');
      if (historyEl) {
        historyEl.scrollTop = historyEl.scrollHeight;
      }
    }, 0);
  }

  function handleKeyDown(event) {
    // Up arrow - previous command
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length > 0) {
        historyIndex = Math.min(historyIndex + 1, history.length - 1);
        currentCommand = history[history.length - 1 - historyIndex].command;
      }
    }

    // Down arrow - next command
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentCommand = history[history.length - 1 - historyIndex].command;
      } else if (historyIndex === 0) {
        historyIndex = -1;
        currentCommand = '';
      }
    }

    // Tab - autocomplete
    if (event.key === 'Tab' && suggestions.length > 0) {
      event.preventDefault();
      currentCommand = suggestions[0];
      showSuggestions = false;
    }

    // Escape - clear
    if (event.key === 'Escape') {
      currentCommand = '';
      showSuggestions = false;
    }
  }

  function updateSuggestions() {
    if (!currentCommand || currentCommand.length < 2) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    // Simple suggestions based on common patterns
    const commonCommands = [
      '#text=Hello World|canvas=1:1',
      '#scene=corporate|profile=auto_workspace_ai|text=Innovation',
      '#text=Launch|animation=fadeIn|export=gif',
      '#scene=minimal|text=Simple',
      '#profile=ceo/armstrong|text=Vision 2025',
    ];

    suggestions = commonCommands.filter(cmd =>
      cmd.toLowerCase().includes(currentCommand.toLowerCase())
    );

    showSuggestions = suggestions.length > 0;
  }

  function handleClearHistory() {
    if (confirm('Clear terminal history?')) {
      clearHistory();
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  onMount(() => {
    // Focus input on mount
    inputElement?.focus();
  });
</script>

<div class="terminal">
  <!-- Header -->
  <div class="terminal-header">
    <div class="header-title">
      <span class="title-icon">⌘</span>
      <span>Command Terminal</span>
    </div>
    <button class="clear-btn" on:click={handleClearHistory} title="Clear History">
      <span>🗑</span>
    </button>
  </div>

  <!-- History -->
  <div class="history">
    {#if history.length === 0}
      <div class="welcome-message">
        <p class="welcome-title">Welcome to AUTO-GIF-CUSTOMER</p>
        <p class="welcome-subtitle">Type a command to get started</p>
        <div class="example-commands">
          <p class="example-label">Try these examples:</p>
          <code>#text=Hello World|canvas=1:1</code>
          <code>#scene=corporate|profile=auto_workspace_ai</code>
          <code>#text=Innovation|animation=fadeIn</code>
        </div>
      </div>
    {:else}
      {#each history as entry (entry.timestamp)}
        <div class="history-entry" transition:fade>
          <div class="entry-meta">
            <span class="entry-time">{formatTime(entry.timestamp)}</span>
          </div>
          <div class="entry-command">
            <span class="prompt">$</span>
            <span class="command-text">{entry.command}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Input -->
  <div class="terminal-input">
    <div class="input-wrapper">
      <span class="prompt">$</span>
      <input
        bind:this={inputElement}
        bind:value={currentCommand}
        on:keydown={handleKeyDown}
        on:keypress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter command... (e.g., #text=Hello|canvas=1:1)"
        data-command-input
        class="command-input"
        autocomplete="off"
        spellcheck="false"
      />
    </div>

    <!-- Suggestions -->
    {#if showSuggestions}
      <div class="suggestions" transition:fade={{ duration: 150 }}>
        {#each suggestions.slice(0, 5) as suggestion}
          <button
            class="suggestion-item"
            on:click={() => {
              currentCommand = suggestion;
              showSuggestions = false;
              inputElement?.focus();
            }}
          >
            {suggestion}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Validation Feedback -->
  {#if $parsedCommand && !$parsedCommand.error}
    <div class="validation-feedback success" transition:fade>
      <span class="feedback-icon">✓</span>
      <span>Command parsed successfully</span>
    </div>
  {:else if $parsedCommand?.error}
    <div class="validation-feedback error" transition:fade>
      <span class="feedback-icon">✗</span>
      <span>{$parsedCommand.error}</span>
    </div>
  {/if}

  {#if $validatedManifest && !$validatedManifest.valid}
    <div class="validation-feedback warning" transition:fade>
      <span class="feedback-icon">⚠</span>
      <span>{$validatedManifest.violations.length} validation issue(s)</span>
    </div>
  {/if}

  <!-- Quick Actions -->
  <div class="quick-actions">
    <button class="action-btn" on:click={() => currentCommand = '#text=Hello|canvas=1:1'}>
      Basic Text
    </button>
    <button class="action-btn" on:click={() => currentCommand = '#scene=corporate|text=Innovation'}>
      Corporate
    </button>
    <button class="action-btn" on:click={() => currentCommand = '#animation=fadeIn|export=gif'}>
      Animated GIF
    </button>
  </div>

  <!-- Help Text -->
  <div class="help-text">
    <p><kbd>↑</kbd> <kbd>↓</kbd> Navigate history</p>
    <p><kbd>Tab</kbd> Autocomplete</p>
    <p><kbd>Enter</kbd> Execute</p>
    <p><kbd>Esc</kbd> Clear</p>
  </div>
</div>

<style>
  .terminal {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-bg-primary);
    font-family: var(--font-mono);
  }

  /* Header */
  .terminal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .title-icon {
    font-size: 1.25rem;
  }

  .clear-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 4px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .clear-btn:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-error);
  }

  /* History */
  .history {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    font-size: 0.875rem;
  }

  .welcome-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--color-text-tertiary);
  }

  .welcome-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .welcome-subtitle {
    margin-bottom: var(--spacing-lg);
  }

  .example-commands {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: flex-start;
  }

  .example-label {
    font-size: 0.75rem;
    margin-bottom: var(--spacing-xs);
  }

  .example-commands code {
    background: var(--color-bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: 0.75rem;
    color: var(--color-accent-primary);
  }

  .history-entry {
    margin-bottom: var(--spacing-md);
  }

  .entry-meta {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin-bottom: var(--spacing-xs);
  }

  .entry-command {
    display: flex;
    gap: var(--spacing-sm);
    color: var(--color-text-primary);
  }

  .prompt {
    color: var(--color-accent-primary);
    font-weight: 600;
  }

  .command-text {
    color: var(--color-text-secondary);
  }

  /* Input */
  .terminal-input {
    position: relative;
    padding: var(--spacing-md);
    border-top: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .command-input {
    flex: 1;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    outline: none;
    transition: all var(--transition-fast);
  }

  .command-input:focus {
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  .command-input::placeholder {
    color: var(--color-text-tertiary);
  }

  /* Suggestions */
  .suggestions {
    position: absolute;
    bottom: 100%;
    left: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-accent-primary);
    border-radius: 6px;
    margin-bottom: var(--spacing-xs);
    max-height: 200px;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
  }

  .suggestion-item {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .suggestion-item:hover {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
  }

  /* Validation Feedback */
  .validation-feedback {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.75rem;
    border-top: 1px solid var(--color-bg-tertiary);
  }

  .validation-feedback.success {
    background: rgba(0, 255, 136, 0.05);
    color: var(--color-success);
  }

  .validation-feedback.error {
    background: rgba(255, 51, 102, 0.05);
    color: var(--color-error);
  }

  .validation-feedback.warning {
    background: rgba(255, 170, 0, 0.05);
    color: var(--color-warning);
  }

  /* Quick Actions */
  .quick-actions {
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
  }

  .action-btn {
    flex: 1;
    padding: var(--spacing-xs);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 4px;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    background: var(--color-bg-primary);
    border-color: var(--color-accent-primary);
    color: var(--color-text-primary);
  }

  /* Help Text */
  .help-text {
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--color-bg-tertiary);
    background: var(--color-bg-secondary);
    font-size: 0.6875rem;
    color: var(--color-text-tertiary);
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .help-text p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .help-text kbd {
    background: var(--color-bg-tertiary);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }
</style>
