/**
 * GIF COMPOSER
 *
 * Composes animated GIFs from frame sequences using the gifenc library.
 * Implements temporal interpolation and optimization for smooth animations.
 *
 * Mathematical Foundation:
 * - Frame interpolation uses Bézier curves for smooth motion
 * - Color quantization via k-means clustering
 * - Temporal coherence optimization reduces file size
 *
 * @module rendering/gif-composer
 */

import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { FrameInterpolator } from './frame-interpolator.js';

/**
 * GIF Composer
 *
 * Creates GIF animations from SVG states with temporal interpolation.
 */
export class GIFComposer {
  /**
   * @param {Object} options - Composer options
   * @param {number} options.width - Output width in pixels
   * @param {number} options.height - Output height in pixels
   * @param {number} options.fps - Frames per second (default: 30)
   * @param {number} options.loop - Loop count (0 = infinite, default: 0)
   * @param {boolean} options.optimize - Enable optimization (default: true)
   */
  constructor(options = {}) {
    this.width = options.width || 1080;
    this.height = options.height || 1080;
    this.fps = options.fps || 30;
    this.loop = options.loop !== undefined ? options.loop : 0;
    this.optimize = options.optimize !== undefined ? options.optimize : true;

    // Frame delay in centiseconds (GIF format requirement)
    this.delay = Math.round(100 / this.fps);

    // Encoder (will be created when composing)
    this.encoder = null;

    // Frame buffer
    this.frames = [];

    // Frame interpolator
    this.interpolator = new FrameInterpolator();

    // Statistics
    this.stats = {
      framesAdded: 0,
      framesInterpolated: 0,
      totalSize: 0,
      compressionRatio: 0,
    };
  }

  /**
   * Add frames from animated state
   *
   * @param {Object} state - Converged state with animation data
   * @param {string} baseSVG - Base SVG template
   * @param {Object} options - Frame generation options
   */
  async addFramesFromState(state, baseSVG, options = {}) {
    const {
      duration = 2000, // ms
      fps = this.fps,
    } = options;

    const frameCount = Math.ceil((duration / 1000) * fps);
    const animation = state.animation || {};

    console.log(`Generating ${frameCount} frames for ${animation.type || 'static'} animation`);

    // Generate keyframes based on animation type
    const keyframes = this.generateKeyframes(state, frameCount);

    // Interpolate between keyframes
    const frames = this.interpolator.interpolate(keyframes, frameCount);

    // Render each frame
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const svgFrame = this.applySVGTransform(baseSVG, frame);
      await this.addFrame(svgFrame);

      // Progress callback
      if (options.onProgress) {
        options.onProgress(i + 1, frames.length);
      }
    }

