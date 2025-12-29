<script>
  /**
   * CANVAS COMPONENT
   *
   * Displays the final rendered SVG output.
   * This is where the converged visual state is shown.
   */

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { finalSVG, canvasDimensions, hasValidOutput } from '@state/stores.js';

  let canvasContainer;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  $: svgContent = $finalSVG?.svg || null;
  $: dimensions = $canvasDimensions;

  // Methods
  function handleZoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 3);
  }

  function handleZoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
  }

  function handleZoomReset() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
  }

  function handleMouseDown(event) {
    if (event.button === 0) { // Left click only
      isDragging = true;
      dragStartX = event.clientX - panX;
      dragStartY = event.clientY - panY;
      canvasContainer.style.cursor = 'grabbing';
    }
  }

  function handleMouseMove(event) {
    if (isDragging) {
      panX = event.clientX - dragStartX;
      panY = event.clientY - dragStartY;
    }
  }

  function handleMouseUp() {
    isDragging = false;
    if (canvasContainer) {
      canvasContainer.style.cursor = 'grab';
    }
  }

  function handleWheel(event) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    zoomLevel = Math.max(0.5, Math.min(3, zoomLevel + delta));
  }

  onMount(() => {
    if (canvasContainer) {
      canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener('wheel', handleWheel);
      }
    };
  });
</script>

<div class="canvas">
  <!-- Canvas Header -->
  <div class="canvas-header">
    <div class="header-title">
      <span class="title-icon">🎨</span>
      <span>Output Preview</span>
    </div>

    <div class="canvas-controls">
      <span class="zoom-label">{Math.round(zoomLevel * 100)}%</span>
      <button class="control-btn" on:click={handleZoomOut} title="Zoom Out">
        <span>−</span>
      </button>
      <button class="control-btn" on:click={handleZoomReset} title="Reset Zoom">
        <span>⊙</span>
      </button>
      <button class="control-btn" on:click={handleZoomIn} title="Zoom In">
        <span>+</span>
      </button>
    </div>
  </div>

  <!-- Canvas Container -->
  <div
    bind:this={canvasContainer}
    class="canvas-container"
    class:has-content={$hasValidOutput}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    role="img"
    aria-label="SVG Canvas"
  >
    {#if $hasValidOutput && svgContent}
      <div
        class="canvas-content"
        style="
          transform: translate({panX}px, {panY}px) scale({zoomLevel});
          width: {dimensions.width}px;
          height: {dimensions.height}px;
        "
        transition:fade={{ duration: 200 }}
      >
        {@html svgContent}
      </div>
    {:else}
      <div class="canvas-placeholder">
        <div class="placeholder-icon">⚡</div>
        <div class="placeholder-text">
          <p class="placeholder-title">Waiting for Output</p>
          <p class="placeholder-subtitle">
            Enter a command in the terminal to generate a visual
          </p>
        </div>
        <div class="placeholder-examples">
          <p class="examples-label">Quick examples:</p>
          <code>#text=Hello World|canvas=1:1</code>
          <code>#scene=corporate|text=Innovation</code>
        </div>
      </div>
    {/if}
  </div>

  <!-- Canvas Footer -->
  <div class="canvas-footer">
    <div class="footer-info">
      {#if $hasValidOutput}
        <span class="info-item">
          <span class="info-label">Dimensions:</span>
          <span class="info-value">{dimensions.width} × {dimensions.height}</span>
        </span>
        <span class="info-item">
          <span class="info-label">Zoom:</span>
          <span class="info-value">{Math.round(zoomLevel * 100)}%</span>
        </span>
      {:else}
        <span class="info-item">
          <span class="info-value">No output</span>
        </span>
      {/if}
    </div>

    <div class="footer-hint">
      <span>💡 Scroll to zoom • Drag to pan</span>
    </div>
  </div>
</div>

<style>
  .canvas {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: var(--color-bg-primary);
  }

  /* Header */
  .canvas-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-bg-tertiary);
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

  .canvas-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .zoom-label {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    min-width: 3.5rem;
    text-align: right;
  }

  .control-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-bg-tertiary);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 1.125rem;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .control-btn:hover {
    background: var(--color-bg-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-1px);
  }

  .control-btn:active {
    transform: translateY(0);
  }

  /* Container */
  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      repeating-linear-gradient(
        0deg,
        var(--color-bg-secondary) 0px,
        var(--color-bg-secondary) 1px,
        transparent 1px,
        transparent 20px
      ),
      repeating-linear-gradient(
        90deg,
        var(--color-bg-secondary) 0px,
        var(--color-bg-secondary) 1px,
        transparent 1px,
        transparent 20px
      );
    background-size: 20px 20px;
  }

  .canvas-container.has-content {
    cursor: grab;
  }

  .canvas-container.has-content:active {
    cursor: grabbing;
  }

  /* Content */
  .canvas-content {
    transform-origin: center;
    transition: transform 0.1s ease-out;
    box-shadow: var(--shadow-lg);
    background: white;
    border-radius: 8px;
  }

  .canvas-content :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Placeholder */
  .canvas-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-2xl);
    text-align: center;
    max-width: 500px;
  }

  .placeholder-icon {
    font-size: 4rem;
    opacity: 0.3;
  }

  .placeholder-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .placeholder-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  .placeholder-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  .placeholder-examples {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .examples-label {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .placeholder-examples code {
    display: block;
    background: var(--color-bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-primary);
  }

  /* Footer */
  .canvas-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-bg-tertiary);
    font-size: 0.75rem;
  }

  .footer-info {
    display: flex;
    gap: var(--spacing-md);
  }

  .info-item {
    display: flex;
    gap: var(--spacing-xs);
  }

  .info-label {
    color: var(--color-text-tertiary);
  }

  .info-value {
    color: var(--color-text-primary);
    font-family: var(--font-mono);
  }

  .footer-hint {
    color: var(--color-text-tertiary);
    font-size: 0.6875rem;
  }
</style>
