import type { PrimitiveView, ViewConstructor } from "../../view-types.ts";
import { BitArray } from "../../bit-array.ts";

export class BitArrayView extends DataView implements PrimitiveView<BitArray> {
  static viewLength = 0;
  static decode(view: DataView, start = 0, length = view.byteLength) {
    return new BitArray(
      view.buffer.slice(
        view.byteOffset + start,
        view.byteOffset + start + length,
      ),
    );
  }
  static encode(value: BitArray, view: DataView, start = 0, length?: number) {
    const size = !length || value.byteLength < length
      ? value.byteLength
      : length;
    new Uint8Array(view.buffer, view.byteOffset, view.byteLength).set(
      new Uint8Array(value.buffer, value.byteOffset, size),
      start,
    );
    return size;
  }

  static from(value: BitArray) {
    return new this(value.buffer, value.byteOffset, value.byteLength);
  }

  static getLength(size: number) {
    return size;
  }

  get() {
    return (this.constructor as typeof BitArrayView).decode(this);
  }
  set(value: BitArray) {
    (this.constructor as typeof BitArrayView).encode(value, this);
  }
  toJSON() {
    return this.get();
  }

  static initialize(): ViewConstructor<BitArray, PrimitiveView<BitArray>> {
    return this;
  }
}

declare module "../../view-types.ts" {
  interface ViewSchemaTypeMap {
    bitarray: "string";
  }
}
