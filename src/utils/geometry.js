/**
 * GEOMETRY UTILITIES
 *
 * Implements geometric calculations for the visual manifold:
 * - Distance metrics (Euclidean, Manhattan, Chebyshev)
 * - Vector operations (dot product, cross product, norm)
 * - Coordinate transformations
 * - Bounding box calculations
 * - Collision detection
 *
 * @module utils/geometry
 */

/**
 * Calculate Euclidean distance between two points
 *
 * d = √((x₂-x₁)² + (y₂-y₁)²)
 *
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Distance
 */
export function euclideanDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate Manhattan distance between two points
 *
 * d = |x₂-x₁| + |y₂-y₁|
 *
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Distance
 */
export function manhattanDistance(p1, p2) {
  return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

/**
 * Calculate Chebyshev distance between two points
 *
 * d = max(|x₂-x₁|, |y₂-y₁|)
 *
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Distance
 */
export function chebyshevDistance(p1, p2) {
  return Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));
}

/**
 * Calculate vector magnitude (norm)
 *
 * ||v|| = √(x² + y²)
 *
 * @param {Object} vector - Vector {x, y}
 * @returns {number} Magnitude
 */
export function vectorMagnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

/**
 * Normalize vector
 *
 * v̂ = v / ||v||
 *
 * @param {Object} vector - Vector {x, y}
 * @returns {Object} Normalized vector
 */
export function normalizeVector(vector) {
  const mag = vectorMagnitude(vector);
  if (mag === 0) return { x: 0, y: 0 };

  return {
    x: vector.x / mag,
    y: vector.y / mag,
  };
}

/**
 * Add two vectors
 *
 * @param {Object} v1 - First vector
 * @param {Object} v2 - Second vector
 * @returns {Object} Sum vector
 */
export function addVectors(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}

/**
 * Subtract two vectors
 *
 * @param {Object} v1 - First vector
 * @param {Object} v2 - Second vector
 * @returns {Object} Difference vector
 */
export function subtractVectors(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  };
}

/**
 * Scale vector
 *
 * @param {Object} vector - Vector {x, y}
 * @param {number} scalar - Scaling factor
 * @returns {Object} Scaled vector
 */
export function scaleVector(vector, scalar) {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  };
}

/**
 * Dot product of two vectors
 *
 * v₁ · v₂ = x₁x₂ + y₁y₂
 *
 * @param {Object} v1 - First vector
 * @param {Object} v2 - Second vector
 * @returns {number} Dot product
 */
export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Cross product of two 2D vectors (returns scalar)
 *
 * v₁ × v₂ = x₁y₂ - y₁x₂
 *
 * @param {Object} v1 - First vector
 * @param {Object} v2 - Second vector
 * @returns {number} Cross product (z-component)
 */
export function crossProduct(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

/**
 * Calculate angle between two vectors
 *
 * θ = arccos((v₁ · v₂) / (||v₁|| ||v₂||))
 *
 * @param {Object} v1 - First vector
 * @param {Object} v2 - Second vector
 * @returns {number} Angle in radians
 */
export function angleBetweenVectors(v1, v2) {
  const mag1 = vectorMagnitude(v1);
  const mag2 = vectorMagnitude(v2);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosTheta = dotProduct(v1, v2) / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

/**
 * Rotate vector around origin
 *
 * @param {Object} vector - Vector {x, y}
 * @param {number} angle - Angle in radians
 * @returns {Object} Rotated vector
 */
export function rotateVector(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos,
  };
}

/**
 * Linear interpolation between two points
 *
 * p = p₁ + t(p₂ - p₁)
 *
 * @param {Object} p1 - Start point
 * @param {Object} p2 - End point
 * @param {number} t - Interpolation parameter (0-1)
 * @returns {Object} Interpolated point
 */
export function lerpPoint(p1, p2, t) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
  };
}

/**
 * Calculate bounding box for points
 *
 * @param {Array} points - Array of points {x, y}
 * @returns {Object} Bounding box {minX, minY, maxX, maxY, width, height}
 */
