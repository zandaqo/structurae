import { ArrayView } from "./array-view.ts";

export class TypedArrayView<T> extends ArrayView<T> {
  static offset = 0;
  /**
   * Returns the starting byte offset of an item in the array.
   *
   * @param index
   *
   */
  static getOffset(index: number): number {
    return index << this.offset;
  }

  /**
   * Calculates the size of an array from it's byte length.
   *
   * @param length
   *
   */
  static getSize(length: number): number {
    return length >> this.offset;
  }
}
