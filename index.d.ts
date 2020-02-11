// Type definitions for structurae
// Project: structurae
// Definitions by: Maga D. Zandaqo <denelxan@gmail.com> (http://maga.name)

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array |
    Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor | Int16Array | Uint16ArrayConstructor | Int32ArrayConstructor
    | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

type Collection = any[] | TypedArray;

type CollectionConstructor = ArrayConstructor | TypedArrayConstructor;

interface Constructor<T> {
    new (...args): T;
}

interface GridOptions {
    rows: number;
    columns: number;
    pad?: any;
}

interface Coordinates {
    row: number;
    column: number;
}

declare class Grid {
    columns: number;
    rows: number;
    offset: number;
    pad: any;
    lastCoordinates: Coordinates;

    constructor(options?: GridOptions, ...args: any);
    get(row: number, column: number): any;
    set(row: number|ArrayLike<number>, column?: number, value?: any): this;
    setArray(array: Collection, offset: number): void;
    getCoordinates(index: number): Coordinates;
    toArrays(withPadding?: boolean): any[][];
    static getOffset(columns: number): number;
    static getLength(rows: number, columns: number): number;
    static fromArrays(arrays: any[][], pad: any): Grid;
}

export declare function GridMixin<T extends Collection>(Base?: Constructor<T>): Constructor<T & Grid>

interface BitPosition {
    bucket: number;
    position: number;
}

type Bit = 0 | 1;

interface BinaryGridOptions {
    rows: number;
    columns: number;
}

export declare class BinaryGrid extends Uint16Array {
    offset: number;
    columns: number;
    rows: number;
    lastPosition: BitPosition;

    constructor(options: BinaryGridOptions, ...args: any);
    get(row: number, column: number): Bit;
    set(row: number|ArrayLike<number>, column?: number, value?: Bit): this;
    private getBitPosition(row: number, column: number): BitPosition;
    static getLength(rows: number, columns: number): number;
    static getOffset(columns: number): number;
}

declare class SymmetricGrid {
    rows: number;
    columns: number;
    pad: any;
    lastCoordinates: Coordinates;

    constructor(options?: GridOptions, ...args: any);
    get(row: number, column: number): any;
    set(row: number|ArrayLike<number>, column?: number, value?: any): this;
    setArray(array: Collection, offset: number): void;
    getCoordinates(index: number): Coordinates;
    toArrays(withPadding?: boolean): any[][];
    static getLength(rows: number, columns: number): number;
    static fromArrays(arrays: any[][], pad: any): SymmetricGrid;
}

export declare function SymmetricGridMixin<T extends Collection>(Base?: Constructor<T>): Constructor<T & SymmetricGrid>

type GridStructure = Grid | BinaryGrid | SymmetricGrid;


type Matcher = [number, number];

interface NumberMap {
    [propName: string]: number;
}

export declare class BitField {
    value: number;
    static schema: NumberMap;
    static size: number;
    static isInitialized: boolean;
    private static fields: string[];
    private static masks: NumberMap;
    private static offsets: NumberMap;
    private static mask: number;

    constructor(data?: number|BitField|number[]|NumberMap);
    get(field: string): number;
    set(field: string, value: number);
    has(...fields: string[]): boolean;
    match(matcher: Matcher|NumberMap): boolean;
    toJSON(): number;
    toObject(): NumberMap;
    toString(): string;
    valueOf(): number;
    static initialize(): void;
    static encode(data: number[]|NumberMap): number;
    static decode(data: number): NumberMap;
    static isValid(data: NumberMap): boolean;
    static getMinSize(number: number): number;
    static getMatcher(matcher: NumberMap): Matcher;
    static match(value: number, matcher: Matcher): boolean;
}

type BigIntMatcher = [number, number];

interface BigIntMap {
    [propName: string]: bigint;
}

export declare class BigBitField {
    value: bigint;
    static schema: BigIntMap;
    static size: bigint;
    static isInitialized: boolean;
    private static fields: string[];
    private static masks: BigIntMap;
    private static offsets: BigIntMap;
    private static mask: bigint;

    constructor(data?: bigint|BigBitField|number[]|NumberMap);
    get(field: string): number;
    set(field: string, value: number);
    has(...fields: string[]): boolean;
    match(matcher: BigIntMatcher|NumberMap): boolean;
    toJSON(): bigint;
    toObject(): NumberMap;
    toString(): string;
    valueOf(): bigint;
    static initialize(): void;
    static encode(data: number[]|NumberMap): number;
    static decode(data: number): NumberMap;
    static isValid(data: NumberMap): boolean;
    static getMinSize(number: number): number;
    static getMatcher(matcher: NumberMap): BigIntMatcher;
    static match(value: bigint, matcher: BigIntMatcher): boolean;
}

