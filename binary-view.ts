import type { PrimitiveView } from "./view-types.ts";

export class BinaryView extends DataView implements PrimitiveView<Uint8Array> {
  static viewLength = 0;
  static decode(view: DataView, start = 0, length = view.byteLength) {
    return new Uint8Array(
      view.buffer.slice(
        view.byteOffset + start,
        view.byteOffset + start + length,
      ),
    );
  }
  static encode(value: Uint8Array, view: DataView, start = 0, length?: number) {
    const valueLength = value.byteLength - value.byteOffset;
    const size = !length || valueLength < length ? valueLength : length;
    new Uint8Array(view.buffer, view.byteOffset, view.byteLength).set(
      new Uint8Array(value.buffer, value.byteOffset, size),
      start,
    );
    return size;
  }

  static from(value: Uint8Array) {
    return new this(value.buffer, value.byteOffset, value.byteLength);
  }

  static getLength(size: number) {
    return size;
  }

  get() {
    return (this.constructor as typeof BinaryView).decode(this);
  }
  set(value: Uint8Array) {
    (this.constructor as typeof BinaryView).encode(value, this);
  }
  toJSON() {
    return this.get();
  }
}
