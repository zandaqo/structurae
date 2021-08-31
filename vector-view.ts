import type {
  ComplexView,
  ContainerView,
  PrimitiveView,
  ViewConstructor,
  ViewInstance,
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
      const offset = (i + 1) << 2;
      const startOffset = view.getUint32(start + offset, true);
      const end = view.getUint32(start + offset + 4, true);
      array[i] = startOffset !== end
        ? View.decode(view, start + startOffset, end - startOffset)
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
          itemLength = View.getLength(value.length || 1);
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

  static getSize(view: DataView, start = 0): number {
    return view.getUint32(start, true);
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
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    return View.decode(this, layout[0], layout[1]);
  }

  getLength(index: number): number {
    const layout = this.getLayout(index);
    if (!layout) return 0;
    return layout[1];
  }

  getLayout(index: number): [number, number] | undefined {
    const length = this.getUint32(0, true);
    if (index >= length) return undefined;
    const startOffset = (index + 1) << 2;
    const start = this.getUint32(startOffset, true);
    const end = this.getUint32(startOffset + 4, true);
    if (start === end) return undefined;
    return [start, end - start];
  }

  getView(index: number): ViewInstance<T> | undefined {
    const View = (this.constructor as typeof VectorView)
      .View as ViewConstructor<T>;
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    return new View(this.buffer, this.byteOffset + layout[0], layout[1]);
  }

  set(index: number, value: T): void {
    const View = (this.constructor as typeof VectorView)
      .View as ViewConstructor<T>;
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    View.encode(value, this, this.byteOffset + layout[0], layout[1]);
  }

  setView(index: number, value: DataView): void {
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    new Uint8Array(this.buffer, this.byteOffset + layout[0], layout[1]).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );
  }

  toJSON(): Array<T | undefined> {
    return (this.constructor as typeof VectorView).decode(this, 0);
  }
}
