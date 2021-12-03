// deno-lint-ignore-file ban-types
import type {
  ComplexView,
  ContainerView,
  PrimitiveView,
  ViewConstructor,
  ViewFieldLayout,
  ViewInstance,
  ViewLayout,
  ViewSchema,
} from "./view-types.ts";
import { BooleanView } from "./boolean-view.ts";
import {
  BigInt64View,
  BigUint64View,
  Float32View,
  Float64View,
  Int16View,
  Int32View,
  Int8View,
  Uint16View,
  Uint32View,
  Uint8View,
} from "./numeric-view.ts";
import { ObjectView } from "./object-view.ts";
import { ArrayView } from "./array-view.ts";
import { VectorView } from "./vector-view.ts";
import { MapView } from "./map-view.ts";
import { DictView } from "./dict-view.ts";
import { StringView } from "./string-view.ts";
import { TypedArrayView } from "./typed-array-view.ts";
import { BinaryView } from "./binary-view.ts";
import { log2 } from "./utilities.ts";
import { Constructor } from "./utility-types.ts";

type UnknownViewConstructor = ViewConstructor<
  unknown,
  PrimitiveView<unknown> | ContainerView<unknown> | ComplexView<unknown>
>;

export class View {
  static Views = new Map<string, UnknownViewConstructor>([
    ["int8", Int8View],
    ["uint8", Uint8View],
    ["int16", Int16View],
    ["uint16", Uint16View],
    ["int32", Int32View],
    ["number", Float64View],
    ["integer", Int32View],
    ["uint32", Uint32View],
    ["float32", Float32View],
    ["float64", Float64View],
    ["bigint64", BigInt64View],
    ["biguint64", BigUint64View],
    ["boolean", BooleanView],
    ["string", StringView],
    ["binary", BinaryView],
  ]);
  static TaggedViews = new Map<number, UnknownViewConstructor>();
  static tagName = "tag";
  static maxLength = 8192;
  static ObjectClass = ObjectView;
  static ArrayClass = ArrayView;
  static TypedArrayClass = TypedArrayView;
  static VectorClass = VectorView;
  static MapClass = MapView;
  static DictClass = DictView;

  static _maxView: DataView;

  static get maxView(): DataView {
    if (!this._maxView) {
      this._maxView = new DataView(new ArrayBuffer(this.maxLength));
    }
    return this._maxView;
  }

  static create<T>(
    schema: ViewSchema<T>,
    constructor?: T extends object ? Constructor<T> : never,
  ): ViewConstructor<T> {
    const schemas = this.getSchemaOrdering(schema as ViewSchema<unknown>);
    for (let i = schemas.length - 1; i >= 0; i--) {
      const objectSchema = schemas[i];
      const id = this.getSchemaId(objectSchema);
      if (this.Views.has(id)) continue;
      // use provided constructor for top object
      const objectCtor = objectSchema === schema ? constructor : undefined;
      const View = objectSchema.btype === "map"
        ? this.getMapView(objectSchema, objectCtor)
        : objectSchema.btype === "dict"
        ? this.getDictView(objectSchema)
        : this.getObjectView(objectSchema, objectCtor);
      // cache the view by id
      this.Views.set(id, View);
      // cache by tag if present
      const tag = objectSchema.properties &&
        (objectSchema.properties as Record<string, ViewSchema<unknown>>)[
          this.tagName
        ]?.default;
      if (typeof tag === "number") {
        this.TaggedViews.set(tag, View);
      }
    }
    if (schema.type === "array") return this.getArray<T>(schema)[0];
    return this.getExistingView<T>(schema);
  }

  static view<T>(view: DataView): ViewInstance<T> | undefined {
    const tag = view.getUint8(0);
    const ViewClass = this.TaggedViews.get(tag) as ViewConstructor<T>;
    if (!ViewClass) return undefined;
    return new ViewClass(view.buffer, view.byteOffset);
  }

