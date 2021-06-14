import type { PrimitiveView } from "./view-types.ts";

export class BooleanView extends DataView implements PrimitiveView<boolean> {
  static viewLength = 1;

  static decode(view: DataView, start = 0): boolean {
    return !!DataView.prototype.getUint8.call(view, start);
  }

  static encode(value: boolean, view: DataView, start = 0): number {
    DataView.prototype.setUint8.call(view, start, +value);
    return this.viewLength;
  }

  static from(value: boolean) {
    const typeView = new this(new ArrayBuffer(this.viewLength));
    this.encode(value, typeView, 0);
    return typeView;
  }

  static getLength(): number {
    return this.viewLength;
  }

  get(): boolean {
    return (this.constructor as typeof BooleanView).decode(this);
  }

  set(value: boolean): this {
    (this.constructor as typeof BooleanView).encode(value, this);
    return this;
  }

  toJSON(): boolean {
    return (this.constructor as typeof BooleanView).decode(this);
  }
}
