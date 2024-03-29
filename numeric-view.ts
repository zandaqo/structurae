import type { PrimitiveView, ViewConstructor } from "./view-types.ts";

export class Uint8View extends DataView implements PrimitiveView<number> {
  static viewLength = 1;

  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getUint8.call(view, start);
  }

  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setUint8.call(view, start, value);
    return this.viewLength;
  }

  static from(value: number) {
    const typeView = new this(new ArrayBuffer(this.viewLength));
    this.encode(value, typeView, 0);
    return typeView;
  }

  static getLength(): number {
    return this.viewLength;
  }

  get(): number {
    return (this.constructor as typeof Uint8View).decode(this);
  }

  set(value: number): this {
    (this.constructor as typeof Uint8View).encode(value, this);
    return this;
  }

  toJSON(): number {
    return (this.constructor as typeof Uint8View).decode(this);
  }

  static initialize(): ViewConstructor<number, PrimitiveView<number>> {
    return this;
  }
}

export class Int8View extends Uint8View {
  static viewLength = 1;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getInt8.call(view, start);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setInt8.call(view, start, value);
    return this.viewLength;
  }
}

export class Int16View extends Uint8View {
  static viewLength = 2;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getInt16.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setInt16.call(view, start, value, true);
    return this.viewLength;
  }
}

export class Uint16View extends Uint8View {
  static viewLength = 2;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getUint16.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setUint16.call(view, start, value, true);
    return this.viewLength;
  }
}

export class Int32View extends Uint8View {
  static viewLength = 4;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getInt32.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setInt32.call(view, start, value, true);
    return this.viewLength;
  }
}

export class Uint32View extends Uint8View {
  static viewLength = 4;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getUint32.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setUint32.call(view, start, value, true);
    return this.viewLength;
  }
}

export class Float32View extends Uint8View {
  static viewLength = 4;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getFloat32.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setFloat32.call(view, start, value, true);
    return this.viewLength;
  }
}

export class Float64View extends Uint8View {
  static viewLength = 8;
  static decode(view: DataView, start = 0): number {
    return DataView.prototype.getFloat64.call(view, start, true);
  }
  static encode(value: number, view: DataView, start = 0): number {
    DataView.prototype.setFloat64.call(view, start, value, true);
    return this.viewLength;
  }
}

export class BigInt64View extends DataView implements PrimitiveView<bigint> {
  static viewLength = 8;

  static decode(view: DataView, start = 0): bigint {
    return DataView.prototype.getBigInt64.call(view, start, true);
  }

  static encode(value: bigint, view: DataView, start = 0): number {
    DataView.prototype.setBigInt64.call(view, start, value, true);
    return this.viewLength;
  }

  static from(value: bigint) {
    const typeView = new this(new ArrayBuffer(this.viewLength));
    this.encode(value, typeView, 0);
    return typeView;
  }

  static getLength(): number {
    return this.viewLength;
  }

  get(): bigint {
    return (this.constructor as typeof BigInt64View).decode(this);
  }

  set(value: bigint): this {
    (this.constructor as typeof BigInt64View).encode(value, this);
    return this;
  }

  toJSON(): bigint {
    // todo fix bigint is not serializable in JSON
    return (this.constructor as typeof BigInt64View).decode(this);
  }

  static initialize(): ViewConstructor<bigint, PrimitiveView<bigint>> {
    return this;
  }
}

export class BigUint64View extends BigInt64View {
  static viewLength = 8;
  static decode(view: DataView, start = 0): bigint {
    return DataView.prototype.getBigUint64.call(view, start, true);
  }
  static encode(value: bigint, view: DataView, start = 0): number {
    DataView.prototype.setBigUint64.call(view, start, value, true);
    return this.viewLength;
  }
}