  static decode<T>(view: DataView): T | undefined {
    const tag = view.getUint8(0);
    const ViewClass = this.TaggedViews.get(tag) as ViewConstructor<T>;
    if (!ViewClass) return undefined;
    return ViewClass.decode(view, 0);
  }

  static encode<T>(value: T, view?: DataView): ViewInstance<T> | undefined {
    const ViewClass = this.TaggedViews.get(
      // deno-lint-ignore no-explicit-any
      (value as any)[this.tagName] as number,
    ) as ViewConstructor<T>;
    if (!ViewClass) return undefined;
    if (!view) return ViewClass.from(value);
    ViewClass.encode(value, view, 0);
    return new ViewClass(view.buffer, view.byteOffset);
  }

  static getArray<T>(
    schema: ViewSchema<T>,
  ): [view: ViewConstructor<T>, length: number] {
    const arrays: Array<ViewSchema<Array<unknown>>> = [];
    let currentField = schema as ViewSchema<unknown>;
    // go down the array(s) to the item field
    while (currentField && currentField.type === "array") {
      arrays.push(currentField as ViewSchema<Array<unknown>>);
      currentField = currentField.items!;
    }
    let currentArray = arrays.pop()!;
    // get existing view of the item
    const itemView = this.getExistingView(currentField);
    // check
    const itemId = this.getSchemaId(currentField as ViewSchema<unknown>);
    const isArray = currentArray.btype !== "vector";
    const viewId = isArray ? `ArrayView_${itemId}` : `VectorView_${itemId}`;
    let View: UnknownViewConstructor;
    if (!this.Views.has(viewId)) {
      View = isArray
        ? this.getArrayView(itemView, currentField.maxLength)
        : this.getVectorView(itemView, this.maxView);
      // cache array views of unspecified length
      if (currentField.maxLength === undefined) this.Views.set(viewId, View);
    } else {
      View = this.Views.get(viewId)!;
    }
    // initialize nested arrays
    let itemLength = isArray ? View.getLength(currentArray.maxItems) : 0;
    for (let i = arrays.length - 1; i >= 0; i--) {
      currentArray = arrays[i];
      if (currentArray.btype !== "vector") {
        View = this.getArrayView(View as ViewConstructor<unknown>, itemLength);
        itemLength = View.getLength(currentArray.maxItems);
      } else {
        View = this.getVectorView(
          View as ViewConstructor<unknown>,
          this.maxView,
        );
      }
    }
    return [(View as unknown) as ViewConstructor<T>, itemLength];
  }

  static getArrayView<T>(
    View: ViewConstructor<T>,
    maxLength?: number,
  ): ViewConstructor<Array<T>> {
    const itemLength = maxLength || View.viewLength;
    if (itemLength <= 0 || itemLength >= Infinity) {
      throw TypeError("ArrayView should have fixed sized items.");
    }
    const offset = log2[View.viewLength];
    if (offset !== undefined) {
      return class extends this.TypedArrayClass<T> {
        static View = View;
        static offset = offset;
        static itemLength = itemLength;
      };
    }
    return class extends this.ArrayClass<T> {
      static View = View;
      static itemLength = itemLength;
    };
  }

  static getDefaultData<T extends unknown>(
    layout: ViewLayout<T>,
    viewLength: number,
    fields: Array<keyof T>,
  ): Uint8Array {
    const buffer = new ArrayBuffer(viewLength);
    const view = new DataView(buffer);
    const array = new Uint8Array(buffer);
    for (const name of fields) {
      const field = layout[name];
      if (Reflect.has(field, "default")) {
        field.View.encode(field.default!, view, field.start, field.length);
      } else if (field.View.defaultData) {
        array.set(field.View.defaultData, field.start);
      }
    }
    return array;
  }

