/**
 * ITT PRIMITIVES
 * ===============
 * 
 * Pre-emergent dynamics for visual element generation.
 * Based on Intent Tensor Theory: https://intent-tensor-theory.com/
 * 
 * The Four Primitives:
 *   Φ   - Scalar potential (color value at a point)
 *   ∇Φ  - Gradient field (where values change - boundaries)
 *   σ   - Sigma accumulation (connected regions)
 *   ρ_q - Boundary charge (frozen value at termination)
 * 
 * From these, we derive all visual elements through EMERGENCE,
 * not explicit definition.
 */

/**
 * Φ (PHI): Scalar Potential Field
 * 
 * Returns the "value" at any point in the canvas.
 * This is the raw data - colors, intensities, etc.
 */
export function phi_scalar_field(x, y, canvas_width, canvas_height, params = {}) {
  // Normalize coordinates to 0-1
  const nx = x / canvas_width;
  const ny = y / canvas_height;
  
  // Default: radial gradient from center
  const cx = 0.5;
  const cy = 0.5;
  const distance = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
  
  return {
    value: 1 - distance,  // Higher at center
    x: nx,
    y: ny,
    distance,
  };
}

/**
 * ∇Φ (GRADIENT): Where values change
 * 
 * Detects boundaries - the "edges" of regions.
 * Returns the rate of change at a point.
 */
export function gradient_phi(phi_field, x, y, delta = 1) {
  // Sample Φ at adjacent points
  const phi_center = phi_field(x, y);
  const phi_right = phi_field(x + delta, y);
  const phi_down = phi_field(x, y + delta);
  
  // Compute gradient (∂Φ/∂x, ∂Φ/∂y)
  const dx = (phi_right.value - phi_center.value) / delta;
  const dy = (phi_down.value - phi_center.value) / delta;
  
  // Gradient magnitude (how steep the change)
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  
  return {
    dx,
    dy,
    magnitude,
    is_boundary: magnitude > 0.01,  // Threshold for "edge"
  };
}

/**
 * σ (SIGMA): Accumulation / Connected Region
 * 
 * Given a starting point, accumulate all connected points
 * where Φ is "similar" (within threshold).
 */
export function sigma_accumulate(phi_field, start_x, start_y, width, height, threshold = 0.1) {
  const visited = new Set();
  const region = [];
  const queue = [[start_x, start_y]];
  
  const start_phi = phi_field(start_x, start_y);
  
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;
    
    // Bounds check
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    
    // Already visited
    if (visited.has(key)) continue;
    visited.add(key);
    
    // Check if Φ is similar (within threshold)
    const current_phi = phi_field(x, y);
    if (Math.abs(current_phi.value - start_phi.value) > threshold) continue;
    
    // Accumulate this point
    region.push({ x, y, phi: current_phi.value });
    
    // Add neighbors (4-connectivity)
    queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  
  return {
    cells: region,
    sigma: region.length,  // Total accumulated "mass"
    centroid: compute_centroid(region),
    bounds: compute_bounds(region),
  };
}

/**
 * ρ_q (RHO_Q): Boundary Charge
 * 
 * The "frozen" value at a boundary - where emergence terminates.
 * This is what gets rendered as the final color/state.
 */
export function rho_boundary_charge(gradient, base_value, params = {}) {
  // If on boundary (gradient high), the charge is "locked"
  if (gradient.is_boundary) {
    return {
      charge: base_value,
      locked: true,
      intensity: gradient.magnitude,
    };
  }
  
  // Interior point - charge can still flow
  return {
    charge: base_value,
    locked: false,
    intensity: 0,
  };
}

// ============================================================================
// SHAPE EMERGENCE
// ============================================================================

/**
 * Emerge a circle from ITT primitives
 * 
 * A circle is a σ-accumulation where Φ is constant and bounded by ∇Φ ≠ 0
 */
export function emerge_circle(cx, cy, radius, canvas_width, canvas_height) {
  const points = [];
  
  // Sample the Φ field where distance from center < radius
  for (let y = 0; y < canvas_height; y++) {
    for (let x = 0; x < canvas_width; x++) {
      const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      // Inside circle: Φ high (1), outside: Φ low (0)
      const phi_value = distance <= radius ? 1 : 0;
      
      // Boundary: where ∇Φ ≠ 0 (edge of circle)
      const is_boundary = Math.abs(distance - radius) < 1.5;
      
      if (phi_value > 0) {
        points.push({
          x, y,
          phi: phi_value,
          is_boundary,
          distance_from_center: distance,
        });
      }
    }
  }
  
  return {
    type: 'circle',
    cx, cy, radius,
    points,
    sigma: points.length,
    boundary_points: points.filter(p => p.is_boundary),
  };
}

/**
 * Emerge a rectangle from ITT primitives
 */
export function emerge_rectangle(x, y, width, height, canvas_width, canvas_height) {
  const points = [];
  
  for (let py = y; py < y + height && py < canvas_height; py++) {
    for (let px = x; px < x + width && px < canvas_width; px++) {
      // Interior: Φ = 1
      const phi_value = 1;
      
      // Boundary: edges of rectangle
      const is_boundary = (px === x || px === x + width - 1 || py === y || py === y + height - 1);
      
      points.push({
        x: px, y: py,
        phi: phi_value,
        is_boundary,
      });
    }
  }
  
  return {
    type: 'rectangle',
    x, y, width, height,
    points,
    sigma: points.length,
    boundary_points: points.filter(p => p.is_boundary),
  };
}

/**
 * Emerge text region (bounding box)
 */
export function emerge_text_region(text, x, y, font_size, canvas_width, canvas_height) {
  // Approximate text dimensions
  const char_width = font_size * 0.6;
  const text_width = text.length * char_width;
  const text_height = font_size * 1.2;
  
  return {
    type: 'text',
    text,
    x, y,
    width: text_width,
    height: text_height,
    font_size,
    // Text is rendered by canvas, but we define its σ-region
    sigma: text_width * text_height,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function compute_centroid(points) {
  if (points.length === 0) return { x: 0, y: 0 };
  
  const sum_x = points.reduce((sum, p) => sum + p.x, 0);
  const sum_y = points.reduce((sum, p) => sum + p.y, 0);
  
  return {
    x: sum_x / points.length,
    y: sum_y / points.length,
  };
}

function compute_bounds(points) {
  if (points.length === 0) return { min_x: 0, max_x: 0, min_y: 0, max_y: 0 };
  
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  return {
    min_x: Math.min(...xs),
    max_x: Math.max(...xs),
    min_y: Math.min(...ys),
    max_y: Math.max(...ys),
  };
}

/**
 * Create a Φ field function for a given manifest
 */
export function create_phi_field_from_manifest(manifest) {
  const { palette, canvas } = manifest;
  
  return (x, y) => {
    const nx = x / canvas.width;
    const ny = y / canvas.height;
    
    // Distance from center
    const dist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
    
    return {
      value: 1 - dist,
      x: nx,
      y: ny,
      distance: dist,
    };
  };
}
