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

type PrimitiveFieldType = 'int8' | 'uint8' | 'int16' | 'uint16'
    | 'int32' | 'uint32' | 'float32' | 'float64' | 'bigint64' | 'biguint64';

type ViewType = typeof ArrayView | typeof ObjectView | typeof StringView | typeof TypeView;

type View = ObjectView | ArrayView | StringView | TypeView;

export declare class TypeView extends DataView {
    static offset: number;
    static littleEndian: true;
    static objectLength: number;
    static Views: Map<string, typeof TypeView>;
    static ArrayClass: typeof ArrayView;

    get(): number;
    set(value: number): this;
    toJSON(): number;
    static getLength(): number;
    static from(value: any, view?: View, start?: number): View;
    static toJSON(view: View, start?: number): any;
    static of(): TypeView;
}

export declare class BooleanView extends TypeView {
    static from(value: number|boolean, view?: View, start?: number): View;
    static toJSON(view: View, start?: number): boolean;
}

export declare function TypeViewMixin(type: PrimitiveFieldType, littleEndian?: boolean,
                                      TypeViewClass?: typeof TypeView): typeof TypeView;

export declare class ArrayView extends DataView {
    size: number;
    static itemLength: number;
    static View: ViewType;
    static ArrayClass: typeof ArrayView;

    get(index: number): any;
    getView(index: number): View;
    set(index: number, value: any): this;
    setView(index: number, value: View): this;
    toJSON(): any[];
    [Symbol.iterator](): IterableIterator<View | number>;
    static from(value: ArrayLike<any>, array?: View, start?: number, length?: number): View;
    static toJSON(view: View, start: number, length: number): any[];
    static of(size?: number): ArrayView;
    static getLength(size: number): number;
    static getSize(length: number): number;
}

export declare class TypedArrayView extends ArrayView {
    static View: typeof TypeView;

    get(index: number): number;
    set(index: number, value: number): this;
    toJSON(): Array<number>;
    [Symbol.iterator](): IterableIterator<number>;
    static from(value: ArrayLike<number>, array?: View, start?: number, length?: number): View;
    static toJSON(view: View, start: number, length: number): number[];
    static of(size?: number): TypedArrayView;
}

export declare function ArrayViewMixin(ObjectViewClass: ViewType | PrimitiveFieldType,
                                       itemLength?: number | boolean): typeof ArrayView;

interface ViewLayoutField {
    View: ViewType;
    start?: number;
    length?: number;
    default?: any;
}

interface ViewLayout {
    [propName: string]: ViewLayoutField;
}

interface ViewTypes {
    [propName: string]: ViewType;
}

interface ObjectViewTypeDefs {
    [propName: string]: (field: ViewLayoutField) => void;
}

export declare class ObjectView extends DataView {
    static schema: object;
    static layout: ViewLayout;
    static fields: string[];
    static Views: ViewTypes;
    static ArrayClass: typeof ArrayView;
    static types: ObjectViewTypeDefs;
    static objectLength: number;
    private static defaultBuffer: ArrayBuffer;

    get(field: string): any;
    getView(field: string): View;
    set(field: string, value: any): this;
    setView(field: string, value: View): this;
    toJSON(): object;
    static from(object: object, view?: View, start?: number, length?: number): View;
    static toJSON(view: View, start?: number): object;
    static getLength(): number;
    static initialize(): void;
    private static setDefaultBuffer(): void;
    static getSchemaOrdering(schema: object): object[];
    static getLayoutFromSchema(schema: object): [ViewLayout, number, string[]];
    static getViewFromSchema(schema: object): ViewType;
}

export declare function ObjectViewMixin(schema: object, ObjectViewClass?: typeof ObjectView): typeof ObjectView;

export declare class StringView extends Uint8Array {
    size: number;
    static masks: Int8Array;
    static encoder: TextEncoder;
    static decoder: TextDecoder;
    static ArrayClass: typeof ArrayView;

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
    static from(arrayLike: ArrayLike<number>|string, mapFn?: Function | View, thisArg?: any, length?: number): View;
    static toJSON(view: View, start?: number, length?: number): string;
    static getByteSize(string: string): number;
}

export declare class MapView extends DataView {
    static schema: object;
    static layout: ViewLayout;
    static fields: string[];
    static ObjectViewClass: typeof ObjectView;
    static Views: ViewTypes;

    get(field: string): any;
    getView(field: string): View;
    private getLayout(field: string): [ViewType, number, number];
    set(field: string, value: any): this;
    setView(field: string, value: View): this;
    toJSON(): object;
    static from(value: object): MapView;
    static toJSON(view: View, start?: number): object;
    static getLength(value: any, getOffsets?: boolean): number | [number, number[]];
    static initialize(): void;
}

export declare function MapViewMixin(schema: object, MapViewClass?: typeof MapView, ObjectViewClass?: typeof ObjectView): typeof MapView;

interface BinaryProtocolSchema {
    [propName: number]: typeof ObjectView;
}

export declare class BinaryProtocol {
    Views: BinaryProtocolSchema;
    private tagName: string;
    private tagType: PrimitiveFieldType;

    constructor(views: object, tagName?: string, tagType?: string);
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