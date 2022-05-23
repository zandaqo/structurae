// deno-lint-ignore-file ban-types
import type {
  UnknownViewConstructor,
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
import type { Constructor } from "./utility-types.ts";

export class View {
  Views = new Map<string, UnknownViewConstructor>([
    ["array", ArrayView],
    ["typedarray", TypedArrayView],
    ["vector", VectorView],
    ["object", ObjectView as unknown as UnknownViewConstructor],
    ["map", MapView as UnknownViewConstructor],
    ["dict", DictView as UnknownViewConstructor],
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
  TaggedViews = new Map<number, UnknownViewConstructor>();
  static AbstractViews = new Set([
    "object",
    "array",
    "typedarray",
    "vector",
    "map",
    "dict",
  ]);

  constructor(public maxView = new DataView(new ArrayBuffer(8192))) {
  }

  create<T>(
    schema: ViewSchema<T>,
    constructor?: T extends object ? Constructor<T> : never,
  ): ViewConstructor<T> {
    const { getSchemaId, getSchemaOrdering } = this
      .constructor as typeof View;
    const schemas = getSchemaOrdering(schema as ViewSchema<unknown>);
    for (let i = schemas.length - 1; i >= 0; i--) {
      const objectSchema = schemas[i];
      const id = getSchemaId(objectSchema);
      if (this.Views.has(id)) continue;
      // use provided constructor for top object
      const objectCtor = objectSchema === schema ? constructor : undefined;
      const View = objectSchema.btype === "map"
        ? this.Views.get("map")!.initialize(objectSchema, this, objectCtor)
        : objectSchema.btype === "dict"
        ? this.Views.get("dict")!.initialize(objectSchema, this)
        : this.Views.get("object")!.initialize(objectSchema, this, objectCtor);
      // cache the view by id
      this.Views.set(id, View);
      // cache by tag if present
      const tag = this.getSchemaTag(objectSchema);
      if (tag) this.TaggedViews.set(tag, View);
    }
    if (schema.type === "array") return this.getArray<T>(schema)[0];
    return this.getExistingView<T>(schema);
  }

  view<T>(view: DataView): ViewInstance<T> | undefined {
    const tag = this.getTag(view);
    const ViewClass = this.TaggedViews.get(tag);
    if (!ViewClass) return undefined;
    return new (ViewClass as ViewConstructor<T>)(view.buffer, view.byteOffset);
  }

  decode<T>(view: DataView): T | undefined {
    const tag = this.getTag(view);
    const ViewClass = this.TaggedViews.get(tag);
    if (!ViewClass) return undefined;
    return (ViewClass as ViewConstructor<T>).decode(view, 0);
  }

  encode<T extends { tag: number }>(
    value: T,
    view?: DataView,
    offset = 0,
  ): ViewInstance<T> | undefined {
    const ViewClass = this.TaggedViews.get(value.tag) as ViewConstructor<T>;
    if (!ViewClass) return undefined;
    if (!view) return ViewClass.from(value);
    ViewClass.encode(value, view, offset);
    return new ViewClass(view.buffer, view.byteOffset);
  }

  getTag(view: DataView): number {
    return view.getUint8(0);
  }

  getSchemaTag(
    schema: ViewSchema<object>,
  ): number | undefined {
    const tag = (schema.properties as { tag: ViewSchema<unknown> })?.tag
      ?.default;
    return typeof tag === "number" ? tag : undefined;
  }

  getArray<T>(
    schema: ViewSchema<T>,
  ): [view: ViewConstructor<T>, length: number] {
    const { getSchemaId } = this.constructor as typeof View;
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
    const itemId = getSchemaId(currentField as ViewSchema<unknown>);
    const isArray = currentArray.btype !== "vector";
    const viewId = isArray ? `ArrayView_${itemId}` : `VectorView_${itemId}`;
    let CurrentView: UnknownViewConstructor;
    if (!this.Views.has(viewId)) {
      CurrentView = isArray
        ? this.getArrayView(
          currentField,
          itemView,
          currentField.maxLength,
        )
        : this.Views.get("vector")!.initialize(
          currentField,
          this,
          itemView,
        );
      // cache array views of unspecified length
      if (currentField.maxLength === undefined) {
        this.Views.set(viewId, CurrentView);
      }
    } else {
      CurrentView = this.Views.get(viewId)!;
    }
    // initialize nested arrays
    let itemLength = isArray ? CurrentView.getLength(currentArray.maxItems) : 0;
    for (let i = arrays.length - 1; i >= 0; i--) {
      currentArray = arrays[i];
      if (currentArray.btype !== "vector") {
        CurrentView = this.getArrayView(
          currentArray.items as ViewSchema<unknown>,
          CurrentView as ViewConstructor<unknown>,
          itemLength,
        );
        itemLength = CurrentView.getLength(currentArray.maxItems);
      } else {
        CurrentView = this.Views.get("vector")!.initialize(
          currentArray.items,
          this,
          CurrentView,
        );
      }
    }
    return [(CurrentView as unknown) as ViewConstructor<T>, itemLength];
  }

  getArrayView<T>(
    schema: ViewSchema<T>,
    SchemaView?: ViewConstructor<T>,
    length?: number,
  ): ViewConstructor<Array<T>> {
    const itemLength = length || SchemaView?.viewLength;
    const isTypedArray = Reflect.has(log2, itemLength!);
    return this.Views.get(isTypedArray ? "typedarray" : "array")!
      .initialize(schema, this, SchemaView, itemLength) as ViewConstructor<
        Array<T>
      >;
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

  getExistingView<T>(schema: ViewSchema<T>): ViewConstructor<T> {
    const { AbstractViews } = this.constructor as typeof View;
    let type = schema.$id || schema.$ref?.slice(1);
    if (type) {
      if (!this.Views.has(type)) throw Error(`View "${type}" is not found.`);
    } else {
      type = schema.btype || schema.type;
      if (!this.Views.has(type)) {
        throw TypeError(`Type "${type}" is not supported.`);
      } else if (AbstractViews.has(type)) {
        throw TypeError(`Type ${type} is abstract.`);
      }
    }
    return this.Views.get(type) as ViewConstructor<T>;
  }

  getFieldLayout<T>(
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
}
