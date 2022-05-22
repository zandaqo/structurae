// deno-lint-ignore-file ban-types
import type { Constructor } from "./utility-types.ts";
import type { View } from "./view.ts";
import type {
  ComplexView,
  ViewConstructor,
  ViewInstance,
  ViewLayout,
  ViewSchema,
} from "./view-types.ts";

export class MapView<T extends object> extends DataView
  implements ComplexView<T> {
  static viewLength = 0;
  static layout: ViewLayout<unknown>;
  static lengthOffset: number;
  static optionalOffset: number;
  static fields: Array<unknown>;
  static optionalFields: Array<unknown>;
  static maxView: DataView;
  static defaultData?: Uint8Array;
  static ObjectConstructor: Constructor<unknown>;

  static decode<T>(view: DataView, start = 0): T {
    const fields = this.fields as Array<keyof T>;
    const layout = this.layout as ViewLayout<T>;
    const optionalFields = this.optionalFields as Array<keyof T>;
    const object = new this.ObjectConstructor() as T;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const { View, start: startOffset, length } = layout[field];
      object[field] = View.decode(view, start + startOffset, length);
    }
    for (let i = 0; i < optionalFields.length; i++) {
      const field = optionalFields[i];
      const { View, start: startOffset } = layout[field];
      const fieldStart = view.getUint32(start + startOffset, true);
      const end = view.getUint32(start + startOffset + 4, true);
      if (fieldStart === end) continue;
      object[field] = View.decode(view, start + fieldStart, end - fieldStart);
    }
    return object;
  }

  static encode<T>(
    value: T,
    view: DataView,
    start = 0,
    length?: number,
    amend?: boolean,
  ) {
    const fields = this.fields as Array<keyof T>;
    const layout = this.layout as ViewLayout<T>;
    const optionalFields = this.optionalFields as Array<keyof T>;
    // zero-out required part if encode is called internally providing length
    if (!amend) {
      new Uint8Array(
        view.buffer,
        view.byteOffset + start,
        this.optionalOffset,
      ).fill(0);
    }
    for (const field of fields) {
      const fieldValue = value[field];
      if (fieldValue != null) {
        const { View, length: maxLength, start: fieldStart } = layout[field];
        View.encode(fieldValue, view, start + fieldStart, maxLength);
      }
    }
    let end = this.lengthOffset + 4;
    let availableSpace = (length ?? view.byteLength) - end;
    for (const field of optionalFields) {
      const fieldValue = value[field];
      const { View, length: maxLayoutLength, start: fieldStart } = layout[
        field
      ];
      view.setUint32(start + fieldStart, end, true);
      let fieldLength = 0;
      if (fieldValue != null) {
        const caret = start + end;
        if (View.viewLength || View.itemLength) {
          fieldLength = View.getLength(
            (fieldValue as unknown as Array<unknown>).length || 1,
          );
          if (fieldLength > availableSpace) continue;
          View.encode(fieldValue, view, caret, fieldLength);
        } else {
          // support setting max length for optional strings
          const maxLength = length
            ? Math.min(availableSpace, maxLayoutLength)
            : maxLayoutLength !== Infinity
            ? maxLayoutLength
            : undefined;
          fieldLength = View.encode(fieldValue, view, caret, maxLength);
        }
        end += fieldLength;
        availableSpace -= fieldLength;
      }
    }
    view.setUint32(start + this.lengthOffset, end, true);
    return end;
  }

  static from<T extends object, U extends MapView<T>>(value: T): U {
    const { maxView, defaultData } = this;
    const mapArray = new Uint8Array(maxView.buffer, maxView.byteOffset);
    if (defaultData) {
      mapArray.set(defaultData);
    }
    const end = this.encode<T>(value, maxView, 0, undefined, true);
    return new this<T>(maxView.buffer.slice(0, end)) as U;
  }

  static getLength<T>(value: T): number {
    const layout = this.layout as ViewLayout<T>;
    const optionalFields = this.optionalFields as Array<keyof T>;
    let length = this.lengthOffset + 4;
    for (let i = 0; i < optionalFields.length; i++) {
      const field = optionalFields[i];
      const fieldValue = value[field];
      if (fieldValue == null) continue;
      let fieldLength = 0;
      const { View, length: maxLength } = layout[field];
      if (View.viewLength) {
        fieldLength = View.viewLength;
      } else if (View.itemLength) {
        fieldLength = View.getLength(
          ((fieldValue as unknown) as Array<unknown>).length,
        );
      } else {
        fieldLength = View.getLength((fieldValue as unknown) as number);
      }
      length += Math.min(fieldLength, maxLength);
    }
    return length;
  }

  get<P extends keyof T>(field: P): T[P] | undefined {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    return View.decode(this, start, length);
  }

  getLength<P extends keyof T>(field: P): number {
    const layout = this.getLayout(field);
    if (!layout) return 0;
    return layout[2];
  }

  getLayout<P extends keyof T>(
    field: P,
  ): [ViewConstructor<T[P]>, number, number] | undefined {
    const layout = (this.constructor as typeof MapView).layout as ViewLayout<T>;
    const definition = layout[field];
    if (!definition) return undefined;
    const { View, start, required, length } = definition;
    if (required) {
      return [View, start, length];
    }
    const startOffset = this.getUint32(start, true);
    const end = this.getUint32(start + 4, true);
    if (startOffset === end) return undefined;
    return [View, startOffset, end - startOffset];
  }

  getView<P extends keyof T>(field: P): ViewInstance<T[P]> | undefined {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    return new View(this.buffer, start, length);
  }

  set<P extends keyof T>(field: P, value: T[P]) {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    View.encode(value, this, this.byteOffset + start, length);
    return undefined;
  }

  setView<P extends keyof T>(field: P, view: DataView) {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength).set(
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
      layout[1],
    );
    return undefined;
  }

  toJSON(): T {
    return (this.constructor as typeof MapView).decode<T>(this);
  }

  static initialize<T extends object>(
    schema: ViewSchema<T>,
    Factory: typeof View,
    constructor: Constructor<T>,
  ): ViewConstructor<T, ComplexView<T>> {
    const required: Array<keyof T> = schema.required || [];
    const optional = (Object.keys(schema.properties!) as Array<keyof T>).filter(
      (i) => !required.includes(i),
    );
    const layout = {} as ViewLayout<T>;
    let offset = 0;
    for (const property of required) {
      const field = schema.properties![property];
      const fieldLayout = Factory.getFieldLayout(
        field,
        offset,
        true,
        property as string,
      );
      offset += fieldLayout.length;
      layout[property] = fieldLayout;
    }
    const optionalOffset = offset;
    for (let i = 0; i < optional.length; i++) {
      const property = optional[i];
      const field = schema.properties![property];
      layout[property as keyof T] = Factory.getFieldLayout(
        field,
        offset + (i << 2),
        false,
        property as string,
      );
    }
    const defaultData = Factory.getDefaultData(
      layout,
      optionalOffset,
      required as Array<keyof T>,
    );
    const ObjectConstructor = constructor ||
      Factory.getDefaultConstructor(required as Array<keyof T>, layout);
    return class extends this<T> {
      static layout = layout;
      static lengthOffset = optionalOffset + (optional.length << 2);
      static optionalOffset = optionalOffset;
      static fields = required;
      static optionalFields = optional;
      static maxView = Factory.maxView;
      static defaultData = defaultData;
      static ObjectConstructor = ObjectConstructor;
    };
  }
}
