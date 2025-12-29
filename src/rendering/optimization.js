/**
 * OPTIMIZATION ENGINE
 *
 * Optimizes SVG output for smaller file sizes and better performance.
 *
 * Optimizations:
 * - Remove unnecessary whitespace
 * - Simplify paths
 * - Merge duplicate definitions
 * - Remove metadata and comments
 * - Precision reduction for coordinates
 * - Minification
 *
 * @module rendering/optimization
 */

/**
 * Optimization Engine
 *
 * Applies various optimization techniques to SVG content.
 */
export class OptimizationEngine {
  constructor(options = {}) {
    this.options = {
      removeComments: true,
      removeMetadata: true,
      removeWhitespace: true,
      simplifyPaths: true,
      mergeDuplicates: true,
      precision: 2, // Decimal places for coordinates
      minify: true,
      ...options,
    };

    // Statistics
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      reductionPercent: 0,
    };
  }

  /**
   * Optimize SVG
   *
   * @param {string} svg - SVG string
   * @param {Object} options - Override options
   * @returns {string} Optimized SVG
   */
  optimize(svg, options = {}) {
    const opts = { ...this.options, ...options };

    this.stats.originalSize = new Blob([svg]).size;

    let optimized = svg;

    // Apply optimizations in sequence
    if (opts.removeComments) {
      optimized = this.removeComments(optimized);
    }

    if (opts.removeMetadata) {
      optimized = this.removeMetadata(optimized);
    }

    if (opts.removeWhitespace) {
      optimized = this.removeWhitespace(optimized);
    }

    if (opts.simplifyPaths) {
      optimized = this.simplifyPaths(optimized, opts.precision);
    }

    if (opts.mergeDuplicates) {
      optimized = this.mergeDuplicates(optimized);
    }

    if (opts.minify) {
      optimized = this.minify(optimized);
    }

    this.stats.optimizedSize = new Blob([optimized]).size;
    this.stats.reductionPercent =
      ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize) * 100;

    return optimized;
  }

  /**
   * Remove XML/HTML comments
   *
   * @param {string} svg - SVG string
   * @returns {string} SVG without comments
   */
  removeComments(svg) {
    return svg.replace(/<!--[\s\S]*?-->/g, '');
  }

  /**
   * Remove metadata tags
   *
   * @param {string} svg - SVG string
   * @returns {string} SVG without metadata
   */
  removeMetadata(svg) {
    // Remove common metadata tags
    return svg
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      .replace(/<title[\s\S]*?<\/title>/gi, '')
      .replace(/<desc[\s\S]*?<\/desc>/gi, '');
  }

  /**
   * Remove unnecessary whitespace
   *
   * @param {string} svg - SVG string
   * @returns {string} SVG without extra whitespace
   */
  removeWhitespace(svg) {
    return svg
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+(\/?>)/g, '$1') // Remove whitespace before tag close
      .trim();
  }

  /**
   * Simplify path data
   *
   * @param {string} svg - SVG string
   * @param {number} precision - Decimal precision
   * @returns {string} SVG with simplified paths
   */
  simplifyPaths(svg, precision = 2) {
    return svg.replace(/d="([^"]*)"/g, (match, pathData) => {
      // Round path coordinates to specified precision
      const simplified = pathData.replace(/(\d+\.\d+)/g, (num) => {
        return parseFloat(num).toFixed(precision);
      });

      return `d="${simplified}"`;
    });
  }

  /**
   * Merge duplicate definitions
   *
   * @param {string} svg - SVG string
   * @returns {string} SVG with merged duplicates
   */
  mergeDuplicates(svg) {
    // This is a simplified implementation
    // In production, you'd use a proper SVG parser

    // Find and merge duplicate gradient definitions
    const gradients = new Map();
    let optimized = svg;

    // Extract gradients
    const gradientRegex = /<(linearGradient|radialGradient)[^>]*id="([^"]*)"[^>]*>[\s\S]*?<\/\1>/g;
    let match;

    while ((match = gradientRegex.exec(svg)) !== null) {
      const [fullMatch, type, id] = match;
      const content = fullMatch;

      // Check if we've seen this gradient content before
      let existingId = null;
      for (const [key, value] of gradients.entries()) {
        if (value === content) {
          existingId = key;
          break;
        }
      }

      if (existingId) {
        // Replace references to duplicate gradient
        optimized = optimized.replace(new RegExp(`url\\(#${id}\\)`, 'g'), `url(#${existingId})`);
        // Remove duplicate definition
        optimized = optimized.replace(fullMatch, '');
      } else {
        gradients.set(id, content);
      }
    }

    return optimized;
  }

  /**
   * Minify SVG
   *
   * @param {string} svg - SVG string
   * @returns {string} Minified SVG
   */
  minify(svg) {
    return svg
      .replace(/\s*=\s*/g, '=') // Remove spaces around =
      .replace(/"\s+/g, '" ') // Single space after attribute
      .replace(/\s+"/g, '"') // No space before quote
      .replace(/;\s*/g, ';') // Remove space after semicolon
      .replace(/:\s*/g, ':') // Remove space after colon
      .replace(/,\s*/g, ',') // Remove space after comma
      .trim();
  }

  /**
   * Round numeric attributes
   *
   * @param {string} svg - SVG string
   * @param {number} precision - Decimal precision
   * @returns {string} SVG with rounded numbers
   */
  roundNumbers(svg, precision = 2) {
    // Round numbers in common attributes
    const attrs = ['x', 'y', 'cx', 'cy', 'r', 'width', 'height', 'opacity', 'stroke-width'];

    let optimized = svg;

    for (const attr of attrs) {
      const regex = new RegExp(`${attr}="(\\d+\\.\\d+)"`, 'g');
      optimized = optimized.replace(regex, (match, num) => {
        return `${attr}="${parseFloat(num).toFixed(precision)}"`;
      });
    }

    return optimized;
  }

  /**
   * Remove default attribute values
   *
   * @param {string} svg - SVG string
   * @returns {string} SVG without default attributes
   */
  removeDefaults(svg) {
    // Remove common default values
    const defaults = {
      'fill-opacity': '1',
      'stroke-opacity': '1',
      'opacity': '1',
      'stroke-width': '1',
    };

    let optimized = svg;

    for (const [attr, value] of Object.entries(defaults)) {
      const regex = new RegExp(`\\s${attr}="${value}"`, 'g');
      optimized = optimized.replace(regex, '');
    }

    return optimized;
  }

  /**
   * Get optimization statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      reductionPercent: 0,
    };
  }
}

export default OptimizationEngine;
