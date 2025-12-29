/**
 * SVG GENERATOR
 *
 * Generates SVG DOM elements from resolved visual states.
 *
 * Features:
 * - Text rendering with typography
 * - Background and color application
 * - Effects (shadow, glow, blur)
 * - Decorations and patterns
 * - Responsive sizing
 * - ARIA attributes for accessibility
 *
 * @module rendering/svg-generator
 */

/**
 * SVG namespace
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Default canvas dimensions
 */
const CANVAS_DIMENSIONS = {
  '1:1': { width: 1080, height: 1080 },
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '4:3': { width: 1440, height: 1080 },
  '21:9': { width: 2560, height: 1080 },
};

/**
 * SVG Generator
 */
export class SVGGenerator {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.defaultWidth = options.defaultWidth || 1080;
    this.defaultHeight = options.defaultHeight || 1080;
    this.dpi = options.dpi || 72;
  }

  /**
   * Generate SVG from manifest
   *
   * @param {Object} manifest - Resolved visual state
   * @returns {SVGElement} SVG element
   */
  generate(manifest) {
    // Get canvas dimensions
    const dimensions = this.getCanvasDimensions(manifest.canvas);

    // Create SVG root
    const svg = this.createSVGRoot(dimensions);

    // Create defs for filters and gradients
    const defs = this.createDefs(manifest);
    svg.appendChild(defs);

    // Add background
    const background = this.createBackground(manifest, dimensions);
    svg.appendChild(background);

    // Add decorations (background layer)
    if (manifest.decorations && manifest.decorations.length > 0) {
      const bgDecorations = manifest.decorations.filter(d => d.layer === 'background');
      for (const decoration of bgDecorations) {
        const decorationEl = this.createDecoration(decoration, dimensions);
        if (decorationEl) svg.appendChild(decorationEl);
      }
    }

    // Add main content (text)
    if (manifest.text) {
      const textGroup = this.createTextGroup(manifest, dimensions);
      svg.appendChild(textGroup);
    }

    // Add decorations (foreground layer)
    if (manifest.decorations && manifest.decorations.length > 0) {
      const fgDecorations = manifest.decorations.filter(d => d.layer !== 'background');
      for (const decoration of fgDecorations) {
        const decorationEl = this.createDecoration(decoration, dimensions);
        if (decorationEl) svg.appendChild(decorationEl);
      }
    }

    return svg;
  }

  /**
   * Create SVG root element
   *
   * @param {Object} dimensions - Canvas dimensions
   * @returns {SVGElement} SVG root
   */
  createSVGRoot(dimensions) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', dimensions.width);
    svg.setAttribute('height', dimensions.height);
    svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Generated visual');

    return svg;
  }

  /**
   * Create defs section
   *
   * Contains filters, gradients, patterns, etc.
   *
   * @param {Object} manifest - Manifest
   * @returns {SVGDefsElement} Defs element
   */
  createDefs(manifest) {
    const defs = document.createElementNS(SVG_NS, 'defs');

    // Add shadow filter
    if (manifest.effects?.shadow && manifest.effects.shadow !== 'none') {
      const shadowFilter = this.createShadowFilter(manifest.effects.shadow);
      defs.appendChild(shadowFilter);
    }

    // Add glow filter
    if (manifest.effects?.glow && manifest.effects.glow !== 'none') {
      const glowFilter = this.createGlowFilter(manifest.effects.glow);
      defs.appendChild(glowFilter);
    }

    // Add blur filter
    if (manifest.effects?.blur && manifest.effects.blur !== '0px') {
      const blurFilter = this.createBlurFilter(manifest.effects.blur);
      defs.appendChild(blurFilter);
    }

    // Add gradients
    if (manifest.gradients) {
      for (const [id, gradient] of Object.entries(manifest.gradients)) {
        const gradientEl = this.createGradient(id, gradient);
        if (gradientEl) defs.appendChild(gradientEl);
      }
    }

    return defs;
  }

  /**
   * Create shadow filter
   *
   * @param {string} shadow - Shadow specification
   * @returns {SVGFilterElement} Filter element
   */
  createShadowFilter(shadow) {
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', 'shadow-filter');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    // Parse shadow (simplified)
    const blur = '4';
    const offsetX = '2';
    const offsetY = '2';
    const color = 'rgba(0,0,0,0.3)';

    // Offset
    const feOffset = document.createElementNS(SVG_NS, 'feOffset');
    feOffset.setAttribute('in', 'SourceAlpha');
    feOffset.setAttribute('dx', offsetX);
    feOffset.setAttribute('dy', offsetY);
    feOffset.setAttribute('result', 'offsetblur');
    filter.appendChild(feOffset);

    // Blur
    const feGaussianBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'offsetblur');
    feGaussianBlur.setAttribute('stdDeviation', blur);
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);

    // Color
    const feFlood = document.createElementNS(SVG_NS, 'feFlood');
    feFlood.setAttribute('flood-color', color);
    feFlood.setAttribute('result', 'color');
    filter.appendChild(feFlood);

    // Composite
    const feComposite = document.createElementNS(SVG_NS, 'feComposite');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'blur');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'shadow');
    filter.appendChild(feComposite);

    // Merge
    const feMerge = document.createElementNS(SVG_NS, 'feMerge');
    const feMergeNode1 = document.createElementNS(SVG_NS, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'shadow');
    feMerge.appendChild(feMergeNode1);
    const feMergeNode2 = document.createElementNS(SVG_NS, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);

    return filter;
  }

  /**
   * Create glow filter
   *
   * @param {string} glow - Glow specification
   * @returns {SVGFilterElement} Filter element
   */
  createGlowFilter(glow) {
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', 'glow-filter');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('stdDeviation', '10');
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);

    const feMerge = document.createElementNS(SVG_NS, 'feMerge');
    const feMergeNode1 = document.createElementNS(SVG_NS, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'blur');
    feMerge.appendChild(feMergeNode1);
    const feMergeNode2 = document.createElementNS(SVG_NS, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);

    return filter;
  }

  /**
   * Create blur filter
   *
   * @param {string} blur - Blur radius
   * @returns {SVGFilterElement} Filter element
   */
  createBlurFilter(blur) {
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', 'blur-filter');

    const feGaussianBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('stdDeviation', parseFloat(blur) || 4);
    filter.appendChild(feGaussianBlur);

    return filter;
  }

  /**
   * Create gradient
   *
   * @param {string} id - Gradient ID
   * @param {Object} gradient - Gradient definition
   * @returns {SVGElement} Gradient element
   */
  createGradient(id, gradient) {
    if (gradient.type === 'linear') {
      const linearGradient = document.createElementNS(SVG_NS, 'linearGradient');
      linearGradient.setAttribute('id', id);
      linearGradient.setAttribute('x1', gradient.x1 || '0%');
      linearGradient.setAttribute('y1', gradient.y1 || '0%');
      linearGradient.setAttribute('x2', gradient.x2 || '100%');
      linearGradient.setAttribute('y2', gradient.y2 || '0%');

      for (const stop of gradient.stops || []) {
        const stopEl = document.createElementNS(SVG_NS, 'stop');
        stopEl.setAttribute('offset', stop.offset);
        stopEl.setAttribute('stop-color', stop.color);
        if (stop.opacity !== undefined) {
          stopEl.setAttribute('stop-opacity', stop.opacity);
        }
        linearGradient.appendChild(stopEl);
      }

      return linearGradient;
    }

    return null;
  }

  /**
   * Create background
   *
   * @param {Object} manifest - Manifest
   * @param {Object} dimensions - Canvas dimensions
   * @returns {SVGRectElement} Background rectangle
   */
  createBackground(manifest, dimensions) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('width', dimensions.width);
    rect.setAttribute('height', dimensions.height);
    rect.setAttribute('fill', manifest.colors?.background || '#ffffff');

    if (manifest.effects?.opacity !== undefined && manifest.effects.opacity < 1) {
      rect.setAttribute('opacity', manifest.effects.opacity);
    }

    return rect;
  }

  /**
   * Create text group
   *
   * @param {Object} manifest - Manifest
   * @param {Object} dimensions - Canvas dimensions
   * @returns {SVGGElement} Text group
   */
  createTextGroup(manifest, dimensions) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'text-group');

    // Calculate position
    const position = this.calculateTextPosition(manifest, dimensions);

    // Create text element
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', position.x);
    text.setAttribute('y', position.y);

    // Apply typography
    this.applyTypography(text, manifest.typography);

    // Apply color
    text.setAttribute('fill', manifest.colors?.text || '#000000');

    // Apply effects
    if (manifest.effects?.shadow && manifest.effects.shadow !== 'none') {
      text.setAttribute('filter', 'url(#shadow-filter)');
    }
    if (manifest.effects?.glow && manifest.effects.glow !== 'none') {
      text.setAttribute('filter', 'url(#glow-filter)');
    }

    // Add text content
    const lines = manifest.text.split('\n');
    if (lines.length === 1) {
      text.textContent = manifest.text;
    } else {
      // Multi-line text
      for (let i = 0; i < lines.length; i++) {
        const tspan = document.createElementNS(SVG_NS, 'tspan');
        tspan.setAttribute('x', position.x);
        tspan.setAttribute('dy', i === 0 ? '0' : '1.2em');
        tspan.textContent = lines[i];
        text.appendChild(tspan);
      }
    }

    group.appendChild(text);
    return group;
  }

  /**
   * Calculate text position
   *
   * @param {Object} manifest - Manifest
   * @param {Object} dimensions - Canvas dimensions
   * @returns {Object} Position {x, y}
   */
  calculateTextPosition(manifest, dimensions) {
    const layout = manifest.layout || {};
    const typography = manifest.typography || {};

    let x, y;

    // Parse position from layout
    if (layout.x) {
      x = this.parsePosition(layout.x, dimensions.width);
    } else {
      x = dimensions.width / 2;
    }

    if (layout.y) {
      y = this.parsePosition(layout.y, dimensions.height);
    } else {
      y = dimensions.height / 2;
    }

    return { x, y };
  }

  /**
   * Apply typography to text element
   *
   * @param {SVGTextElement} textEl - Text element
   * @param {Object} typography - Typography properties
   */
  applyTypography(textEl, typography = {}) {
    if (typography.fontFamily) {
      textEl.setAttribute('font-family', typography.fontFamily);
    }
    if (typography.fontSize) {
      textEl.setAttribute('font-size', typography.fontSize);
    }
    if (typography.fontWeight) {
      textEl.setAttribute('font-weight', typography.fontWeight);
    }
    if (typography.fontStyle) {
      textEl.setAttribute('font-style', typography.fontStyle);
    }
    if (typography.textAlign) {
      textEl.setAttribute('text-anchor', this.convertTextAlign(typography.textAlign));
    }
    if (typography.letterSpacing) {
      textEl.setAttribute('letter-spacing', typography.letterSpacing);
    }
    if (typography.textDecoration) {
      textEl.setAttribute('text-decoration', typography.textDecoration);
    }
    if (typography.textTransform) {
      // SVG doesn't support text-transform directly, would need to transform the text content
    }
  }

  /**
   * Convert CSS text-align to SVG text-anchor
   *
   * @param {string} textAlign - CSS text-align
   * @returns {string} SVG text-anchor
   */
  convertTextAlign(textAlign) {
    switch (textAlign) {
      case 'left': return 'start';
      case 'center': return 'middle';
      case 'right': return 'end';
      default: return 'middle';
    }
  }

  /**
   * Create decoration element
   *
   * @param {Object} decoration - Decoration definition
   * @param {Object} dimensions - Canvas dimensions
   * @returns {SVGElement} Decoration element
   */
  createDecoration(decoration, dimensions) {
    switch (decoration.type) {
      case 'circle':
        return this.createCircleDecoration(decoration, dimensions);
      case 'rect':
        return this.createRectDecoration(decoration, dimensions);
      case 'line':
        return this.createLineDecoration(decoration, dimensions);
      default:
        return null;
    }
  }

  /**
   * Create circle decoration
   *
   * @param {Object} decoration - Decoration
   * @param {Object} dimensions - Dimensions
   * @returns {SVGCircleElement} Circle element
   */
  createCircleDecoration(decoration, dimensions) {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', decoration.x || dimensions.width / 2);
    circle.setAttribute('cy', decoration.y || dimensions.height / 2);
    circle.setAttribute('r', decoration.radius || 50);
    circle.setAttribute('fill', decoration.fill || 'none');
    circle.setAttribute('stroke', decoration.stroke || '#000000');
    circle.setAttribute('stroke-width', decoration.strokeWidth || 2);

    return circle;
  }

  /**
   * Create rect decoration
   *
   * @param {Object} decoration - Decoration
   * @param {Object} dimensions - Dimensions
   * @returns {SVGRectElement} Rect element
   */
  createRectDecoration(decoration, dimensions) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', decoration.x || 0);
    rect.setAttribute('y', decoration.y || 0);
    rect.setAttribute('width', decoration.width || 100);
    rect.setAttribute('height', decoration.height || 100);
    rect.setAttribute('fill', decoration.fill || 'none');
    rect.setAttribute('stroke', decoration.stroke || '#000000');
    rect.setAttribute('stroke-width', decoration.strokeWidth || 2);

    return rect;
  }

  /**
   * Create line decoration
   *
   * @param {Object} decoration - Decoration
   * @param {Object} dimensions - Dimensions
   * @returns {SVGLineElement} Line element
   */
  createLineDecoration(decoration, dimensions) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', decoration.x1 || 0);
    line.setAttribute('y1', decoration.y1 || 0);
    line.setAttribute('x2', decoration.x2 || dimensions.width);
    line.setAttribute('y2', decoration.y2 || dimensions.height);
    line.setAttribute('stroke', decoration.stroke || '#000000');
    line.setAttribute('stroke-width', decoration.strokeWidth || 2);

    return line;
  }

  /**
   * Get canvas dimensions
   *
   * @param {string} canvas - Canvas ratio
   * @returns {Object} Dimensions {width, height}
   */
  getCanvasDimensions(canvas = '1:1') {
    return CANVAS_DIMENSIONS[canvas] || CANVAS_DIMENSIONS['1:1'];
  }

  /**
   * Parse position string to pixels
   *
   * @param {string} position - Position string
   * @param {number} containerSize - Container size
   * @returns {number} Position in pixels
   */
  parsePosition(position, containerSize) {
    if (typeof position === 'number') return position;

    const str = String(position);
    if (str.endsWith('%')) {
      return (parseFloat(str) / 100) * containerSize;
    } else if (str.endsWith('px')) {
      return parseFloat(str);
    } else {
      return parseFloat(str);
    }
  }

  /**
   * Serialize SVG to string
   *
   * @param {SVGElement} svg - SVG element
   * @returns {string} SVG string
   */
  serialize(svg) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  }
}

/**
 * Create SVG generator
 *
 * @param {Object} options - Options
 * @returns {SVGGenerator} Generator instance
 */
export function createSVGGenerator(options = {}) {
  return new SVGGenerator(options);
}

export default SVGGenerator;
