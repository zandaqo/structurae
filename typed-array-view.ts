import { ArrayView } from "./array-view.ts";

export class TypedArrayView<T> extends ArrayView<T> {
  static offset = 0;

  static override getOffset(index: number): number {
    return index << this.offset;
  }

  static override getSize(length: number): number {
    return length >> this.offset;
  }
}