export function calculateBoundingBox(points) {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Check if point is inside bounding box
 *
 * @param {Object} point - Point {x, y}
 * @param {Object} bbox - Bounding box {minX, minY, maxX, maxY}
 * @returns {boolean} True if inside
 */
export function pointInBoundingBox(point, bbox) {
  return (
    point.x >= bbox.minX &&
    point.x <= bbox.maxX &&
    point.y >= bbox.minY &&
    point.y <= bbox.maxY
  );
}

/**
 * Check if two bounding boxes intersect
 *
 * @param {Object} bbox1 - First bounding box
 * @param {Object} bbox2 - Second bounding box
 * @returns {boolean} True if intersect
 */
export function boundingBoxesIntersect(bbox1, bbox2) {
  return !(
    bbox1.maxX < bbox2.minX ||
    bbox1.minX > bbox2.maxX ||
    bbox1.maxY < bbox2.minY ||
    bbox1.minY > bbox2.maxY
  );
}

/**
 * Calculate centroid of points
 *
 * c = (Σpᵢ) / n
 *
 * @param {Array} points - Array of points {x, y}
 * @returns {Object} Centroid {x, y}
 */
export function calculateCentroid(points) {
  if (points.length === 0) return { x: 0, y: 0 };

  let sumX = 0;
  let sumY = 0;

  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }

  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

/**
 * Convert polar coordinates to Cartesian
 *
 * x = r cos(θ)
 * y = r sin(θ)
 *
 * @param {number} r - Radius
 * @param {number} theta - Angle in radians
 * @returns {Object} Cartesian coordinates {x, y}
 */
export function polarToCartesian(r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  };
}

/**
 * Convert Cartesian coordinates to polar
 *
 * r = √(x² + y²)
 * θ = arctan(y/x)
 *
 * @param {Object} point - Cartesian coordinates {x, y}
 * @returns {Object} Polar coordinates {r, theta}
 */
export function cartesianToPolar(point) {
  return {
    r: Math.sqrt(point.x * point.x + point.y * point.y),
    theta: Math.atan2(point.y, point.x),
  };
}

/**
 * Calculate area of triangle
 *
 * A = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|
 *
 * @param {Object} p1 - First vertex
 * @param {Object} p2 - Second vertex
 * @param {Object} p3 - Third vertex
 * @returns {number} Area
 */
export function triangleArea(p1, p2, p3) {
  return Math.abs(
    (p1.x * (p2.y - p3.y) +
     p2.x * (p3.y - p1.y) +
     p3.x * (p1.y - p2.y)) / 2
  );
}

/**
 * Check if point is inside triangle
 *
 * Uses barycentric coordinates.
 *
 * @param {Object} point - Point to test
 * @param {Object} p1 - Triangle vertex 1
 * @param {Object} p2 - Triangle vertex 2
 * @param {Object} p3 - Triangle vertex 3
 * @returns {boolean} True if inside
 */
export function pointInTriangle(point, p1, p2, p3) {
  const area = triangleArea(p1, p2, p3);
  const area1 = triangleArea(point, p2, p3);
  const area2 = triangleArea(p1, point, p3);
  const area3 = triangleArea(p1, p2, point);

  return Math.abs(area - (area1 + area2 + area3)) < 0.001;
}

/**
 * Calculate distance from point to line segment
 *
 * @param {Object} point - Point {x, y}
 * @param {Object} lineStart - Line start {x, y}
 * @param {Object} lineEnd - Line end {x, y}
 * @returns {number} Distance
 */
export function pointToLineDistance(point, lineStart, lineEnd) {
  const lineVec = subtractVectors(lineEnd, lineStart);
  const pointVec = subtractVectors(point, lineStart);

  const lineLength = vectorMagnitude(lineVec);
  if (lineLength === 0) return euclideanDistance(point, lineStart);

  // Project point onto line
  const t = Math.max(0, Math.min(1, dotProduct(pointVec, lineVec) / (lineLength * lineLength)));

  const projection = addVectors(lineStart, scaleVector(lineVec, t));
  return euclideanDistance(point, projection);
}

/**
 * Check if circles intersect
 *
 * @param {Object} circle1 - First circle {x, y, radius}
 * @param {Object} circle2 - Second circle {x, y, radius}
 * @returns {boolean} True if intersect
 */
export function circlesIntersect(circle1, circle2) {
  const dist = euclideanDistance(circle1, circle2);
  return dist <= circle1.radius + circle2.radius;
}

/**
 * Clamp point to bounding box
 *
 * @param {Object} point - Point {x, y}
 * @param {Object} bbox - Bounding box {minX, minY, maxX, maxY}
 * @returns {Object} Clamped point
 */
export function clampPointToBoundingBox(point, bbox) {
  return {
    x: Math.max(bbox.minX, Math.min(bbox.maxX, point.x)),
    y: Math.max(bbox.minY, Math.min(bbox.maxY, point.y)),
  };
}

