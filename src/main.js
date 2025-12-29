/**
 * MAIN ENTRY POINT
 *
 * Initializes the Auto-GIF-Customer application.
 * Mounts the Svelte app and sets up global configurations.
 *
 * @module main
 */

import App from './App.svelte';

// Application version (injected by Vite)
const APP_VERSION = __APP_VERSION__;
const BUILD_TIME = __BUILD_TIME__;
const COMMIT_HASH = __COMMIT_HASH__;

// Log startup info
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        AUTO-GIF-CUSTOMER v${APP_VERSION}                    ║
║        Command-Line Diffuser Lattice Matrix                 ║
║                                                              ║
║        Self-Resolving Visual Computation Engine             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Build: ${BUILD_TIME}
Commit: ${COMMIT_HASH}
Environment: ${import.meta.env.MODE}

Mathematical Foundation:
  • Riemannian Manifold Geometry
  • Finite State Machine Validation
  • Fiber Bundle Emergence
  • Gradient Flow Convergence
  • Morse Theory Escape Paths

Initializing lattice brain...
`);

/**
 * Initialize the application
 */
function initializeApp() {
  const targetElement = document.getElementById('app');

  if (!targetElement) {
    console.error('Failed to find #app mount point');
    return;
  }

  // Mount Svelte application
  const app = new App({
    target: targetElement,
    props: {
      version: APP_VERSION,
      buildTime: BUILD_TIME,
    },
  });

  // Expose app instance for debugging (dev only)
  if (import.meta.env.DEV) {
    window.__AUTO_GIF_APP__ = app;
    console.log('Dev mode: App instance available at window.__AUTO_GIF_APP__');
  }

  // Register service worker (production only)
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('ServiceWorker registered:', registration.scope);
        },
        (error) => {
          console.log('ServiceWorker registration failed:', error);
        }
      );
    });
  }

  // Log successful initialization
  console.log('✓ Lattice brain initialized');
  console.log('✓ Svelte app mounted');
  console.log('Ready for commands.');

  return app;
}

/**
 * Error handler for global errors
 */
function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    // In production, you might want to send this to an error tracking service
    if (import.meta.env.PROD) {
      // Example: sendToErrorTracker(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // In production, send to error tracking
    if (import.meta.env.PROD) {
      // Example: sendToErrorTracker(event.reason);
    }
  });
}

/**
 * Performance monitoring
 */
function setupPerformanceMonitoring() {
  if (import.meta.env.DEV && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Performance Metrics:');
          console.log(`  DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
          console.log(`  Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
          console.log(`  Total Page Load: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }
      }, 0);
    });
  }
}

/**
 * Keyboard shortcuts setup
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + K: Focus command input
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const commandInput = document.querySelector('[data-command-input]');
      if (commandInput) {
        commandInput.focus();
      }
    }

    // Ctrl/Cmd + /: Show help
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      // Dispatch custom event that App.svelte will listen to
      window.dispatchEvent(new CustomEvent('show-help'));
    }

    // Escape: Clear/blur command input
    if (event.key === 'Escape') {
      const commandInput = document.querySelector('[data-command-input]');
      if (commandInput && document.activeElement === commandInput) {
        commandInput.blur();
      }
    }
  });
}

/**
 * Bootstrap the application
 */
function bootstrap() {
  try {
    // Setup error handling first
    setupErrorHandling();

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Initialize the main app
    const app = initializeApp();

    // Log welcome message
    console.log('%c💡 Tip: Type a command to get started', 'color: #00d4ff; font-weight: bold;');
    console.log('%cExample: #text=Hello World|canvas=1:1|export=png', 'color: #70708c; font-style: italic;');

    return app;
  } catch (error) {
    console.error('Failed to bootstrap application:', error);

    // Show error UI
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          text-align: center;
          font-family: monospace;
        ">
          <h1 style="color: #ff3366; font-size: 2rem; margin-bottom: 1rem;">
            Failed to Initialize
          </h1>
          <p style="color: #a0a0b8; margin-bottom: 1rem;">
            The application failed to start. Check the console for details.
          </p>
          <pre style="
            background: #13131a;
            color: #e8e8f0;
            padding: 1rem;
            border-radius: 8px;
            max-width: 600px;
            overflow-x: auto;
            text-align: left;
          ">${error.stack || error.message}</pre>
          <button
            onclick="location.reload()"
            style="
              margin-top: 1rem;
              padding: 0.75rem 1.5rem;
              background: #00d4ff;
              color: #0a0a0f;
              border: none;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      `;
    }

    throw error;
  }
}

// Start the application
const app = bootstrap();

// Export for HMR (Hot Module Replacement)
export default app;
