import type {
  ComplexView,
  ContainerView,
  PrimitiveView,
  ViewConstructor,
  ViewInstance,
} from "./view-types.ts";

export class ArrayView<T> extends DataView implements ContainerView<T> {
  static View: ViewConstructor<
    unknown,
    PrimitiveView<unknown> | ContainerView<unknown> | ComplexView<unknown>
  >;
  static viewLength = 0;
  static itemLength: number;

  get size() {
    return (this.constructor as typeof ArrayView).getSize(this.byteLength);
  }

  static decode<T>(
    view: DataView,
    start = 0,
    length = view.byteLength,
  ): Array<T> {
    const { View, itemLength } = this;
    const size = this.getSize(length);
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const offset = this.getOffset(i);
      array[i] = View.decode(view, start + offset, itemLength);
    }
    return array;
  }

  static encode<T>(
    value: Array<T>,
    view: DataView,
    start = 0,
    length = view.byteLength,
  ): number {
    const { View, itemLength } = this;
    const size = this.getSize(length);
    const max = size < value.length ? size : value.length;
    for (let i = 0; i < max; i++) {
      const offset = this.getOffset(i);
      View.encode(value[i], view, start + offset, itemLength);
    }
    const written = max * itemLength;
    // zero-out remaining bytes
    let caret = written;
    while (caret < length) view.setUint8(start + caret++, 0);
    return written;
  }

  static from<T, U extends ArrayView<T>>(value: Array<T>): U {
    const view = new this<T>(new ArrayBuffer(this.getOffset(value.length)));
    this.encode<T>(value, view, 0, view.byteLength);
    return view as U;
  }

  static getLength(size: number): number {
    return this.getOffset(size);
  }

  static getOffset(index: number): number {
    return (index * this.itemLength) | 0;
  }

  static getSize(length: number): number {
    return (length / this.itemLength) | 0;
  }

  *[Symbol.iterator](): Iterator<ViewInstance<T>> {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.getView(i);
    }
  }

  at(index: number): T {
    if (index < 0) return this.get(this.size + index);
    return this.get(index);
  }

  get(index: number): T {
    const constructor = this.constructor as typeof ArrayView;
    const View = constructor.View as ViewConstructor<T>;
    return View.decode(this, constructor.getOffset(index));
  }

  getLength(_: number): number {
    return (this.constructor as typeof ArrayView).itemLength;
  }

  getView(index: number): ViewInstance<T> {
    const constructor = this.constructor as typeof ArrayView;
    const View = constructor.View as ViewConstructor<T>;
    return new View(
      this.buffer,
      this.byteOffset + constructor.getOffset(index),
      constructor.itemLength,
    );
  }

  set(index: number, value: T): void {
    const constructor = this.constructor as typeof ArrayView;
    const View = constructor.View as ViewConstructor<T>;
    View.encode(
      value,
      this,
      this.byteOffset + constructor.getOffset(index),
      constructor.itemLength,
    );
  }

  setView(index: number, value: DataView): void {
    const constructor = this.constructor as typeof ArrayView;
    new Uint8Array(
      this.buffer,
      this.byteOffset + constructor.getOffset(index),
      constructor.itemLength,
    ).set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  }

  toJSON(): Array<T> {
    return (this.constructor as typeof ArrayView).decode<T>(
      this,
      0,
      this.byteLength,
    );
  }
}
