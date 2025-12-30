/**
 * MAIN ENTRY POINT
 * =================
 * 
 * Dynamic GIF Command-Line
 * URL → Manifest → Emergence → GIF
 * 
 * Based on:
 *   - Intent Tensor Theory (pre-emergent dynamics)
 *   - SceneScript (URL as visual programming language)
 *   - Writable Doctrine (pre-execution validation)
 *   - Ghostless Architecture (self-documenting code)
 */

import { parse_command_string_into_manifest, extract_manifest_from_url } from './core/manifest.js';
import { validate_manifest_as_writable, get_validated_manifest_or_ground_state, format_validation_result } from './core/validator.js';
import { create_render_context, render_frame_from_manifest, generate_animation_frames } from './core/renderer.js';
import { encode_frames_to_gif, download_gif, create_gif_preview_url } from './rendering/gif.js';

// ============================================================================
// APPLICATION STATE
// ============================================================================

const APP_STATE = {
  current_manifest: null,
  current_gif_data: null,
  is_rendering: false,
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM = {
  command_input: null,
  preview_canvas: null,
  status_container: null,
  render_btn: null,
  download_btn: null,
  example_items: null,
};

// ============================================================================
// STATUS DISPLAY
// ============================================================================

function show_status(message, type = 'info') {
  DOM.status_container.innerHTML = `<div class="status ${type}">${message}</div>`;
}

function clear_status() {
  DOM.status_container.innerHTML = '';
}

// ============================================================================
// CORE PIPELINE
// ============================================================================

/**
 * Execute the full pipeline: Command → GIF
 */
async function execute_pipeline(command_string) {
  if (APP_STATE.is_rendering) return;
  
  APP_STATE.is_rendering = true;
  DOM.render_btn.disabled = true;
  DOM.download_btn.disabled = true;
  
  try {
    console.log('📝 Parsing command:', command_string);
    
    // 1. PARSE: Command string → Manifest
    const raw_manifest = parse_command_string_into_manifest(command_string);
    console.log('📋 Raw manifest:', raw_manifest);
    
    // 2. VALIDATE: Manifest → Writable Gate
    const validation = get_validated_manifest_or_ground_state(raw_manifest);
    console.log('✅ Validation:', validation);
    
    if (!validation.valid) {
      show_status(`⚠️ Validation warnings (using defaults):\n${validation.validation.errors.join('\n')}`, 'info');
    } else {
      show_status('✓ Manifest validated', 'success');
    }
    
    const manifest = validation.manifest;
    APP_STATE.current_manifest = manifest;
    
    // 3. RESIZE CANVAS to manifest dimensions
    DOM.preview_canvas.width = manifest.canvas.width;
    DOM.preview_canvas.height = manifest.canvas.height;
    
    // 4. CREATE RENDER CONTEXT
    const render_ctx = create_render_context(DOM.preview_canvas);
    
    // 5. DETERMINE if animated
    const is_animated = manifest.params.animate && manifest.params.animate !== 'none';
    const frame_count = is_animated ? 30 : 1;
    const frame_delay = is_animated ? 50 : 0;  // 50ms = 20fps
    
    show_status(`🎨 Rendering ${frame_count} frame(s)...`, 'info');
    
    // 6. RENDER FRAMES
    const frames = generate_animation_frames(render_ctx, manifest, frame_count);
    
    // 7. ENCODE TO GIF
    show_status('📦 Encoding GIF...', 'info');
    const gif_data = encode_frames_to_gif(frames, manifest.canvas.width, manifest.canvas.height, frame_delay);
    APP_STATE.current_gif_data = gif_data;
    
    // 8. SHOW PREVIEW
    // For animated preview, show as GIF
    if (is_animated) {
      const preview_url = create_gif_preview_url(gif_data);
      const img = new Image();
      img.src = preview_url;
      img.onload = () => {
        const ctx = DOM.preview_canvas.getContext('2d');
        // Display the final frame
        render_frame_from_manifest(render_ctx, manifest, 1);
      };
    }
    
    show_status(`✓ GIF ready! ${gif_data.length} bytes, ${frame_count} frames`, 'success');
    DOM.download_btn.disabled = false;
    
    // Update URL hash
    window.history.replaceState(null, '', '#' + command_string);
    
  } catch (error) {
    console.error('Pipeline error:', error);
    show_status(`❌ Error: ${error.message}`, 'error');
  } finally {
    APP_STATE.is_rendering = false;
    DOM.render_btn.disabled = false;
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function handle_command_submit(event) {
  if (event.key === 'Enter') {
    const command = DOM.command_input.value.trim();
    if (command) {
      execute_pipeline(command);
    }
  }
}

function handle_render_click() {
  const command = DOM.command_input.value.trim();
  if (command) {
    execute_pipeline(command);
  }
}

function handle_download_click() {
  if (APP_STATE.current_gif_data) {
    const manifest = APP_STATE.current_manifest;
    const text = manifest?.params?.text || 'dynamic';
    const safe_name = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    download_gif(APP_STATE.current_gif_data, `${safe_name}.gif`);
  }
}

function handle_example_click(event) {
  const example_item = event.target.closest('.example-item');
  if (example_item) {
    const command = example_item.dataset.cmd;
    DOM.command_input.value = command;
    execute_pipeline(command);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initialize_app() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        DYNAMIC GIF COMMAND-LINE v1.0                         ║
║        URL → Manifest → Emergence → GIF                      ║
║                                                              ║
║        Built on Intent Tensor Theory                         ║
║        Pre-Emergent Visual Dynamics                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
  
  // Get DOM elements
  DOM.command_input = document.getElementById('command-input');
  DOM.preview_canvas = document.getElementById('preview-canvas');
  DOM.status_container = document.getElementById('status-container');
  DOM.render_btn = document.getElementById('render-btn');
  DOM.download_btn = document.getElementById('download-btn');
  DOM.example_items = document.querySelectorAll('.example-item');
  
  // Event listeners
  DOM.command_input.addEventListener('keydown', handle_command_submit);
  DOM.render_btn.addEventListener('click', handle_render_click);
  DOM.download_btn.addEventListener('click', handle_download_click);
  
  // Example clicks
  document.querySelector('.example-list')?.addEventListener('click', handle_example_click);
  
  // Check URL for initial command
  const url_manifest = extract_manifest_from_url();
  if (url_manifest.raw) {
    DOM.command_input.value = url_manifest.raw;
    execute_pipeline(url_manifest.raw);
  } else {
    // Render default preview
    const default_command = 'scene=minimal|text=Dynamic GIF|canvas=1:1';
    DOM.command_input.value = default_command;
    execute_pipeline(default_command);
  }
  
  console.log('✓ App initialized');
}

// Start app when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize_app);
} else {
  initialize_app();
}