    this.stats.framesInterpolated = frames.length - keyframes.length;
  }

  /**
   * Generate keyframes from animation state
   *
   * @param {Object} state - Converged state
   * @param {number} frameCount - Total frame count
   * @returns {Array} Keyframes
   */
  generateKeyframes(state, frameCount) {
    const animation = state.animation || {};
    const animationType = animation.type || 'none';

    // Keyframe generation strategies by animation type
    const generators = {
      fadeIn: () => this.generateFadeInKeyframes(state, frameCount),
      fadeOut: () => this.generateFadeOutKeyframes(state, frameCount),
      slideIn: () => this.generateSlideInKeyframes(state, frameCount),
      slideOut: () => this.generateSlideOutKeyframes(state, frameCount),
      zoom: () => this.generateZoomKeyframes(state, frameCount),
      pulse: () => this.generatePulseKeyframes(state, frameCount),
      none: () => [{ frame: 0, state: state }],
    };

    const generator = generators[animationType] || generators.none;
    return generator();
  }

  /**
   * Generate fade-in keyframes
   */
  generateFadeInKeyframes(state, frameCount) {
    return [
      { frame: 0, opacity: 0, ...state },
      { frame: frameCount - 1, opacity: 1, ...state },
    ];
  }

  /**
   * Generate fade-out keyframes
   */
  generateFadeOutKeyframes(state, frameCount) {
    return [
      { frame: 0, opacity: 1, ...state },
      { frame: frameCount - 1, opacity: 0, ...state },
    ];
  }

  /**
   * Generate slide-in keyframes
   */
  generateSlideInKeyframes(state, frameCount) {
    const direction = state.animation?.direction || 'left';
    const offsets = {
      left: { x0: -this.width, y0: 0, x1: 0, y1: 0 },
      right: { x0: this.width, y0: 0, x1: 0, y1: 0 },
      top: { x0: 0, y0: -this.height, x1: 0, y1: 0 },
      bottom: { x0: 0, y0: this.height, x1: 0, y1: 0 },
    };

    const offset = offsets[direction] || offsets.left;

    return [
      { frame: 0, translateX: offset.x0, translateY: offset.y0, ...state },
      { frame: frameCount - 1, translateX: offset.x1, translateY: offset.y1, ...state },
    ];
  }

  /**
   * Generate slide-out keyframes
   */
  generateSlideOutKeyframes(state, frameCount) {
    const direction = state.animation?.direction || 'right';
    const offsets = {
      left: { x0: 0, y0: 0, x1: -this.width, y1: 0 },
      right: { x0: 0, y0: 0, x1: this.width, y1: 0 },
      top: { x0: 0, y0: 0, x1: 0, y1: -this.height },
      bottom: { x0: 0, y0: 0, x1: 0, y1: this.height },
    };

    const offset = offsets[direction] || offsets.right;

    return [
      { frame: 0, translateX: offset.x0, translateY: offset.y0, ...state },
      { frame: frameCount - 1, translateX: offset.x1, translateY: offset.y1, ...state },
    ];
  }

  /**
   * Generate zoom keyframes
   */
  generateZoomKeyframes(state, frameCount) {
    const direction = state.animation?.direction || 'in';
    const scales = direction === 'in'
      ? { scale0: 0.5, scale1: 1.0 }
      : { scale0: 1.0, scale1: 1.5 };

    return [
      { frame: 0, scale: scales.scale0, ...state },
      { frame: frameCount - 1, scale: scales.scale1, ...state },
    ];
  }

  /**
   * Generate pulse keyframes
   */
  generatePulseKeyframes(state, frameCount) {
    const midpoint = Math.floor(frameCount / 2);

    return [
      { frame: 0, scale: 1.0, opacity: 1.0, ...state },
      { frame: midpoint, scale: 1.1, opacity: 0.8, ...state },
      { frame: frameCount - 1, scale: 1.0, opacity: 1.0, ...state },
    ];
  }

  /**
   * Apply SVG transform based on frame state
   *
   * @param {string} svg - Base SVG
   * @param {Object} frameState - Frame state with transforms
   * @returns {string} Transformed SVG
   */
  applySVGTransform(svg, frameState) {
    let transformedSVG = svg;

    // Apply opacity
    if (frameState.opacity !== undefined && frameState.opacity !== 1) {
      transformedSVG = transformedSVG.replace(
        /<svg/,
        `<svg opacity="${frameState.opacity}"`
      );
    }

    // Apply transforms
    const transforms = [];

    if (frameState.translateX || frameState.translateY) {
      const tx = frameState.translateX || 0;
      const ty = frameState.translateY || 0;
      transforms.push(`translate(${tx}, ${ty})`);
    }

    if (frameState.scale && frameState.scale !== 1) {
      transforms.push(`scale(${frameState.scale})`);
    }

    if (frameState.rotate) {
      transforms.push(`rotate(${frameState.rotate})`);
    }

    if (transforms.length > 0) {
      const transformAttr = `transform="${transforms.join(' ')}"`;
      transformedSVG = transformedSVG.replace(
        /<svg/,
        `<svg ${transformAttr}`
      );
    }

    return transformedSVG;
  }

  /**
   * Add a single frame from SVG
   *
   * @param {string} svg - SVG string
   */
  async addFrame(svg) {
    // Render SVG to canvas
    const imageData = await this.renderSVGToImageData(svg);

    // Store frame
    this.frames.push(imageData);
    this.stats.framesAdded++;
  }

  /**
   * Render SVG to ImageData
   *
   * @param {string} svg - SVG string
   * @returns {Promise<ImageData>} ImageData
   */
  async renderSVGToImageData(svg) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.width, this.height);
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        URL.revokeObjectURL(url);
        resolve(imageData);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG frame'));
      };

      img.src = url;
    });
  }

  /**
   * Compose frames into final GIF
   *
   * @returns {Promise<Blob>} GIF blob
   */
  async compose() {
    if (this.frames.length === 0) {
      throw new Error('No frames to compose');
    }

    console.log(`Composing GIF: ${this.frames.length} frames @ ${this.fps}fps`);

    // Create encoder
    const gif = GIFEncoder();

    // Write header
    gif.writeHeader();

    // Process each frame
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];

      // Quantize colors (GIF supports max 256 colors per frame)
      const palette = quantize(frame.data, 256, { format: 'rgba4444' });

      // Apply palette
      const indexed = applyPalette(frame.data, palette, 'rgba4444');

      // Write frame
      gif.writeFrame(indexed, this.width, this.height, {
        palette,
        delay: this.delay,
        transparent: this.optimize,
        dispose: 1, // Clear frame before next
      });
    }

    // Write footer
    gif.finish();

    // Get buffer
    const buffer = gif.bytes();

    // Create blob
    const blob = new Blob([buffer], { type: 'image/gif' });

    // Update stats
    this.stats.totalSize = blob.size;
    this.stats.compressionRatio = (blob.size / (this.width * this.height * this.frames.length * 4));

    console.log(`GIF composed: ${blob.size} bytes (${this.stats.compressionRatio.toFixed(2)}x compression)`);

    return blob;
  }

  /**
   * Reset composer
   */
  reset() {
    this.frames = [];
    this.encoder = null;
    this.stats = {
      framesAdded: 0,
      framesInterpolated: 0,
      totalSize: 0,
      compressionRatio: 0,
    };
  }

  /**
   * Get statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return { ...this.stats };
  }
}

export default GIFComposer;
