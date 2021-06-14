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

  /**
   * Creates a view with a given value.
   */
  static from(value: boolean) {
    const typeView = new this(new ArrayBuffer(this.viewLength));
    this.encode(value, typeView, 0);
    return typeView;
  }

  /**
   * Returns the length of a view.
   *
   *
   */
  static getLength(): number {
    return this.viewLength;
  }

  /**
   * Returns the numerical value of the view.
   */
  get(): boolean {
    return (this.constructor as typeof BooleanView).decode(this);
  }

  /**
   * Sets the numerical value of the view.
   *
   * @param value
   */
  set(value: boolean): this {
    (this.constructor as typeof BooleanView).encode(value, this);
    return this;
  }

  /**
   * Returns the numerical value of the view.
   */
  toJSON(): boolean {
    return (this.constructor as typeof BooleanView).decode(this);
  }
}