export declare function BitFieldMixin(schema: string[]|NumberMap, BitFieldClass?: typeof BitField | typeof BigBitField): typeof BitField | typeof BitFieldClass;

type CompareResult = 1 | -1 | 0;

interface Comparator {
    (a: any, b: any): CompareResult
}

declare class SortedCollection {
    isSorted(): boolean;
    isUnique(): boolean;
    range(start: number, end: number, subarray?: boolean): SortedCollection;
    rank(element: any): number;
    static compare(a: any, b: any): CompareResult;
    static getDifference<T extends Collection>(a: Collection, b: Collection, symmetric?: boolean, comparator?: Comparator, container?: T): T;
    static getDifferenceScore(a: Collection, b: Collection, symmetric?: boolean, comparator?: Comparator): number;
    static getIndex(arr: Collection, target: any, comparator?: Comparator, rank?: boolean, start?: number, end?: number): number;
    static getIntersection<T extends Collection>(a: Collection, b: Collection, comparator?: Comparator, container?: T): T;
    static getIntersectionScore(a: Collection, b: Collection, comparator?: Comparator): number;
    static getRange<T extends Collection>(arr: T, start?: number, end?: number, comparator?: Comparator, subarray?: boolean): T;
    static getUnion<T extends Collection>(a: Collection, b: Collection, unique?: boolean, comparator?: Comparator, container?: T): T;
    static getUnique<T extends Collection>(arr: Collection, comparator?: Comparator, container?: T): T;
    static isSorted(arr: Collection, comparator?: Comparator): boolean;
    static isUnique(arr: Collection, comparator?: Comparator): boolean;
}

export declare function SortedMixin<T extends Collection>(Base?: Constructor<T>): Constructor<T & SortedCollection>

export class SortedArray extends SortedMixin(Array) {
    unique: boolean;
    set(arr: Collection): this;
    uniquify(): this;
}

type ViewType = typeof ArrayView | typeof ObjectView | typeof TypedArrayView | typeof StringView;

type View = ObjectView | ArrayView | TypedArrayView | StringView;

export declare class ArrayView extends DataView {
    size: number;
    static itemLength: number;
    static View: typeof ObjectView | typeof StringView;

    get(index: number): ObjectView;
    getValue(index: number): object;
    set(index: number, value: object): this;
    setView(index: number, value: ObjectView): this;
    toJSON(): object[];
    [Symbol.iterator](): IterableIterator<ObjectView>;
    static from(value: ArrayLike<object>, array?: ArrayView): ArrayView;
    static of(size: number): ArrayView;
    static getLength(size: number): number;
}

export declare function ArrayViewMixin(ObjectViewClass: typeof ObjectView | typeof StringView,
                                       itemLength?: number): typeof ArrayView;

type PrimitiveFieldType = 'int8' | 'uint8' | 'int16' | 'uint16'
    | 'int32' | 'uint32' | 'float32' | 'float64' | 'bigint64' | 'biguint64';

type ObjectViewFieldType = PrimitiveFieldType| string | ViewType;

interface ObjectViewField {
    type: ObjectViewFieldType;
    size?: number;
    littleEndian?: boolean;
    start?: number;
    length?: number;
    View?: ViewType;
    getter?: string;
    setter?: string;
    itemLength?: number;
    default?: any;
}

interface ObjectViewSchema {
    [propName: string]: ObjectViewField;
}

interface ObjectViewTypeDefs {
    [propName: string]: (field: ObjectViewField) => void;
}

export declare class ObjectView extends DataView {
    static types: ObjectViewTypeDefs;
    static schema: ObjectViewSchema;
    static isInitialized: boolean;
    private static fields: string[];
    private static objectLength: number;
    private static defaultBuffer: ArrayBuffer;

    get(field: string): number | View;
    private getObject(position: number, field: ObjectViewField): object;
    private getTypedArray(position: number, field: ObjectViewField): ArrayLike<number>;
    getValue(field: string): any;
    getView(field: string): View;
    set(field: string, value: any): this;
    private setObject(position: number, value: object, field: ObjectViewField): void;
    private setTypedArray(position: number, value: ArrayLike<number>, field: ObjectViewField): void;
    setView(field: string, value: View): this;
    toJSON(): object;
    static from(object: object, objectView?: ObjectView): ObjectView;
    static getLength(): number;
    static initialize(): void;
    private static getFieldKind(field: ObjectViewField): string;
}

