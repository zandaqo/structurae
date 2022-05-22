import type { View } from "./view.ts";
import type {
  ComplexView,
  ContainerView,
  PrimitiveView,
  ViewConstructor,
  ViewInstance,
  ViewSchema,
} from "./view-types.ts";

export class VectorView<T> extends DataView implements ContainerView<T> {
  static View: ViewConstructor<
    unknown,
    PrimitiveView<unknown> | ContainerView<unknown> | ComplexView<unknown>
  >;
  static viewLength = 0;
  static maxView: DataView;

  get size(): number {
    return (this.constructor as typeof VectorView).getSize(this);
  }

  static decode<T>(view: DataView, start = 0): Array<T | undefined> {
    const View = this.View as ViewConstructor<T>;
    const size = this.getSize(view, start);
    const array = new Array(size) as Array<T | undefined>;
    for (let i = 0; i < size; i++) {
      const offset = this.getOffset(i, view, start);
      array[i] = offset
        ? View.decode(view, start + offset[0], offset[1])
        : undefined;
    }
    return array;
  }

  static encode<T>(
    value: Array<T>,
    view: DataView,
    start = 0,
    length?: number,
  ): number {
    const { View } = this;
    const items = value.length;
    const lastOffset = (items + 1) << 2;
    let end = lastOffset + 4;
    let availableSpace = (length ?? view.byteLength) - end;
    if (availableSpace < 1) return 0;
    view.setUint32(start, items, true);
    for (let i = 0; i < items; i++) {
      const item = value[i];
      const itemOffset = (i + 1) << 2;
      view.setUint32(start + itemOffset, end, true);
      let itemLength = 0;
      if (item != null) {
        const caret = start + end;
        if (View.viewLength || View.itemLength) {
          itemLength = View.getLength(value.length);
          // stop encoding if no more space is available
          if (itemLength > availableSpace) continue;
          View.encode(item, view, caret, itemLength);
        } else {
          itemLength = View.encode(
            item,
            view,
            caret,
            length ? availableSpace : undefined,
          );
        }
        end += itemLength;
        availableSpace -= itemLength;
      }
    }
    view.setUint32(start + lastOffset, end, true);
    return end;
  }

  static from<T, U extends VectorView<T>>(value: Array<T>): U {
    const { maxView } = this;
    const end = this.encode(value, maxView);
    return new this(maxView.buffer.slice(0, end)) as U;
  }

  static getLength<T>(value: Array<T>): number {
    const { View } = this;
    const items = value.length;
    let length = (items + 2) << 2;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== undefined) {
        length += View.getLength(value[i]);
      }
    }
    return length;
  }

  static getOffset(
    index: number,
    view: DataView,
    start = 0,
  ): [start: number, length: number] | undefined {
    const offset = start + ((index + 1) << 2);
    const begin = view.getUint32(offset, true);
    const end = view.getUint32(offset + 4, true);
    if (begin === end) return undefined;
    return [begin, end - begin];
  }

  static getSize(view: DataView, start = 0): number {
    return view.getUint32(start, true);
  }

  static indexOf<T>(
    value: T,
    view: DataView,
    startIndex = 0,
    startOffset = 0,
  ) {
    const size = this.getSize(view, startOffset);
    const valueView = this.View.from(value);
    outer:
    for (let i = startIndex; i < size; i++) {
      const offset = this.getOffset(i, view, startOffset);
      if (!offset || offset[1] !== valueView.byteLength) continue;
      for (let j = 0; j < valueView.byteLength; j++) {
        if (valueView.getUint8(j) !== view.getUint8(offset[0] + j)) {
          continue outer;
        }
      }
      return i;
    }
    return -1;
  }

  *[Symbol.iterator](): Generator<ViewInstance<T> | undefined> {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.getView(i);
    }
  }

  at(index: number): T | undefined {
    if (index < 0) return this.get(this.size + index);
    return this.get(index);
  }

  get(index: number): T | undefined {
    const View = (this.constructor as typeof VectorView)
      .View as ViewConstructor<T>;
    const offset = this.getOffset(index);
    if (!offset) return undefined;
    return View.decode(this, offset[0], offset[1]);
  }

  getLength(index: number): number {
    const offset = this.getOffset(index);
    return offset ? offset[1] : 0;
  }

  getOffset(index: number): [number, number] | undefined {
    const length = this.getUint32(0, true);
    if (index >= length) return undefined;
    return (this.constructor as typeof VectorView).getOffset(index, this, 0);
  }

  getView(index: number): ViewInstance<T> | undefined {
    const View = (this.constructor as typeof VectorView)
      .View as ViewConstructor<T>;
    const offset = this.getOffset(index);
    if (!offset) return undefined;
    return new View(this.buffer, this.byteOffset + offset[0], offset[1]);
  }

  indexOf(value: T, start = 0): number {
    return (this.constructor as typeof VectorView).indexOf(
      value,
      this,
      start,
      0,
    );
  }

  set(index: number, value: T): void {
    const View = (this.constructor as typeof VectorView)
      .View as ViewConstructor<T>;
    const offset = this.getOffset(index);
    if (!offset) return undefined;
    View.encode(value, this, this.byteOffset + offset[0], offset[1]);
  }

  setView(index: number, value: DataView): void {
    const offset = this.getOffset(index);
    if (!offset) return undefined;
    new Uint8Array(this.buffer, this.byteOffset + offset[0], offset[1]).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );
  }

  toJSON(): Array<T | undefined> {
    return (this.constructor as typeof VectorView).decode(this, 0);
  }

  static initialize<T>(
    schema: ViewSchema<T>,
    Factory: typeof View,
    SchemaView?: ViewConstructor<T>,
  ): ViewConstructor<Array<T | undefined>> {
    const ItemView = SchemaView ?? Factory.getExistingView(schema);
    return class extends this<T> {
      static View = ItemView;
      static maxView = Factory.maxView;
    };
  }
}
