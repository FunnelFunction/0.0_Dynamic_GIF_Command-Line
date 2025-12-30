/**
 * GIF ENCODER
 * ============
 * 
 * Encodes canvas frames into animated GIF.
 * Uses gifenc library for encoding.
 * 
 * This is the final ρ_q crystallization - 
 * where all emerged visuals freeze into the output artifact.
 */

import * as gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;

/**
 * Encode frames to GIF
 * 
 * @param {ImageData[]} frames - Array of ImageData from canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height  
 * @param {number} delay - Frame delay in ms (default 100ms = 10fps)
 * @returns {Uint8Array} - GIF data
 */
export function encode_frames_to_gif(frames, width, height, delay = 100) {
  const gif = GIFEncoder();
  
  for (const frame of frames) {
    // Get RGBA data
    const rgba = frame.data;
    
    // Quantize to 256 color palette
    const palette = quantize(rgba, 256);
    
    // Apply palette to get indexed pixels
    const indexed = applyPalette(rgba, palette);
    
    // Write frame
    gif.writeFrame(indexed, width, height, {
      palette,
      delay,
    });
  }
  
  gif.finish();
  
  return gif.bytes();
}

/**
 * Create a downloadable GIF blob
 */
export function create_gif_blob(gif_data) {
  return new Blob([gif_data], { type: 'image/gif' });
}

/**
 * Create object URL for preview
 */
export function create_gif_preview_url(gif_data) {
  const blob = create_gif_blob(gif_data);
  return URL.createObjectURL(blob);
}

/**
 * Download GIF file
 */
export function download_gif(gif_data, filename = 'dynamic.gif') {
  const blob = create_gif_blob(gif_data);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Simple static image (no animation) - just 1 frame
 */
export function encode_single_frame_gif(frame, width, height) {
  return encode_frames_to_gif([frame], width, height, 0);
}
