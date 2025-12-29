/**
 * PHYSICS UTILITIES
 *
 * Implements particle dynamics, forces, and physics simulations
 * for animations and visual effects.
 *
 * Features:
 * - Particle systems
 * - Forces (gravity, friction, drag, spring, attraction, repulsion)
 * - Collisions (elastic, inelastic)
 * - Constraints (distance, angle, boundary)
 * - Integration (Euler, Verlet)
 *
 * @module utils/physics
 */

/**
 * Particle class
 *
 * Represents a particle with position, velocity, acceleration, and mass.
 */
export class Particle {
  /**
   * @param {Object} options - Particle options
   */
  constructor(options = {}) {
    this.position = { x: options.x || 0, y: options.y || 0 };
    this.velocity = { x: options.vx || 0, y: options.vy || 0 };
    this.acceleration = { x: 0, y: 0 };
    this.mass = options.mass || 1.0;
    this.radius = options.radius || 5;
    this.fixed = options.fixed || false; // If true, particle doesn't move
    this.restitution = options.restitution || 0.9; // Bounciness (0-1)
  }

  /**
   * Apply force to particle
   *
   * F = ma → a = F/m
   *
   * @param {Object} force - Force vector {x, y}
   */
  applyForce(force) {
    if (this.fixed) return;

    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  /**
   * Update particle using Euler integration
   *
   * @param {number} dt - Time step (seconds)
   */
  update(dt = 1/60) {
    if (this.fixed) return;

    // v = v + a*dt
    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;

    // p = p + v*dt
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  /**
   * Update particle using Verlet integration
   *
   * More stable than Euler for constraints.
   *
   * @param {Object} previousPosition - Previous position {x, y}
   * @param {number} dt - Time step
   */
  updateVerlet(previousPosition, dt = 1/60) {
    if (this.fixed) return;

    const newX = 2 * this.position.x - previousPosition.x + this.acceleration.x * dt * dt;
    const newY = 2 * this.position.y - previousPosition.y + this.acceleration.y * dt * dt;

    previousPosition.x = this.position.x;
    previousPosition.y = this.position.y;

    this.position.x = newX;
    this.position.y = newY;

    // Calculate velocity from position difference
    this.velocity.x = (this.position.x - previousPosition.x) / dt;
    this.velocity.y = (this.position.y - previousPosition.y) / dt;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }
}

/**
 * Apply gravity force
 *
 * F = m * g
 *
 * @param {Particle} particle - Particle
 * @param {number} g - Gravitational acceleration (default: 9.8 m/s²)
 */
export function applyGravity(particle, g = 9.8) {
  particle.applyForce({ x: 0, y: particle.mass * g });
}

/**
 * Apply friction force
 *
 * F = -μ * v
 *
 * @param {Particle} particle - Particle
 * @param {number} coefficient - Friction coefficient (0-1)
 */
export function applyFriction(particle, coefficient = 0.1) {
  const friction = {
    x: -particle.velocity.x * coefficient,
    y: -particle.velocity.y * coefficient,
  };
  particle.applyForce(friction);
}

/**
 * Apply drag force (air resistance)
 *
 * F = -½ * ρ * v² * A * Cd * v̂
 *
 * Simplified: F = -c * ||v|| * v
 *
 * @param {Particle} particle - Particle
 * @param {number} coefficient - Drag coefficient
 */
export function applyDrag(particle, coefficient = 0.01) {
  const speed = Math.sqrt(
    particle.velocity.x * particle.velocity.x +
    particle.velocity.y * particle.velocity.y
  );

  if (speed === 0) return;

  const dragMagnitude = coefficient * speed * speed;
  const drag = {
    x: -(particle.velocity.x / speed) * dragMagnitude,
    y: -(particle.velocity.y / speed) * dragMagnitude,
  };

  particle.applyForce(drag);
}

/**
 * Apply spring force (Hooke's Law)
 *
 * F = -k * (x - restLength)
 *
 * @param {Particle} particle - Particle
 * @param {Object} anchor - Anchor point {x, y}
 * @param {number} k - Spring constant
 * @param {number} restLength - Rest length
 */
export function applySpringForce(particle, anchor, k = 0.1, restLength = 0) {
  const dx = particle.position.x - anchor.x;
  const dy = particle.position.y - anchor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return;

  const displacement = distance - restLength;
  const forceMagnitude = -k * displacement;

  const force = {
    x: (dx / distance) * forceMagnitude,
    y: (dy / distance) * forceMagnitude,
  };

  particle.applyForce(force);
}

/**
 * Apply attraction force
 *
 * F = G * (m1 * m2) / r²
 *
 * @param {Particle} particle1 - First particle
 * @param {Particle} particle2 - Second particle
 * @param {number} G - Gravitational constant
 */
export function applyAttraction(particle1, particle2, G = 1.0) {
  const dx = particle2.position.x - particle1.position.x;
  const dy = particle2.position.y - particle1.position.y;
  const distanceSquared = dx * dx + dy * dy;

  // Avoid division by zero
  const distance = Math.max(10, Math.sqrt(distanceSquared));

  const forceMagnitude = (G * particle1.mass * particle2.mass) / distanceSquared;

  const force = {
    x: (dx / distance) * forceMagnitude,
    y: (dy / distance) * forceMagnitude,
  };

  particle1.applyForce(force);
  particle2.applyForce({ x: -force.x, y: -force.y });
}

/**
 * Apply repulsion force
 *
 * F = -k / r²
 *
 * @param {Particle} particle1 - First particle
 * @param {Particle} particle2 - Second particle
 * @param {number} k - Repulsion constant
 */
export function applyRepulsion(particle1, particle2, k = 100.0) {
  const dx = particle2.position.x - particle1.position.x;
  const dy = particle2.position.y - particle1.position.y;
  const distanceSquared = dx * dx + dy * dy;

  // Avoid division by zero
  const distance = Math.max(1, Math.sqrt(distanceSquared));

  const forceMagnitude = -k / distanceSquared;

  const force = {
    x: (dx / distance) * forceMagnitude,
    y: (dy / distance) * forceMagnitude,
  };

  particle1.applyForce(force);
  particle2.applyForce({ x: -force.x, y: -force.y });
}

/**
 * Check and resolve collision between two particles
 *
 * @param {Particle} particle1 - First particle
 * @param {Particle} particle2 - Second particle
 * @returns {boolean} True if collision occurred
 */
export function resolveCollision(particle1, particle2) {
  const dx = particle2.position.x - particle1.position.x;
  const dy = particle2.position.y - particle1.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = particle1.radius + particle2.radius;

  if (distance >= minDistance) {
    return false; // No collision
  }

  // Resolve overlap
  const overlap = minDistance - distance;
  const nx = dx / distance; // Normal x
  const ny = dy / distance; // Normal y

  // Move particles apart
  if (!particle1.fixed && !particle2.fixed) {
    particle1.position.x -= nx * overlap * 0.5;
    particle1.position.y -= ny * overlap * 0.5;
    particle2.position.x += nx * overlap * 0.5;
    particle2.position.y += ny * overlap * 0.5;
  } else if (!particle1.fixed) {
    particle1.position.x -= nx * overlap;
    particle1.position.y -= ny * overlap;
  } else if (!particle2.fixed) {
    particle2.position.x += nx * overlap;
    particle2.position.y += ny * overlap;
  }

  // Calculate relative velocity
  const dvx = particle2.velocity.x - particle1.velocity.x;
  const dvy = particle2.velocity.y - particle1.velocity.y;
  const relativeVelocity = dvx * nx + dvy * ny;

  // Particles are moving apart
  if (relativeVelocity > 0) return true;

  // Calculate impulse (elastic collision)
  const restitution = Math.min(particle1.restitution, particle2.restitution);
  const impulse = -(1 + restitution) * relativeVelocity;
  const impulseScale = impulse / (1 / particle1.mass + 1 / particle2.mass);

  // Apply impulse
  if (!particle1.fixed) {
    particle1.velocity.x -= (impulseScale / particle1.mass) * nx;
    particle1.velocity.y -= (impulseScale / particle1.mass) * ny;
  }
  if (!particle2.fixed) {
    particle2.velocity.x += (impulseScale / particle2.mass) * nx;
    particle2.velocity.y += (impulseScale / particle2.mass) * ny;
  }

  return true;
}

/**
 * Constrain particle to boundary
 *
 * @param {Particle} particle - Particle
 * @param {Object} bounds - Boundary {minX, minY, maxX, maxY}
 */
export function constrainToBoundary(particle, bounds) {
  // X bounds
  if (particle.position.x - particle.radius < bounds.minX) {
    particle.position.x = bounds.minX + particle.radius;
    particle.velocity.x *= -particle.restitution;
  } else if (particle.position.x + particle.radius > bounds.maxX) {
    particle.position.x = bounds.maxX - particle.radius;
    particle.velocity.x *= -particle.restitution;
  }

  // Y bounds
  if (particle.position.y - particle.radius < bounds.minY) {
    particle.position.y = bounds.minY + particle.radius;
    particle.velocity.y *= -particle.restitution;
  } else if (particle.position.y + particle.radius > bounds.maxY) {
    particle.position.y = bounds.maxY - particle.radius;
    particle.velocity.y *= -particle.restitution;
  }
}

/**
 * Constrain distance between two particles
 *
 * @param {Particle} particle1 - First particle
 * @param {Particle} particle2 - Second particle
 * @param {number} distance - Target distance
 * @param {number} stiffness - Constraint stiffness (0-1)
 */
export function constrainDistance(particle1, particle2, distance, stiffness = 1.0) {
  const dx = particle2.position.x - particle1.position.x;
  const dy = particle2.position.y - particle1.position.y;
  const currentDistance = Math.sqrt(dx * dx + dy * dy);

  if (currentDistance === 0) return;

  const difference = (distance - currentDistance) / currentDistance;
  const offsetX = dx * difference * stiffness * 0.5;
  const offsetY = dy * difference * stiffness * 0.5;

  if (!particle1.fixed) {
    particle1.position.x -= offsetX;
    particle1.position.y -= offsetY;
  }
  if (!particle2.fixed) {
    particle2.position.x += offsetX;
    particle2.position.y += offsetY;
  }
}

/**
 * Particle System class
 *
 * Manages multiple particles.
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.forces = [];
  }

  /**
   * Add particle
   *
   * @param {Particle} particle - Particle to add
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * Remove particle
   *
   * @param {Particle} particle - Particle to remove
   */
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
    }
  }

  /**
   * Add global force
   *
   * @param {Function} forceFn - Force function (particle) => void
   */
  addForce(forceFn) {
    this.forces.push(forceFn);
  }

  /**
   * Update all particles
   *
   * @param {number} dt - Time step
   */
  update(dt = 1/60) {
    // Apply forces
    for (const particle of this.particles) {
      for (const forceFn of this.forces) {
        forceFn(particle);
      }
    }

    // Update particles
    for (const particle of this.particles) {
      particle.update(dt);
    }

    // Check collisions
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        resolveCollision(this.particles[i], this.particles[j]);
      }
    }
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
}