export declare function ObjectViewMixin(schema: ObjectViewSchema, ObjectViewClass?: typeof ObjectView): typeof ObjectView;

export declare class StringView extends Uint8Array {
    size: number;
    static masks: Int8Array;
    static encoder: TextEncoder;
    static decoder: TextDecoder;

    characters(): Iterable<string>;
    charAt(index?: number): string;
    private getCharEnd(index: number): number;
    private getCharStart(index: number, startCharIndex?: number, startIndex?: number): number;
    replace(pattern: Collection, replacement: Collection): this;
    reverse(): this;
    search(searchValue: Collection, fromIndex?: number): number;
    private searchNaive(searchValue: Collection, fromIndex?: number): number;
    private searchShiftOr(searchValue: Collection, fromIndex?: number): number;
    substring(indexStart: number, indexEnd?: number): string;
    private toChar(index: number): string;
    toString(): string;
    toJSON(): string;
    trim(): StringView;
    static from(arrayLike: ArrayLike<number>|string, mapFn?: Function | StringView): StringView;
    static getByteSize(string: string): number;
}

declare class TypedArrayView extends DataView {
    size: number;
    static typeGetter: string;
    static typeSetter: string;
    static offset: number;
    static littleEndian: boolean;

    get(index: number): number;
    set(index: number, value: number): this;
    toJSON(): Array<number>;
    [Symbol.iterator](): IterableIterator<number>;
    static getLength(size: number): number;
    static from(value: ArrayLike<number>, array?: TypedArrayView): TypedArrayView;
    static of(size: number): TypedArrayView;
}

export declare function TypedArrayViewMixin(type: PrimitiveFieldType, littleEndian: boolean): typeof TypedArrayView;

export declare class CollectionView extends DataView {
    static schema: ViewType[];

    get(index: number): View;
    set(index: number, value: object): this;
    toJSON(): object[];
    [Symbol.iterator](): IterableIterator<View>;
    static from(value: object[], array?: CollectionView): CollectionView;
    static getLength(sizes: number[]): number;
    static of(sizes: number[]): CollectionView;
}

interface BinaryProtocolSchema {
    [propName: number]: object|typeof ObjectView;
}

export declare class BinaryProtocol {
    Views: BinaryProtocolSchema;
    private tagName: string;
    private tagType: PrimitiveFieldType;

    constructor(views: BinaryProtocolSchema, tagName?: string, tagType?: string);
    view(buffer: ArrayBuffer, offset?: number): ObjectView;
    encode(object: object, arrayBuffer?: ArrayBuffer, offset?: number): ObjectView;
    decode(buffer: ArrayBuffer, offset?: number): object;
}

export declare class BitArray extends Uint32Array {
    size: number;
    private lastPosition: BitPosition;

    constructor(size: number|ArrayLike<number>|ArrayBuffer, ...args: any);
    getBit(index: number): Bit;
    setBit(index: number, value: Bit): this;
    protected getBitPosition(index: number): void;
    static getLength(size: number): number;
}

export declare class Pool extends BitArray {
    get(): number;
    free(index: number): void;
    static getLength(size: number): number;
}

export declare class RankedBitArray extends BitArray {
    setBit(index: number, value: Bit): this;
    rank(index: number): number;
    select(index: number): number;
    static getLength(size: number): number;
}

export declare class BinaryHeap extends Array {
    heapify(): this;
    isHeap(): boolean;
    left(index: number): any;
    parent(index: number): any;
    replace(item: any): any;
    right(index: number): any;
    update(index: number): void;
    private has(index: number): boolean;
    private siftDown(start: number): void;
    private siftUp(start: number): void;
    static compare(a: any, b: any): boolean;
    private static getLeftIndex(index: number): number;
    private static getParentIndex(index: number): number;
    private static getRightIndex(index: number): number;
    static isHeap(heap: Collection): boolean;
}

interface AdjacencyListOptions {
    vertices: number;
    edges: number;
}

export declare class UnweightedAdjacencyList extends Uint32Array {
    vertices: number;
    edges: number;
    static undirected: boolean;
    static weighted: false;

