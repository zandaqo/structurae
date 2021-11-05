import type {
  ComplexView,
  ViewConstructor,
  ViewInstance,
} from "./view-types.ts";
import type { ArrayView } from "./array-view.ts";
import type { VectorView } from "./vector-view.ts";

// deno-lint-ignore ban-types
export class DictView<T extends object> extends DataView
  implements ComplexView<T> {
  static viewLength = 0;
  static maxView: DataView;
  static KeysView: typeof ArrayView;
  static ValuesView: typeof VectorView;

  static decode<T>(view: DataView, start = 0): T {
    const { KeysView, ValuesView } = this;
    const keyLength = KeysView.itemLength!;
    const size = ValuesView.getSize(view, start);
    const keysOffset = view.getUint32(start + ((1 + size) << 2), true);
    const result = {} as T;
    for (let i = 0; i < size; i++) {
      const key = (KeysView.View as ViewConstructor<keyof T>).decode(
        view,
        start + keysOffset + i * keyLength,
        keyLength,
      );
      const valueOffset = ValuesView.getOffset(i, view, start);
      const value = !valueOffset
        ? undefined
        : (ValuesView.View as ViewConstructor<T[keyof T]>).decode(
          view,
          start + valueOffset[0],
          valueOffset[1],
        );
      result[key] = value!;
    }
    return result;
  }

  static encode<T>(
    value: T,
    view: DataView,
    start = 0,
    length?: number,
  ): number {
    const { KeysView, ValuesView } = this;
    const keys = Object.keys(value);
    const requiredLength = keys.length * KeysView.itemLength!;
    const maxLength = length ? length - requiredLength : undefined;
    let written = ValuesView.encode(
      Object.values(value),
      view,
      start,
      maxLength,
    );
    written += KeysView.encode(
      keys,
      view,
      start + written,
      requiredLength,
    );
    return written;
  }

  // deno-lint-ignore ban-types
  static from<T extends object, U extends DictView<T>>(value: T): U {
    const end = this.encode<T>(value, this.maxView, 0, undefined);
    return new this<T>(this.maxView.buffer.slice(0, end)) as U;
  }

  static getLength<T>(value: T): number {
    const { KeysView, ValuesView } = this;
    const keyLength = KeysView.itemLength!;
    // required length
    let length = 4 + Object.keys(value).length * keyLength;
    length += ValuesView.getLength(Object.values(value));
    return length;
  }

  get<P extends keyof T>(key: P): T[P] | undefined {
    const offset = this.getOffset(key);
    return offset
      ? ((this.constructor as typeof DictView).ValuesView
        .View as ViewConstructor<T[P]>).decode(
          this,
          offset[0],
          offset[1],
        )
      : undefined;
  }

  getLength<P extends keyof T>(key: P): number {
    const offset = this.getOffset(key);
    return offset ? offset[1] : 0;
  }

  getOffset<P extends keyof T>(key: P): [number, number] | undefined {
    const index = this.indexOf(key);
    if (!~index) return undefined;
    return (this.constructor as typeof DictView).ValuesView.getOffset(
      index,
      this,
      0,
    );
  }

  getView<P extends keyof T>(key: P): ViewInstance<T[P]> | undefined {
    const offset = this.getOffset(key);
    return offset
      ? new ((this.constructor as typeof DictView).ValuesView
        .View as ViewConstructor<T[P]>)(
        this.buffer,
        this.byteOffset + offset[0],
        offset[1],
      )
      : undefined;
  }

  indexOf<P extends keyof T>(key: P): number {
    const { KeysView } = this.constructor as typeof DictView;
    const amount = this.getUint32(0, true);
    const keysOffset = this.getUint32((1 + amount) << 2, true);
    return KeysView.indexOf(
      key,
      this,
      0,
      keysOffset,
      amount * KeysView.itemLength,
    );
  }

  set<P extends keyof T>(key: P, value: T[P]) {
    const offset = this.getOffset(key);
    if (!offset) return undefined;
    ((this.constructor as typeof DictView).ValuesView
      .View as ViewConstructor<T[P]>).encode(
        value,
        this,
        this.byteOffset + offset[0],
        offset[1],
      );
    return;
  }

  setView<P extends keyof T>(key: P, value: DataView) {
    const offset = this.getOffset(key);
    if (!offset) return undefined;
    new Uint8Array(this.buffer, this.byteOffset + offset[0], offset[1]).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );
    return;
  }

  toJSON(): T {
    return (this.constructor as typeof DictView).decode<T>(this);
  }
}
