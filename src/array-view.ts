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

  /**
   * The amount of items in the array.
   */
  get size() {
    return (this.constructor as typeof ArrayView).getSize(this.byteLength);
  }

  /**
   * Decodes a given view into corresponding JavaScript value.
   *
   * @param view the view to decode
   * @param start the starting offset
   * @param length the byte length to decode
   * @return the JavaScript value
   */
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

  /**
   * Encodes a JavaScript value into a given view.
   *
   * @param value the value to encode
   * @param view the view to encode into
   * @param start the view offset to start
   * @param length the byte length to encode
   * @return the amount of written bytes
   */
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

  /**
  * Creates an array view from a given JavaScript array.
  *
  * @param value the array to encode
  * @return the new view
  */
  static from<T, U extends ArrayView<T>>(value: Array<T>): U {
    const view = new this<T>(new ArrayBuffer(this.getOffset(value.length)));
    this.encode<T>(value, view, 0, view.byteLength);
    return view as U;
  }

  /**
   * Returns the byte length of an array view to hold a given amount of items.
   *
   * @param size the amount of items
   * @return the byte length required for the given amount of items
   */
  static getLength(size: number): number {
    return this.getOffset(size);
  }

  /**
   * Returns the starting byte offset of an item in the array.
   *
   * @param index
   */
  static getOffset(index: number): number {
    return (index * this.itemLength) | 0;
  }

  /**
   * Calculates the size of an array from it's byte length.
   *
   * @param length
   */
  static getSize(length: number): number {
    return (length / this.itemLength) | 0;
  }

  /**
   * Allows iterating over views stored in the array.
   */
  *[Symbol.iterator](): Iterator<ViewInstance<T>> {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.getView(i);
    }
  }

  /**
   * Returns a value at a given index.
   *
   * @param index
   */
  get(index: number): T {
    const constructor = this.constructor as typeof ArrayView;
    const View = constructor.View as ViewConstructor<T>;
    return View.decode(this, constructor.getOffset(index));
  }

  /**
   * Returns the length of an item.
   */
  getLength(_: number): number {
    return (this.constructor as typeof ArrayView).itemLength;
  }

  /**
   * Returns an item view at a given index.
   *
   * @param index
   */
  getView(index: number): ViewInstance<T> {
    const constructor = this.constructor as typeof ArrayView;
    const View = constructor.View as ViewConstructor<T>;
    return new View(
      this.buffer,
      this.byteOffset + constructor.getOffset(index),
      constructor.itemLength,
    );
  }

  /**
   * Sets a value at a given index.
   *
   * @param index
   * @param value
   */
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

  /**
   * Sets an item view at a given index.
   *
   * @param index
   * @param value
   */
  setView(index: number, value: DataView): void {
    const constructor = this.constructor as typeof ArrayView;
    new Uint8Array(
      this.buffer,
      this.byteOffset + constructor.getOffset(index),
      constructor.itemLength,
    ).set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  }

  /**
   * Returns an array representation of the array view.
   */
  toJSON(): Array<T> {
    return (this.constructor as typeof ArrayView).decode<T>(
      this,
      0,
      this.byteLength,
    );
  }
}