/**
 * Calculate grid position
 *
 * Snaps point to nearest grid intersection.
 *
 * @param {Object} point - Point {x, y}
 * @param {number} gridSize - Grid cell size
 * @returns {Object} Grid position
 */
export function snapToGrid(point, gridSize) {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

/**
 * Calculate bezier curve point
 *
 * Cubic bezier: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
 *
 * @param {number} t - Parameter (0-1)
 * @param {Object} p0 - Start point
 * @param {Object} p1 - Control point 1
 * @param {Object} p2 - Control point 2
 * @param {Object} p3 - End point
 * @returns {Object} Point on curve
 */
export function cubicBezier(t, p0, p1, p2, p3) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

/**
 * Calculate quadratic bezier curve point
 *
 * B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
 *
 * @param {number} t - Parameter (0-1)
 * @param {Object} p0 - Start point
 * @param {Object} p1 - Control point
 * @param {Object} p2 - End point
 * @returns {Object} Point on curve
 */
export function quadraticBezier(t, p0, p1, p2) {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;

  return {
    x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
    y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y,
  };
}

/**
 * Sample points along bezier curve
 *
 * @param {Object} p0 - Start point
 * @param {Object} p1 - Control point 1
 * @param {Object} p2 - Control point 2
 * @param {Object} p3 - End point (optional, if cubic)
 * @param {number} steps - Number of samples
 * @returns {Array} Array of points
 */
export function sampleBezierCurve(p0, p1, p2, p3 = null, steps = 10) {
  const points = [];
  const isCubic = p3 !== null;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = isCubic
      ? cubicBezier(t, p0, p1, p2, p3)
      : quadraticBezier(t, p0, p1, p2);
    points.push(point);
  }

  return points;
}

/**
 * Calculate rectangle corners
 *
 * @param {Object} rect - Rectangle {x, y, width, height}
 * @returns {Array} Array of corner points
 */
export function getRectangleCorners(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];
}

/**
 * Check if rectangles intersect
 *
 * @param {Object} rect1 - First rectangle {x, y, width, height}
 * @param {Object} rect2 - Second rectangle
 * @returns {boolean} True if intersect
 */
export function rectanglesIntersect(rect1, rect2) {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * Calculate intersection area of rectangles
 *
 * @param {Object} rect1 - First rectangle
 * @param {Object} rect2 - Second rectangle
 * @returns {number} Intersection area (0 if no intersection)
 */
export function rectangleIntersectionArea(rect1, rect2) {
  const xOverlap = Math.max(
    0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
    Math.max(rect1.x, rect2.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
    Math.max(rect1.y, rect2.y)
  );

  return xOverlap * yOverlap;
}

/**
 * Calculate aspect ratio
 *
 * @param {number} width - Width
 * @param {number} height - Height
 * @returns {number} Aspect ratio (width/height)
 */
export function calculateAspectRatio(width, height) {
  return height === 0 ? 0 : width / height;
}

/**
 * Fit rectangle to aspect ratio
 *
 * @param {number} width - Current width
 * @param {number} height - Current height
 * @param {number} targetRatio - Target aspect ratio
 * @returns {Object} Fitted dimensions {width, height}
 */
export function fitToAspectRatio(width, height, targetRatio) {
  const currentRatio = calculateAspectRatio(width, height);

  if (currentRatio > targetRatio) {
    // Width is too large
    return {
      width: height * targetRatio,
      height,
    };
  } else {
    // Height is too large
    return {
      width,
      height: width / targetRatio,
    };
  }
}

export default {
  euclideanDistance,
  manhattanDistance,
  chebyshevDistance,
  vectorMagnitude,
  normalizeVector,
  addVectors,
  subtractVectors,
  scaleVector,
  dotProduct,
  crossProduct,
  angleBetweenVectors,
  rotateVector,
  lerpPoint,
  calculateBoundingBox,
  pointInBoundingBox,
  boundingBoxesIntersect,
  calculateCentroid,
  polarToCartesian,
  cartesianToPolar,
  triangleArea,
  pointInTriangle,
  pointToLineDistance,
  circlesIntersect,
  clampPointToBoundingBox,
  snapToGrid,
  cubicBezier,
  quadraticBezier,
  sampleBezierCurve,
  getRectangleCorners,
  rectanglesIntersect,
  rectangleIntersectionArea,
  calculateAspectRatio,
  fitToAspectRatio,
};
