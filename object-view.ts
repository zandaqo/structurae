// deno-lint-ignore-file ban-types
import type { Constructor } from "./utility-types.ts";
import type {
  ComplexView,
  ViewConstructor,
  ViewInstance,
  ViewLayout,
  ViewSchema,
} from "./view-types.ts";
import type { View } from "./view.ts";

export class ObjectView<T extends object> extends DataView
  implements ComplexView<T> {
  static viewLength: number;
  static layout?: ViewLayout<unknown>;
  static fields: Array<unknown>;
  static defaultData?: Uint8Array;
  static ObjectConstructor: Constructor<unknown>;

  static decode<T extends object>(view: DataView, start = 0, _?: number): T {
    const layout = this.layout as ViewLayout<T>;
    const fields = this.fields as Array<keyof T>;
    const result = new this.ObjectConstructor() as T;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const { View, start: fieldStart, length: fieldLength } = layout[name];
      result[name] = View.decode(view, start + fieldStart, fieldLength);
    }
    return result;
  }

  static encode<T extends object>(
    value: T,
    view: DataView,
    start = 0,
    length = this.viewLength,
    amend?: boolean,
  ): number {
    if (!amend) {
      new Uint8Array(view.buffer, view.byteOffset + start, length).fill(0);
    }
    const layout = this.layout as ViewLayout<T>;
    const fields = this.fields as Array<keyof T>;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(value, name)) {
        const { View, start: fieldStart, length: fieldLength } = layout[name];
        View.encode(value[name], view, start + fieldStart, fieldLength);
      }
    }
    return length;
  }

  static from<T extends object, U extends ObjectView<T>>(value: T): U {
    const objectView = new this<T>(this.defaultData!.buffer.slice(0));
    this.encode<T>(value, objectView, 0, this.viewLength, true);
    return objectView as U;
  }

  static getLength(): number {
    return this.viewLength;
  }

  get<P extends keyof T>(field: P): T[P] {
    const layout = (this.constructor as typeof ObjectView)
      .layout as ViewLayout<T>;
    const { start, View, length } = layout[field];
    return View.decode(this, start, length);
  }

  getLength<P extends keyof T>(field: P): number {
    const layout = (this.constructor as typeof ObjectView)
      .layout as ViewLayout<T>;
    return layout[field].length;
  }

  getView<P extends keyof T>(field: P): ViewInstance<T[P]> {
    const layout = (this.constructor as typeof ObjectView)
      .layout as ViewLayout<T>;
    const { View, start, length } = layout[field];
    return new View(this.buffer, this.byteOffset + start, length);
  }

  set<P extends keyof T>(field: P, value: T[P]) {
    const layout = (this.constructor as typeof ObjectView)
      .layout as ViewLayout<T>;
    const { start, View, length } = layout[field];
    View.encode(value, this, start, length);
  }

  setView<P extends keyof T>(field: P, view: DataView) {
    const layout = (this.constructor as typeof ObjectView)
      .layout as ViewLayout<T>;
    const { start } = layout[field];
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength).set(
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
      start,
    );
  }

  toJSON(): T {
    return (this.constructor as typeof ObjectView).decode<T>(this, 0);
  }

  static initialize<T extends object>(
    schema: ViewSchema<T>,
    Factory: View,
    constructor?: Constructor<T>,
  ): ViewConstructor<T, ComplexView<T>> {
    const { getDefaultConstructor, getDefaultData } = Factory
      .constructor as typeof View;
    const fields = Object.keys(schema.properties!) as Array<keyof T>;
    const layout = {} as ViewLayout<T>;
    let lastOffset = 0;
    for (const property of fields) {
      const field = schema.properties![property];
      const fieldLayout = Factory.getFieldLayout(
        field,
        lastOffset,
        true,
        property as string,
      );
      lastOffset += fieldLayout.length;
      layout[property] = fieldLayout;
    }
    const defaultData = getDefaultData(layout, lastOffset, fields);
    const ObjectConstructor = constructor ||
      getDefaultConstructor(fields, layout);
    return class extends this<T> {
      static viewLength = lastOffset;
      static layout = layout;
      static fields = fields;
      static defaultData = defaultData;
      static ObjectConstructor = ObjectConstructor;
    };
  }
}
