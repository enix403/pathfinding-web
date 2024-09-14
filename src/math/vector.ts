/**
 * A type representing a vector-like object with `x` and `y` properties.
 */
export interface ThinVector {
  /**
   * The x-coordinate of the vector.
   */
  x: number;

  /**
   * The y-coordinate of the vector.
   */
  y: number;
}

/**
 * Class representing a 2D vector with `x` and `y` components.
 */
export class Vector implements ThinVector {
  /**
   * The x-coordinate of the vector.
   */
  public x: number;

  /**
   * The y-coordinate of the vector.
   */
  public y: number;

  /**
   * A small constant used to handle floating-point precision errors in calculations.
   */
  public static epsilon = 0.00001;

  /**
   * A zero vector (0, 0).
   */
  public static get zero(): Vector {
    return new Vector(0, 0);
  }

  /**
   * A ones vector (1, 1).
   */
  public static get one(): Vector {
    return new Vector(1, 1);
  }

  /**
   * A vector pointing upwards (0, 1).
   */
  public static get up(): Vector {
    return new Vector(0, 1);
  }

  /**
   * A vector pointing downwards (0, -1).
   */
  public static get down(): Vector {
    return new Vector(0, -1);
  }

  /**
   * A vector pointing to the right (1, 0).
   */
  public static get right(): Vector {
    return new Vector(1, 0);
  }

  /**
   * A vector pointing to the left (-1, 0).
   */
  public static get left(): Vector {
    return new Vector(-1, 0);
  }

  /**
   * Creates a new zero vector
   */
  public constructor();
  /**
   * Creates an instance of Vector.
   * @param {number} [x=0] - The x-coordinate of the vector.
   * @param {number} [y=0] - The y-coordinate of the vector.
   */
  public constructor(x: number, y: number);
  public constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  /**
   * Creates a new Vector from a given VectorLike object.
   * @param {ThinVector} v - The object containing `x` and `y` properties.
   * @returns {Vector} A new vector with the same `x` and `y` values as the provided object.
   */
  public static fromObject(v: ThinVector): Vector {
    return new Vector(v.x, v.y);
  }

  /**
   * Adds another vector to this vector and returns a new vector.
   * @param {Vector} other - The vector to add.
   * @returns {Vector} A new vector that is the sum of this vector and the other vector.
   */
  public add(other: ThinVector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Adds another vector to this vector in place, modifying this vector.
   * @param {Vector} other - The vector to add.
   * @returns {this} The current vector, modified by the addition.
   */
  public addIp(other: ThinVector): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtracts another vector from this vector and returns a new vector.
   * @param {Vector} other - The vector to subtract.
   * @returns {Vector} A new vector that is the difference of this vector and the other vector.
   */
  public sub(other: ThinVector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  /**
   * Subtracts another vector from this vector in place, modifying this vector.
   * @param {Vector} other - The vector to subtract.
   * @returns {this} The current vector, modified by the subtraction.
   */
  public subIp(other: ThinVector): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Multiplies this vector by a scalar factor and returns a new vector.
   * @param {number} factor - The scalar factor to multiply by.
   * @returns {Vector} A new vector that is the product of this vector and the scalar factor.
   */
  public mul(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  /**
   * Multiplies this vector by a scalar factor in place, modifying this vector.
   * @param {number} factor - The scalar factor to multiply by.
   * @returns {this} The current vector, modified by the multiplication.
   */
  public mulIp(factor: number): this {
    this.x *= factor;
    this.y += factor;
    return this;
  }

  /**
   * Divides this vector by a scalar factor and returns a new vector.
   * @param {number} factor - The scalar factor to divide by.
   * @returns {Vector} A new vector that is the quotient of this vector and the scalar factor.
   */
  public div(factor: number): Vector {
    return new Vector(this.x / factor, this.y / factor);
  }

  /**
   * Divides this vector by a scalar factor in place, modifying this vector.
   * @param {number} factor - The scalar factor to divide by.
   * @returns {this} The current vector, modified by the division.
   */
  public divIp(factor: number): this {
    this.x /= factor;
    this.y /= factor;
    return this;
  }

  /**
   * Creates a clone of this vector.
   * @returns {Vector} A new vector with the same `x` and `y` values as this vector.
   */
  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * Calculates the squared length (magnitude) of this vector.
   * @returns {number} The squared length of this vector.
   */
  public lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Calculates the length (magnitude) of this vector.
   * @returns {number} The length of this vector.
   */
  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  /**
   * Normalizes this vector (makes it a unit vector) and returns a new vector.
   * @returns {Vector} A new vector that is the normalized version of this vector.
   */
  public normalize(): Vector {
    const length = this.length();

    if (length > Vector.epsilon) {
      return new Vector(this.x / length, this.y / length);
    } else {
      return new Vector(0, 0);
    }
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * @param {Vector} other - The other vector to calculate the dot product with.
   * @returns {number} The dot product of this vector and the other vector.
   */
  public dot(other: ThinVector): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculates the angle of this vector relative to the positive x-axis.
   * @returns {number} The angle in radians between this vector and the positive x-axis.
   */
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Sets the `x` and `y` components of this vector.
   * @param {number} x - The new x-coordinate.
   * @param {number} y - The new y-coordinate.
   * @returns {this} The current vector with updated components.
   */
  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets the `x` component of this vector.
   * @param {number} x - The new x-coordinate.
   * @returns {this} The current vector with the updated x component.
   */
  public setX(x: number): this {
    this.x = x;
    return this;
  }

  /**
   * Sets the `y` component of this vector.
   * @param {number} y - The new y-coordinate.
   * @returns {this} The current vector with the updated y component.
   */
  public setY(y: number): this {
    this.y = y;
    return this;
  }

  /**
   * Sets the `x` and `y` components of this vector from another vector-like object.
   * @param {ThinVector} vector - The vector-like object with `x` and `y` properties.
   * @returns {this} The current vector with updated components.
   */
  public setFromObject(vector: ThinVector): this {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  /**
   * Returns a string representation of this vector.
   */
  public toString(): string {
    return `Vec(${this.x}, ${this.y})`;
  }
}

(<any>window).Vector = Vector;
