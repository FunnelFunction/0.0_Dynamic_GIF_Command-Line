/**
 * CANVAS RENDERER
 * ================
 * 
 * Renders the emerged manifest to HTML5 Canvas.
 * Takes validated manifest → produces visual output.
 * 
 * This is where ρ_q (boundary charge) becomes pixels.
 */

import { emerge_circle, emerge_rectangle, emerge_text_region } from './primitives.js';

/**
 * Create a rendering context with helpers
 */
export function create_render_context(canvas) {
  const ctx = canvas.getContext('2d');
  
  return {
    canvas,
    ctx,
    width: canvas.width,
    height: canvas.height,
  };
}

/**
 * Clear canvas with background
 */
export function clear_canvas_with_background(render_ctx, manifest) {
  const { ctx, width, height } = render_ctx;
  const { palette, params } = manifest;
  
  const bg_type = params.bg || 'gradient';
  
  if (bg_type === 'solid' || manifest.scene?.background === 'solid') {
    ctx.fillStyle = palette.primary;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    if (palette.gradient && palette.gradient.length > 0) {
      palette.gradient.forEach((color, i) => {
        gradient.addColorStop(i / (palette.gradient.length - 1), color);
      });
    } else {
      gradient.addColorStop(0, palette.primary);
      gradient.addColorStop(1, palette.secondary);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

/**
 * Render text element
 */
export function render_text_element(render_ctx, manifest, frame_progress = 1) {
  const { ctx, width, height } = render_ctx;
  const { palette, params } = manifest;
  
  const text = params.text || 'Dynamic GIF';
  const font_size = parseInt(params.fontsize) || Math.floor(height / 8);
  const font_family = params.font || 'Arial, sans-serif';
  const text_color = params.color || palette.text;
  const align = params.align || 'center';
  
  // Apply animation
  const animate = params.animate || 'none';
  let alpha = 1;
  let scale = 1;
  let offset_y = 0;
  
  switch (animate) {
    case 'fadeIn':
      alpha = frame_progress;
      break;
    case 'fadeOut':
      alpha = 1 - frame_progress;
      break;
    case 'pulse':
      scale = 1 + 0.1 * Math.sin(frame_progress * Math.PI * 2);
      break;
    case 'grow':
      scale = 0.5 + 0.5 * frame_progress;
      alpha = frame_progress;
      break;
    case 'slide':
      offset_y = (1 - frame_progress) * height * 0.3;
      break;
  }
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Position text
  let x = width / 2;
  let y = height / 2 + offset_y;
  
  if (params.x) {
    if (params.x.endsWith('%')) {
      x = (parseFloat(params.x) / 100) * width;
    } else {
      x = parseFloat(params.x);
    }
  }
  
  if (params.y) {
    if (params.y.endsWith('%')) {
      y = (parseFloat(params.y) / 100) * height;
    } else {
      y = parseFloat(params.y);
    }
  }
  
  // Apply scale transform
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-x, -y);
  
  // Set font
  ctx.font = `bold ${font_size}px ${font_family}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  
  // Optional: text shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Draw text
  ctx.fillStyle = text_color;
  ctx.fillText(text, x, y);
  
  // Accent underline
  if (params.underline === 'true') {
    const metrics = ctx.measureText(text);
    const text_width = metrics.width;
    const underline_y = y + font_size / 2 + 5;
    
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - text_width / 2, underline_y);
    ctx.lineTo(x + text_width / 2, underline_y);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Render shape element (circle, rectangle, etc.)
 */
export function render_shape_element(render_ctx, manifest, frame_progress = 1) {
  const { ctx, width, height } = render_ctx;
  const { palette, params } = manifest;
  
  const shape = params.shape;
  if (!shape) return;
  
  const fill = params.fill || palette.accent;
  const stroke = params.stroke || 'transparent';
  const stroke_width = parseInt(params.strokewidth) || 2;
  
  // Animation
  const animate = params.animate || 'none';
  let scale = 1;
  let alpha = 1;
  
  switch (animate) {
    case 'grow':
      scale = frame_progress;
      alpha = frame_progress;
      break;
    case 'pulse':
      scale = 1 + 0.15 * Math.sin(frame_progress * Math.PI * 2);
      break;
    case 'fadeIn':
      alpha = frame_progress;
      break;
  }
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Position (default center)
  let cx = width / 2;
  let cy = height / 2;
  
  if (params.x) {
    cx = params.x.endsWith('%') ? (parseFloat(params.x) / 100) * width : parseFloat(params.x);
  }
  if (params.y) {
    cy = params.y.endsWith('%') ? (parseFloat(params.y) / 100) * height : parseFloat(params.y);
  }
  
  // Size
  const size = parseInt(params.size) || Math.min(width, height) * 0.3;
  
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = stroke_width;
  
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      if (stroke !== 'transparent') ctx.stroke();
      break;
      
    case 'rectangle':
    case 'rect':
      ctx.fillRect(-size / 2, -size / 2, size, size);
      if (stroke !== 'transparent') ctx.strokeRect(-size / 2, -size / 2, size, size);
      break;
      
    case 'triangle':
      const h = size * (Math.sqrt(3) / 2);
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(-size / 2, h / 2);
      ctx.lineTo(size / 2, h / 2);
      ctx.closePath();
      ctx.fill();
      if (stroke !== 'transparent') ctx.stroke();
      break;
  }
  
  ctx.restore();
}

/**
 * Render sparkle/particle effects
 */
export function render_particles(render_ctx, manifest, frame_progress = 1) {
  const { ctx, width, height } = render_ctx;
  const { palette, params } = manifest;
  
  const animate = params.animate;
  if (animate !== 'sparkle') return;
  
  const particle_count = 20;
  
  ctx.save();
  
  for (let i = 0; i < particle_count; i++) {
    // Deterministic "random" positions based on index
    const seed_x = (i * 7919) % 1000 / 1000;
    const seed_y = (i * 6173) % 1000 / 1000;
    const seed_phase = (i * 3571) % 1000 / 1000;
    
    const x = seed_x * width;
    const y = seed_y * height;
    
    // Twinkle effect
    const twinkle = Math.sin((frame_progress + seed_phase) * Math.PI * 2);
    const alpha = 0.3 + 0.7 * Math.max(0, twinkle);
    const size = 2 + 4 * Math.max(0, twinkle);
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

/**
 * Render a single frame from manifest
 */
export function render_frame_from_manifest(render_ctx, manifest, frame_progress = 1) {
  // 1. Clear and draw background
  clear_canvas_with_background(render_ctx, manifest);
  
  // 2. Render particles (behind text)
  render_particles(render_ctx, manifest, frame_progress);
  
  // 3. Render shape (if specified)
  render_shape_element(render_ctx, manifest, frame_progress);
  
  // 4. Render text
  render_text_element(render_ctx, manifest, frame_progress);
}

/**
 * Generate all frames for animation
 */
export function generate_animation_frames(render_ctx, manifest, frame_count = 30) {
  const frames = [];
  
  for (let i = 0; i < frame_count; i++) {
    const progress = i / (frame_count - 1);
    render_frame_from_manifest(render_ctx, manifest, progress);
    
    // Capture frame data
    frames.push(render_ctx.ctx.getImageData(0, 0, render_ctx.width, render_ctx.height));
  }
  
  return frames;
}