  static getDefaultConstructor<T>(
    fields: Array<keyof T>,
    layout: ViewLayout<T>,
  ): Constructor<T> {
    const content: Array<string> = [];
    for (const field of fields) {
      const View: ViewConstructor<unknown, unknown> = layout[field].View;
      let value = "";
      switch (View) {
        case Int8View:
        case Int16View:
        case Uint16View:
        case Uint8View:
        case Int32View:
          value = "0";
          break;
        case Float32View:
        case Float64View:
          value = "0.0";
          break;
        case BigInt64View:
        case BigUint64View:
          value = "0n";
          break;
        case BooleanView:
          value = "false";
          break;
        case StringView:
          value = "''";
          break;
        default:
          value = "null";
      }
      content.push(`${field}:${value}`);
    }
    return new Function(
      "return {" + content.join(",") +
        "}",
    ) as Constructor<T>;
  }

  static getExistingView<T>(schema: ViewSchema<T>): ViewConstructor<T> {
    let type = schema.$id || schema.$ref?.slice(1);
    if (type) {
      if (!this.Views.has(type)) throw Error(`View "${type}" is not found.`);
    } else {
      type = schema.btype || schema.type;
      if (!this.Views.has(type)) {
        throw TypeError(`Type "${type}" is not supported.`);
      }
    }
    return this.Views.get(type) as ViewConstructor<T>;
  }

  static getFieldLayout<T>(
    field: ViewSchema<T>,
    start: number,
    required: boolean,
    name: string,
  ): ViewFieldLayout<T> {
    let View: ViewConstructor<T>;
    let length = 0;
    if (field.type !== "array") {
      View = this.getExistingView(field);
      length = field.maxLength || View.viewLength;
    } else {
      [View, length] = this.getArray(field);
    }
    if (!length) length = Infinity;
    if (required && length === Infinity) {
      throw new TypeError(
        `The length of a required field "${name}" is undefined.`,
      );
    }
    const layout: ViewFieldLayout<T> = { start, View, length, required };
    if (Reflect.has(field, "default")) {
      layout.default = (field.default as unknown) as T;
    }
    return layout;
  }

  static getMapView<T extends object>(
    schema: ViewSchema<T>,
    constructor?: Constructor<T>,
  ): ViewConstructor<T, ComplexView<T>> {
    const required: Array<keyof T> = schema.required || [];
    const optional = (Object.keys(schema.properties!) as Array<keyof T>).filter(
      (i) => !required.includes(i),
    );
    const layout = {} as ViewLayout<T>;
    let offset = 0;
    for (const property of required) {
      const field = schema.properties![property];
      const fieldLayout = this.getFieldLayout(
        field,
        offset,
        true,
        property as string,
      );
      offset += fieldLayout.length;
      // @ts-ignore TS2322
      layout[property] = fieldLayout;
    }
    const optionalOffset = offset;
    for (let i = 0; i < optional.length; i++) {
      const property = optional[i];
      const field = schema.properties![property];
      // @ts-ignore TS2322
      layout[property as keyof T] = this.getFieldLayout(
        field,
        offset + (i << 2),
        false,
        property as string,
      );
    }
    const maxView = this.maxView;
    const defaultData = this.getDefaultData(
      layout,
      optionalOffset,
      required as Array<keyof T>,
    );
    const ObjectConstructor = constructor ||
      this.getDefaultConstructor(required as Array<keyof T>, layout);
    return class extends this.MapClass<T> {
      static layout = layout;
      static lengthOffset = optionalOffset + (optional.length << 2);
      static optionalOffset = optionalOffset;
      static fields = required;
      static optionalFields = optional;
      static maxView = maxView;
      static defaultData = defaultData;
      static ObjectConstructor = ObjectConstructor;
    };
  }

