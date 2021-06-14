import { ArrayView } from "./array-view.ts";

export class TypedArrayView<T> extends ArrayView<T> {
  static offset = 0;

  static getOffset(index: number): number {
    return index << this.offset;
  }

  static getSize(length: number): number {
    return length >> this.offset;
  }
}
