import type { AdjacencyStructure, Bit } from "./utility-types.ts";
import { getLog2 } from "./utilities.ts";

/**
 * Implements the Adjacency Matrix structure for unweighted directed graphs.
 */
export class AdjacencyMatrixUnweightedDirected extends Uint32Array
  implements AdjacencyStructure {
  static directed = true;
  static weighted = false;
  empty = 0;

  static get [Symbol.species]() {
    return Uint32Array;
  }

  _size = 0;

  get size() {
    return this._size || ((this._size = getLog2(this.vertices)), this._size);
  }

  get vertices() {
    return this[this.length - 1];
  }

  set vertices(value: number) {
    this[this.length - 1] = value;
    this._size = getLog2(value);
  }

  get edges() {
    return this.vertices ** 2;
  }

  static create(vertices: number) {
    const length = this.getLength(vertices);
    const matrix = new this(length);
    matrix.vertices = vertices;
    return matrix;
  }

  static getLength(vertices: number) {
    return ((vertices << getLog2(vertices)) >> 5) + 2;
  }

  addEdge(x: number, y: number): this {
    const [bucket, position] = this.getCoordinates(x, y);
    if (Number.isNaN(bucket)) return this;
    this[bucket] = (this[bucket] & ~(1 << position)) | (1 << position);
    return this;
  }

  getCoordinates(x: number, y = 1): [bucket: number, position: number] {
    const index = this.getIndex(x, y);
    const bucket = index >> 5;
    if (bucket >= this.length - 1) return [NaN, NaN];
    return [bucket, index - (bucket << 5)];
  }

  getEdge(x: number, y: number): number {
    const [bucket, position] = this.getCoordinates(x, y);
    if (Number.isNaN(bucket)) return 0;
    return ((this[bucket] >> position) & 1) as Bit;
  }

  getIndex(x: number, y: number): number {
    return (x << this.size) + y;
  }

  hasEdge(x: number, y: number): boolean {
    return !!this.getEdge(x, y);
  }

  *inEdges(vertex: number) {
    const { vertices } = this;
    for (let i = 0; i < vertices; i++) {
      if (this.getEdge(i, vertex)) yield i;
    }
  }

  isFull(): boolean {
    return false;
  }

  *outEdges(vertex: number) {
    const { vertices } = this;
    for (let i = 0; i < vertices; i++) {
      if (this.getEdge(vertex, i)) yield i;
    }
  }

  removeEdge(x: number, y: number): this {
    const [bucket, position] = this.getCoordinates(x, y);
    if (Number.isNaN(bucket)) return this;
    this[bucket] = this[bucket] & ~(1 << position);
    return this;
  }
}
