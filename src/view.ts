import type {
  ComplexView,
  ContainerView,
  PrimitiveView,
  Schema,
  SchemaObject,
  SchemaType,
  ViewConstructor,
  ViewFieldLayout,
  ViewInstance,
  ViewLayout,
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
import { StringView } from "./string-view.ts";

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
    ["number", Int32View],
    ["uint32", Uint32View],
    ["float32", Float32View],
    ["float64", Float64View],
    ["bigint64", BigInt64View],
    ["biguint64", BigUint64View],
    ["boolean", BooleanView],
    ["string", StringView],
  ]);
  static TaggedViews = new Map<number, UnknownViewConstructor>();
  static tagName = "tag";
  static maxLength = 8192;
  static ObjectClass = ObjectView;
  static ArrayClass = ArrayView;
  static VectorClass = VectorView;
  static MapClass = MapView;

  static _maxView: DataView;

  static get maxView(): DataView {
    if (!this._maxView) {
      this._maxView = new DataView(new ArrayBuffer(this.maxLength));
    }
    return this._maxView;
  }

  static create<T>(schema: Schema): ViewConstructor<T> {
    const schemas = this.getSchemaOrdering(schema);
    for (let i = schemas.length - 1; i >= 0; i--) {
      const objectSchema = schemas[i];
      const id = objectSchema.$id!;
      if (this.Views.has(id)) continue;
      const View: ViewConstructor<SchemaObject> = objectSchema.btype === "map"
        ? this.getMapView(objectSchema)
        : this.getObjectView(objectSchema);
      // cache the view by id
      this.Views.set(id, View);
      // cache by tag if present
      const tag = objectSchema.properties![this.tagName]?.default;
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
      (value as any)[this.tagName] as number,
    ) as ViewConstructor<T>;
    if (!ViewClass) return undefined;
    if (!view) return ViewClass.from(value);
    ViewClass.encode(value, view, 0);
    return new ViewClass(view.buffer, view.byteOffset);
  }

  static getArray<T>(
    schema: Schema,
  ): [view: ViewConstructor<T>, length: number] {
    const arrays = [] as Array<Schema>;
    let currentField = schema;
    // go down the array(s) to the item field
    while (currentField && currentField.type === "array") {
      arrays.push(currentField);
      currentField = currentField.items!;
    }
    let currentArray = arrays.pop()!;
    // get existing view of the item
    const itemView = this.getExistingView(currentField);
    // check
    const itemId = this.getSchemaId(currentField);
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
    return class extends this.ArrayClass<T> {
      static View = View;
      static itemLength = itemLength;
    };
  }

  static getDefaultData<T extends object>(
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

  static getExistingView<T>(schema: Schema): ViewConstructor<T> {
    const id = schema.$id || schema.$ref?.slice(0);
    if (id) {
      if (!this.Views.has(id)) throw Error(`View "${id}" is not found.`);
      return this.Views.get(id) as ViewConstructor<T>;
    }
    const { type, btype } = schema;
    if (btype && this.Views.has(btype)) {
      return this.Views.get(btype) as ViewConstructor<T>;
    }
    if (this.Views.has(type)) return this.Views.get(type) as ViewConstructor<T>;
    throw TypeError(`Type "${type}" is not supported.`);
  }

  static getFieldLayout<T extends SchemaType>(
    field: Schema,
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
    const layout: ViewFieldLayout<T> = { start, View, length };
    if (Reflect.has(field, "default")) {
      layout.default = (field.default as unknown) as T;
    }
    return layout;
  }

  static getMapView<T extends SchemaObject>(
    schema: Schema,
  ): ViewConstructor<T, ComplexView<T>> {
    const required = schema.required || [];
    const optional = Object.keys(schema.properties!).filter(
      (i) => !required.includes(i),
    );
    const layout = {} as ViewLayout<T>;
    let offset = 0;
    for (const property of required) {
      const field = schema.properties![property];
      const fieldLayout = this.getFieldLayout(field, offset, true, property);
      offset += fieldLayout.length;
      //@ts-ignore
      layout[property] = fieldLayout;
    }
    const optionalOffset = offset;
    for (let i = 0; i < optional.length; i++) {
      const property = optional[i];
      const field = schema.properties![property];
      //@ts-ignore
      layout[property as keyof T] = this.getFieldLayout(
        field,
        offset + (i << 2),
        false,
        property,
      );
    }
    const maxView = this.maxView;
    const defaultData = this.getDefaultData(layout, optionalOffset, required);
    return class extends this.MapClass<T> {
      static layout = layout;
      static lengthOffset = optionalOffset + (optional.length << 2);
      static optionalOffset = optionalOffset;
      static fields = required;
      static optionalFields = optional;
      static maxView = maxView;
      static defaultData = defaultData;
    };
  }

  static getObjectView<T extends SchemaObject>(
    schema: Schema,
  ): ViewConstructor<T, ComplexView<T>> {
    const fields = Object.keys(schema.properties!) as Array<keyof T>;
    const layout = {} as ViewLayout<T>;
    let lastOffset = 0;
    for (const property of fields) {
      const field = schema.properties![(property as unknown) as string];
      const fieldLayout = this.getFieldLayout(
        field,
        lastOffset,
        true,
        (property as unknown) as string,
      );
      lastOffset += fieldLayout.length;
      //@ts-ignore
      layout[property] = fieldLayout;
    }
    const defaultData = this.getDefaultData(layout, lastOffset, fields);
    return class extends this.ObjectClass<T> {
      static viewLength = lastOffset;
      static layout = layout;
      static fields = fields;
      static defaultData = defaultData;
    };
  }

  static getSchemaId(schema: Schema): string {
    return schema.$id || schema.$ref?.slice(0) || schema.btype || schema.type;
  }

  static getSchemaOrdering(schema: Schema): Array<Schema> {
    // create graph
    let object = schema;
    // reach the nested object if an array is provided
    while (object.type === "array") object = object.items!;
    // return if no object found
    if (object.type !== "object") return [];
    const mainId = object.$id!;
    let id = mainId;
    const objects = { [id]: object };
    const adjacency = { [id]: [] as Array<string> };
    const indegrees = { [id]: 0 };
    const processing = [id];
    while (processing.length) {
      id = processing.pop()!;
      object = objects[id];
      const properties = Object.keys(object.properties!) as Array<string>;
      for (const property of properties) {
        let field = object.properties![property];
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
    const order = [];
    processing.push(mainId);
    while (processing.length) {
      id = processing.shift()!;
      const children = adjacency[id];
      if (!children) continue; // $ref no external links
      order.push(objects[id]);
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