  static getObjectView<T extends object>(
    schema: ViewSchema<T>,
    constructor?: Constructor<T>,
  ): ViewConstructor<T, ComplexView<T>> {
    const fields = Object.keys(schema.properties!) as Array<keyof T>;
    const layout = {} as ViewLayout<T>;
    let lastOffset = 0;
    for (const property of fields) {
      const field = schema.properties![property];
      const fieldLayout = this.getFieldLayout(
        field,
        lastOffset,
        true,
        property as string,
      );
      lastOffset += fieldLayout.length;
      // @ts-ignore TS2322
      layout[property] = fieldLayout;
    }
    const defaultData = this.getDefaultData(layout, lastOffset, fields);
    const ObjectConstructor = constructor ||
      this.getDefaultConstructor(fields, layout);
    return class extends this.ObjectClass<T> {
      static viewLength = lastOffset;
      static layout = layout;
      static fields = fields;
      static defaultData = defaultData;
      static ObjectConstructor = ObjectConstructor;
    };
  }

  static getDictView<T extends object>(
    schema: ViewSchema<T>,
  ): ViewConstructor<T, ComplexView<T>> {
    const maxView = this.maxView;
    const KeyView = this.getExistingView(
      schema.propertyNames as ViewSchema<number>,
    );
    const valueSchema = schema.additionalProperties!;
    const ValueView = valueSchema.type === "array"
      ? this.getArray(valueSchema)[0]
      : this.getExistingView(schema.additionalProperties!);
    const KeysView = this.getArrayView(
      KeyView,
      schema.propertyNames?.maxLength,
    ) as typeof ArrayView;
    const ValuesView = this.getVectorView(
      ValueView,
      maxView,
    ) as typeof VectorView;
    return class extends this.DictClass<T> {
      static maxView = maxView;
      static KeysView = KeysView;
      static ValuesView = ValuesView;
    };
  }

  // deno-lint-ignore no-explicit-any
  static getSchemaId(schema: ViewSchema<any>): string {
    return schema.$id || schema.$ref?.slice(1) || schema.btype || schema.type;
  }

  static getSchemaOrdering(
    schema: ViewSchema<unknown>,
  ): Array<ViewSchema<object>> {
    // create graph
    let object = schema;
    // reach the nested object if an array is provided
    while (object.type === "array") object = object.items!;
    // return if no object found
    if (object.type !== "object") return [];
    const mainId = object.$id!;
    let id = mainId;
    const objects = { [id]: object };
    const adjacency: Record<string, Array<string>> = { [id]: [] };
    const indegrees = { [id]: 0 };
    const processing = [id];
    while (processing.length) {
      id = processing.pop()!;
      object = objects[id];
      if (!object.properties) continue;
      const properties = Object.keys(object.properties);
      for (const property of properties) {
        let field =
          (object.properties! as Record<string, ViewSchema<unknown>>)[property];
        if (field.type === "array") {
          while (field.type === "array") field = field.items!;
        }
        const { $id, $ref } = field;
        if ($id) {
          objects[$id] = field;
          adjacency[id].push($id);
          adjacency[$id] = [];
          indegrees[$id] = indegrees[$id] ? indegrees[$id] + 1 : 1;
          processing.push($id);
        } else if ($ref) {
          const refId = $ref.slice(1);
          indegrees[refId] = indegrees[refId] ? indegrees[refId] + 1 : 1;
          adjacency[id].push(refId);
        }
      }
    }

    // topologically sort the graph
    let visited = 0;
    const order: Array<ViewSchema<object>> = [];
    processing.push(mainId);
    while (processing.length) {
      id = processing.shift()!;
      const children = adjacency[id];
      if (!children) continue; // $ref no external links
      order.push(objects[id] as ViewSchema<object>);
      for (const child of children) {
        indegrees[child] -= 1;
        if (indegrees[child] === 0) processing.push(child);
      }
      visited++;
    }
    // check for recursive links
    if (visited !== Object.keys(objects).length) {
      throw TypeError("The schema has recursive references.");
    }
    return order;
  }

  static getVectorView<T>(
    View: ViewConstructor<T>,
    maxView: DataView,
  ): ViewConstructor<Array<T | undefined>> {
    return class extends this.VectorClass<T> {
      static View = View;
      static maxView = maxView;
    };
  }
}