    constructor(options?: AdjacencyListOptions, ...args: any);
    addEdge(x: number, y: number): this;
    removeEdge(x: number, y: number): this;
    hasEdge(x: number, y: number): boolean;
    getEdge(x: number, y: number): Bit;
    private setEdge(x: number, y: number): this;
    private unsetEdge(x: number, y: number): this;
    outEdges(x: number): IterableIterator<number>;
    inEdges(x: number): IterableIterator<number>;
    private setOffsets(): void;
    isFull(): boolean;
    grow(vertices?: number, edges?: number): UnweightedAdjacencyList;
    static getLength(vertices: number, edges: number): number;
    static getVertexCount(array: Collection): number;
    static fromGrid(grid: Grid): UnweightedAdjacencyList;
}

declare class WeightedAdjacencyList {
    vertices: number;
    edges: number;
    static undirected: boolean;
    static weighted: true;

    constructor(options?: AdjacencyListOptions, ...args: any);
    addEdge(x: number, y: number, weight: number): this;
    removeEdge(x: number, y: number): this;
    hasEdge(x: number, y: number): boolean;
    getEdge(x: number, y: number): number;
    private setEdge(x: number, y: number, weight: number): this;
    private unsetEdge(x: number, y: number): this;
    outEdges(x: number): IterableIterator<number>;
    inEdges(x: number): IterableIterator<number>;
    private setOffsets(): void;
    isFull(): boolean;
    grow(vertices?: number, edges?: number): UnweightedAdjacencyList;
    static getLength(vertices: number, edges: number): number;
    static getVertexCount(array: Collection): number;
    static fromGrid(grid: Grid): WeightedAdjacencyList;
}

export declare function WeightedAdjacencyListMixin<T extends Collection>(Base?: Constructor<T>): Constructor<T & WeightedAdjacencyList>

interface UnweightedMatrixOptions {
    vertices: number;
}

export declare class UnweightedAdjacencyMatrix extends BinaryGrid {
    vertices: number;
    static undirected: boolean;
    static weighted: false;

    constructor(options?: UnweightedMatrixOptions, ...args: any);
    addEdge(x: number, y: number): this;
    removeEdge(x: number, y: number): this;
    hasEdge(x: number, y: number): boolean;
    getEdge(x: number, y: number): number;
    outEdges(x: number): IterableIterator<number>;
    inEdges(x: number): IterableIterator<number>;
    static getLength(size: number): number;
    static fromList(list: UnweightedAdjacencyList): UnweightedAdjacencyMatrix;
}



interface WeightedMatrixOptions {
    vertices: number;
    pad?: any;
}

declare class WeightedAdjacencyMatrix {
    vertices: number;
    static undirected: boolean;
    static weighted: true;

    constructor(options?: WeightedMatrixOptions, ...args: any);
    addEdge(x: number, y: number): this;
    removeEdge(x: number, y: number): this;
    hasEdge(x: number, y: number): boolean;
    getEdge(x: number, y: number): number;
    outEdges(x: number): IterableIterator<number>;
    inEdges(x: number): IterableIterator<number>;
    static getLength(size: number): number;
    static fromList(list: WeightedAdjacencyList, pad: number): WeightedAdjacencyMatrix;
}

export declare function WeightedAdjacencyMatrixMixin<T extends GridStructure>(Base: CollectionConstructor, undirected?: boolean): Constructor<T & WeightedAdjacencyMatrix>

type AdjacencyStructure = UnweightedAdjacencyList | UnweightedAdjacencyMatrix
    | WeightedAdjacencyList | WeightedAdjacencyMatrix;

interface GraphOptions {
    vertices: number;
    edges?: number;
    pad?: number;
}

declare class Graph {
    colors: BinaryGrid;

    constructor(options: GraphOptions, ...args: any);
    isGray(x: number): boolean;
    setGray(x: number): this;
    isBlack(x: number): boolean;
    setBlack(x: number): this;
    traverse(isDFS?: boolean, start?: number, gray?: boolean, white?: boolean, black?: boolean): IterableIterator<number>;
    path(start: number, end: number, isAcyclic?: boolean, isPositive?: boolean): number[];
    tree(start?: number): number[];
    isAcyclic(): boolean;
    topologicalSort(): number[];
    private searchUnweighted(start: number, end: number, predecessors: number[]): boolean;
    private searchTopological(start: number, end: number, distances: number[], predecessors: number[]): boolean;
    private searchDijkstra(start: number, end: number, distances: number[], predecessors: number[]): boolean;
    private searchBellmanFord(start: number, end: number, distances: number[], predecessors: number[]): boolean;
}

export declare function GraphMixin<T extends AdjacencyStructure>(Base: Constructor<T>, undirected?: boolean): Constructor<T & Graph>