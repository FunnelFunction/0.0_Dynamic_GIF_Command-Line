/**
 * EXPORT ENGINE
 *
 * Handles exporting converged visual states to various formats:
 * - PNG (raster image)
 * - GIF (animated or static)
 * - PDF (vector document)
 * - SVG (raw vector)
 *
 * @module rendering/export
 */

import { GIFComposer } from './gif-composer.js';
import { OptimizationEngine } from './optimization.js';

/**
 * Export converged state as specified format
 *
 * @param {Object} svgData - SVG output from generator
 * @param {Object} state - Converged state
 * @param {string} format - Export format (png, gif, pdf, svg)
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} Exported file as blob
 */
export async function exportAs(svgData, state, format = 'png', options = {}) {
  console.log(`Exporting as ${format}...`);

  // Optimize SVG first
  const optimizer = new OptimizationEngine();
  const optimizedSVG = optimizer.optimize(svgData.svg, options);

  switch (format.toLowerCase()) {
    case 'png':
      return await exportAsPNG(optimizedSVG, options);

    case 'gif':
      return await exportAsGIF(optimizedSVG, state, options);

    case 'pdf':
      return await exportAsPDF(optimizedSVG, options);

    case 'svg':
      return exportAsSVG(optimizedSVG, options);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Export as PNG (raster image)
 *
 * @param {string} svg - SVG string
 * @param {Object} options - Options
 * @returns {Promise<Blob>} PNG blob
 */
async function exportAsPNG(svg, options = {}) {
  const {
    scale = 1,
    backgroundColor = 'transparent',
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Fill background
        if (backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw SVG
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        // Convert to PNG blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              downloadBlob(blob, 'output.png');
              resolve(blob);
            } else {
              reject(new Error('Failed to create PNG blob'));
            }
          },
          'image/png',
          1.0
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG as image'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export as GIF (animated or static)
 *
 * @param {string} svg - SVG string
 * @param {Object} state - Converged state with animation data
 * @param {Object} options - Options
 * @returns {Promise<Blob>} GIF blob
 */
async function exportAsGIF(svg, state, options = {}) {
  const {
    fps = 30,
    duration = 2000, // ms
    loop = 0, // 0 = infinite
    optimize = true,
  } = options;

  // Check if state has animation
  const hasAnimation = state?.animation && state.animation.type !== 'none';

  if (!hasAnimation) {
    // Export static GIF (single frame)
    return exportStaticGIF(svg, options);
  }

  // Export animated GIF
  const composer = new GIFComposer({
    width: state.canvas?.width || 1080,
    height: state.canvas?.height || 1080,
    fps,
    loop,
    optimize,
  });

  try {
    // Generate frames from animation state
    await composer.addFramesFromState(state, svg, { duration, fps });

    // Compose final GIF
    const gifBlob = await composer.compose();

    // Download
    downloadBlob(gifBlob, 'output.gif');

    return gifBlob;
  } catch (error) {
    console.error('GIF export failed:', error);
    throw error;
  }
}

/**
 * Export static GIF (single frame)
 *
 * @param {string} svg - SVG string
 * @param {Object} options - Options
 * @returns {Promise<Blob>} GIF blob
 */
async function exportStaticGIF(svg, options = {}) {
  // Convert SVG to PNG first, then to GIF
  const pngBlob = await exportAsPNG(svg, { ...options, scale: 1 });

  // For now, just return the PNG as a "GIF" (we'll improve this)
  // In production, you'd use a proper GIF encoder here
  console.warn('Static GIF export: returning PNG (proper GIF encoding not implemented)');

  downloadBlob(pngBlob, 'output.gif');
  return pngBlob;
}

/**
 * Export as PDF (vector document)
 *
 * @param {string} svg - SVG string
 * @param {Object} options - Options
 * @returns {Promise<Blob>} PDF blob
 */
async function exportAsPDF(svg, options = {}) {
  const {
    pageSize = 'letter',
    margin = 0,
  } = options;

  // This is a placeholder for PDF export
  // In production, you'd use a library like jsPDF or pdf-lib
  console.warn('PDF export not yet implemented');

  // For now, convert to data URI and create a downloadable blob
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });

  // In a real implementation:
  // - Use pdf-lib or jsPDF
  // - Embed SVG or convert to image
  // - Set proper page size and margins

  downloadBlob(svgBlob, 'output.pdf');
  return svgBlob;
}

/**
 * Export as SVG (raw vector)
 *
 * @param {string} svg - SVG string
 * @param {Object} options - Options
 * @returns {Blob} SVG blob
 */
function exportAsSVG(svg, options = {}) {
  const {
    pretty = true,
  } = options;

  // Pretty print if requested
  let finalSVG = svg;
  if (pretty) {
    // Basic prettification (in production, use a proper formatter)
    finalSVG = svg
      .replace(/></g, '>\n<')
      .replace(/\n\s*\n/g, '\n');
  }

  const blob = new Blob([finalSVG], { type: 'image/svg+xml;charset=utf-8' });

  downloadBlob(blob, 'output.svg');
  return blob;
}

/**
 * Download blob as file
 *
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get file extension for format
 *
 * @param {string} format - Format
 * @returns {string} Extension
 */
export function getExtension(format) {
  const extensions = {
    png: 'png',
    gif: 'gif',
    pdf: 'pdf',
    svg: 'svg',
  };

  return extensions[format.toLowerCase()] || 'png';
}

/**
 * Get MIME type for format
 *
 * @param {string} format - Format
 * @returns {string} MIME type
 */
export function getMimeType(format) {
  const mimeTypes = {
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    svg: 'image/svg+xml',
  };

  return mimeTypes[format.toLowerCase()] || 'image/png';
}

/**
 * Estimate file size
 *
 * @param {string} svg - SVG string
 * @param {string} format - Format
 * @returns {number} Estimated size in bytes
 */
export function estimateFileSize(svg, format) {
  const baseSize = new Blob([svg]).size;

  // Rough multipliers based on format
  const multipliers = {
    png: 2.5,
    gif: 3.0,
    pdf: 1.5,
    svg: 1.0,
  };

  return Math.round(baseSize * (multipliers[format] || 1.0));
}

export default {
  exportAs,
  getExtension,
  getMimeType,
  estimateFileSize,
};