/**
 * Create explosion effect
 *
 * Generates particles exploding outward from a point.
 *
 * @param {Object} center - Center point {x, y}
 * @param {number} count - Number of particles
 * @param {number} speed - Explosion speed
 * @returns {Array} Array of particles
 */
export function createExplosion(center, count = 20, speed = 100) {
  const particles = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    particles.push(new Particle({
      x: center.x,
      y: center.y,
      vx,
      vy,
      mass: 1,
      radius: 3,
    }));
  }

  return particles;
}

/**
 * Create orbital system
 *
 * Creates particles orbiting a center point.
 *
 * @param {Object} center - Center point {x, y}
 * @param {number} count - Number of particles
 * @param {number} radius - Orbit radius
 * @param {number} speed - Orbital speed
 * @returns {Array} Array of particles
 */
export function createOrbitalSystem(center, count = 10, radius = 100, speed = 50) {
  const particles = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    // Tangential velocity for circular orbit
    const vx = -Math.sin(angle) * speed;
    const vy = Math.cos(angle) * speed;

    particles.push(new Particle({
      x,
      y,
      vx,
      vy,
      mass: 1,
      radius: 5,
    }));
  }

  return particles;
}

/**
 * Calculate kinetic energy
 *
 * KE = ½mv²
 *
 * @param {Particle} particle - Particle
 * @returns {number} Kinetic energy
 */
export function kineticEnergy(particle) {
  const vSquared = particle.velocity.x * particle.velocity.x +
                   particle.velocity.y * particle.velocity.y;
  return 0.5 * particle.mass * vSquared;
}

/**
 * Calculate momentum
 *
 * p = mv
 *
 * @param {Particle} particle - Particle
 * @returns {Object} Momentum vector {x, y}
 */
export function momentum(particle) {
  return {
    x: particle.mass * particle.velocity.x,
    y: particle.mass * particle.velocity.y,
  };
}

/**
 * Apply damping to particle
 *
 * Reduces velocity by a factor.
 *
 * @param {Particle} particle - Particle
 * @param {number} damping - Damping factor (0-1, where 1 = no damping)
 */
export function applyDamping(particle, damping = 0.99) {
  particle.velocity.x *= damping;
  particle.velocity.y *= damping;
}

export default {
  Particle,
  ParticleSystem,
  applyGravity,
  applyFriction,
  applyDrag,
  applySpringForce,
  applyAttraction,
  applyRepulsion,
  resolveCollision,
  constrainToBoundary,
  constrainDistance,
  createExplosion,
  createOrbitalSystem,
  kineticEnergy,
  momentum,
  applyDamping,
};
