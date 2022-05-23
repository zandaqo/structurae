# Structurae

[![Actions Status](https://github.com/zandaqo/structurae/workflows/ci/badge.svg)](https://github.com/zandaqo/structurae/actions)
[![npm](https://img.shields.io/npm/v/structurae.svg?style=flat-square)](https://www.npmjs.com/package/structurae)

A collection of data structures for high-performance JavaScript applications
that includes:

- **[Binary Protocol](#binary-protocol)** - simple binary protocol based on
  DataView and defined with JSONSchema
- **[Bit Structures](#bit-structures)**:
  - [BitField & BigBitField](#bitfield--bigbitfield) - stores and operates on
    data in Numbers and BigInts treating them as bitfields.
  - [BitArray](#bitArray) - an array of bits implemented with Uint32Array.
  - [Pool](#pool) - manages availability of objects in object pools.
  - [RankedBitArray](#rankedbitarray) - extends BitArray with O(1) time rank and
    O(logN) select methods.
- **[Graphs](#graphs)**:
  - [Adjacency Structures](#adjacency-structures) - implement adjacency list &
    matrix data structures.
  - [Graph](#graph) - extends an adjacency list/matrix structure and provides
    methods for traversal (BFS, DFS), pathfinding (Dijkstra, Bellman-Ford),
    spanning tree construction (BFS, Prim), etc.
- **[Grids](#grids)**:
  - [BinaryGrid](#binarygrid) - creates a grid or 2D matrix of bits.
  - [Grid](#grid) - extends built-in indexed collections to handle 2 dimensional
    data (e.g. nested arrays).
  - [SymmetricGrid](#symmetricgrid) - a grid to handle symmetric or triangular
    matrices using half the space required for a normal grid.
- **[Sorted Structures](#sorted-structures)**:
  - [BinaryHeap](#binaryheap) - extends Array to implement the Binary Heap data
    structure.
  - [SortedArray](#sortedarray) - extends Array to handle sorted data.

## Usage

Node.js:

```
npm i structurae
```

```
import {...} from "structurae";
```

Deno:

```
import {...} from "https://deno.land/x/structurae@4.0.0/index.ts"
```

## Documentation

- Articles:
  - [Structurae: Data Structures for Heigh-Performance
    JavaScript](https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8)
  - [Structurae 1.0: Graphs, Strings, and
    WebAssembly](https://medium.com/@zandaqo/structurae-1-0-graphs-strings-and-webassembly-25dd964d5a70)
  - [Binary Protocol for JavaScript](https://itnext.io/binary-protocol-for-javascript-cc409e144a3c)

## Overview

### Binary Protocol

Binary data in JavaScript is represented by ArrayBuffer and accessed through
TypedArrays and DataView. However, both of those interfaces are limited to
working with numbers. Structurae offers a set of classes that extend the
DataView interface to support using ArrayBuffers for strings, objects, and
arrays. These classes ("views") form the basis for a simple binary protocol with
the following features:

- smaller and faster than schema-less binary formats (e.g. BSON, MessagePack);
- supports zero-copy operations, e.g. reading and changing object fields without
  decoding the whole object;
- supports static typing through TypeScript;
- uses JSON Schema for schema definitions;
- does not require compilation unlike most other schema-based formats (e.g.
  FlatBuffers).

The protocol is operated through the `View` class that handles creation and
caching of necessary structures for a given JSON Schema as well as simplifying
serialization of tagged objects.

```typescript
import { View } from "structurae";

// instantiate a view protocol
const view = new View();

// define interface for out animal objects
interface Animal {
  name: string;
  age: number;
}
// create and return a view class (extension of DataView) that handles our Animal objects
const AnimalView = view.create<Animal>({
  $id: "Pet",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 10 },
    // by default, type `number` is treated as int32, but can be further specified usin `btype`
    age: { type: "number", btype: "uint8" },
  },
});
// encode our animal object
const animal = AnimalView.from({ name: "Gaspode", age: 10 });
animal instanceof DataView; //=> true
animal.byteLength; //=> 14
animal.get("age"); //=> 10
animal.set("age", 20);
animal.toJSON(); //=> { name: "Gaspode", age: 20 }
```

#### Objects and Maps

Objects by default are treated as C-like structs, the data is laid out
sequentially with fixed sizes, all standard JavaScript values are supported,
inluding other objects and arrays of fixed size:

```typescript
interface Friend {
  name: string;
}
interface Person {
  name: string;
  fullName: Array<string>;
  bestFriend: Friend;
  friends: Array<Friend>;
}
const PersonView = view.create<Person>({
  // each object requires a unique id
  $id: "Person",
  type: "object",
  properties: {
    // the size of a string field is required and defined by maxLength
    name: { type: "string", maxLength: 10 },
    fullName: {
      type: "array",
      // the size of an array is required and defined by maxItems
      maxItems: 2,
      // all items have to be the same type
      items: { type: "string", maxLength: 20 },
    },
    // objects can be referenced with $ref using their $id
    bestFriend: { $ref: "#Friend" },
    friends: {
      type: "array",
      maxItems: 3,
      items: {
        $id: "Friend",
        type: "object",
        properties: {
          name: { type: "string", maxLength: 20 },
        },
      },
    },
  },
});
const person = Person.from({
  name: "Carrot",
  fullName: ["Carrot", "Ironfoundersson"],
  bestFriend: { name: "Sam Vimes" },
  friends: [{ name: "Sam Vimes" }],
});
person.get("name"); //=> Carrot
person.getView("name"); //=> StringView [10]
person.get("fullName"); //=> ["Carrot", "Ironfoundersson"]
person.toJSON();
//=> {
//     name: "Carrot",
//     fullName: ["Carrot", "Ironfoundersson"],
//     bestFriend: { name: "Sam Vimes" },
//     friends: [{ name: "Sam Vimes" }]
//    }
```

Objects that support optional fields and fields of variable size ("maps") should
additionally specify `btype` `map` and list non-optional (fixed sized) fields as
`required`:

```typescript
interface Town {
  name: string;
  railstation: boolean;
  clacks?: number;
}
const TownView = view.create<Town>({
    $id: "Town",
    type: "object",
    btype: "map",
    properties: {
      // notice that maxLength is not required for optional fields in maps
      // however, if set, map with truncate longer strings to fit the maxLength
      name: { type: "string" },
      railstation: { type: "boolean" },
      // optional, nullable field
      clacks: { type: "integer" },
    }
    required: ["railstation"],
  });
const lancre = TownView.from({ name: "Lancre", railstation: false });
lancre.get("name") //=> Lancre
lancre.get("clacks") //=> undefined
lancre.byteLength //=> 19
const stoLat = TownView.from({ name: "Sto Lat", railstation: true, clacks: 1 });
stoLat.get("clacks") //=> 1
stoLat.byteLength //=> 24
```

The size and layout of each map instance is calculated upon creation and stored
within the instance (unlike fixed sized objects, where each instance have the
same size and layout). Maps are useful for densely packing objects and arrays
whose size my vary greatly. There is a limitation, though, since ArrayBuffers
cannot be resized, optional fields that were absent upon creation of a map view
cannot be set later, and those set cannot be resized, that is, assigned a value
that is greater than their current size.

For performance sake, all variable size views are encoded using single global
ArrayBuffer that is 8192 bytes long, if you expect to handle bigger views,
supply a bigger DataView when instantiating a view protocol:

```ts
import { View } from "structurae";

// instantiate a view protocol
const view = new View(new DataView(new ArrayBuffer(65536)));
```

There are certain requirements for a JSON Schema used for fixed sized objects:

- Each object should have a unique id defined with `$id` field. Upon
  initialization, the view class is stored in `View.Views` and accessed with the
  id used as the key. References made with `$ref` are also resolved against the
  id.
- For fixed sized objects, sizes of strings and arrays should be defined using
  `maxLength` and `maxItems` properties respectfully.
- `$ref` can be used to reference objects by their `$id`. The referenced object
  should be defined either in the same schema or in a schema initialized
  previously.
- Type `number` by default resolves to `float64` and type `integer` to `int32`,
  you can use any other type by specifying it in `btype` property.

Objects and maps support setting default values of required fields. Default
values are applied upon creation of a view:

```typescript
interface House {
  size: number;
}
const House = view.create<House>({
  $id: "House",
  type: "object",
  properties: {
    size: { type: "integer", btype: "uint32", default: 100 },
  },
});
const house = House.from({} as House);
house.get("size"); //=> 100
```

Default values of an object can be overridden when it is nested inside another
object:

```typescript
interface Neighborhood {
  house: House;
  biggerHouse: House;
}
const Neighborhood = view.create<Neighborhood>({
  $id: "Neighborhood",
  type: "object",
  properties: {
    house: { $ref: "#House" },
    biggerHouse: { $ref: "#House", default: { size: 200 } },
  },
});
const neighborhood = Neighborhood.from({} as Neighborhood);
neighborhood.get("house"); //=> { size: 100 }
neighborhood.get("biggerHouse"); //=> { size: 200 }
```

#### Dictionaries

Objects and maps described above assume that all properties of encoded objects
are known and defined beforehand, however, if the properties are not known, and
we are dealing with an object used as a lookup table (also called map, hash map,
or records in TypeScript) with varying amount of properties and known type of
values, we can use a dictionary view:

```typescript
const NumberDict = view.create<Record<number, string | undefined>>({
  $id: "NumberDict",
  type: "object",
  btype: "dict", // dictionaries use btype dict
  // the type of keys are defined in the `propertyNames` field of a schema
  // the keys must be either fixed sized strings or numbers
  propertyNames: { type: "number", btype: "uint8" },
  // the type of values defined in `addtionalProperties` field
  // values can be of any supported type
  additionalProperties: { type: "string" },
});
const dict = NumberDict.from({ 1: "a", 2: "bcd", 3: undefined });
dict.get(1); //=> "a"
dict.get(3); //=> undefined
dict.get(10); //=> undefined
dict.get(2); //=> "bcd"
```

#### Arrays and Vectors

The protocol supports arrays of non-nullable fixed sized values (numbers,
strings of fixed maximum size, objects) and vectors--arrays with nullable or
variable sized values. The type of items held by both "container" views is
defined in `items` field of the schema.

```typescript
const Street = view.create<Array<House>>({
  type: "array",
  items: {
    type: "object",
    // we can also reference previously created class with $ref
    $ref: "#House",
  },
});
const street = Street.from([{ size: 10 }, { size: 20 }]);
street.byteLength; //=> 8
street.get(0); //=> { size: 10 }
street.getView(0).get("size"); //=> 10
street.size; //=> 2
street.set(0, { size: 100 });
street.get(0); //=> { size: 100 }
```

For vectors set `btype` to `vector`:

```typescript
const Names = view.create<Array<string | undefined>>({
  type: "array",
  btype: "vector",
  items: {
    type: "string",
  },
});
const witches = Names.from([
  "Granny Weatherwax",
  "Nanny Ogg",
  undefined,
  "Magrat Garlick",
]);
witches.byteLength; //=> 64
witches.get(0); //=> "Granny Weatherwax"
witches.get(2); //=> undefined
```

As with maps, the layout of vectors is calculated upon creation and editing is
limited to the items present upon creation.

#### Strings

The protocol handles strings through StringView, an extension of DataView that
handles string serialization. It also offers a handful of convenience methods to
operate on encoded strings so that some common operations can be performed
without decoding the string:

```javascript
import { StringView } from "structurae";

let stringView = StringView.from("abc😀a");
//=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
stringView.toString(); //=> "abc😀a"
stringView == "abc😀a"; //=> true

stringView = StringView.from("abc😀");
// length of the view in bytes
stringView.length; //=> 8
// the amount of characters in the string
stringView.size; //=> 4
// get the first character in the string
stringView.charAt(0); //=> "a"
// get the fourth character in the string
stringView.charAt(3); //=> "😀"
// iterate over characters
[...stringView.characters()]; //=> ["a", "b", "c", "😀"]
stringView.substring(0, 4); //=> "abc😀"

stringView = StringView.from("abc😀a");
const searchValue = StringView.from("😀");
stringView.indexOf(searchValue); //=> 3
const replacement = StringView.from("d");
stringView.replace(searchValue, replacement).toString(); //=> "abcda"
stringView.reverse().toString(); //=> "adcba"
```

#### Tagged Objects

When transferring our buffers encoded with views we can often rely on meta
information to know what kind of view to use in order to decode a received
buffer. However, sometimes we might want our views to carry that information
within themselves. To do that, we can prepend or tag each view with a value
indicating its class, i.e. add a field that defaults to a certain value for each
view class. Now upon receiving a buffer we can read that field using the
DataView and convert it into an appropriate view.

The `View` class offers a few convenience methods to simplify this process:

```typescript
import { View } from "structurae";
interface Dog {
  tag: 0;
  name: string;
}
interface Cat {
  tag: 1;
  name: string;
}
const DogView = view.create<Dog>({
  type: "object",
  $id: "Dog",
  properties: {
    // the tag field with default value
    tag: { type: "number", btype: "uint8", default: 0 }
    name: { type: "string", maxLength: 10 }
  },
});
const CatView = view.create<Cat>({
  type: "object",
  $id: "Cat",
  properties: {
    // the tag field with default value
    tag: { type: "number", btype: "uint8", default: 1 }
    name: { type: "string", maxLength: 10 }
  },
});

// now we can encode tagged objects without specifying views first:
const animal = view.encode({ tag: 0, name: "Gaspode" });
// and decode them:
view.decode(animal) //=> { tag: 0, name: "Gaspode" }
```

### Bit Structures

#### BitField & BigBitField

BitField and BigBitField use JavaScript Numbers and BigInts respectively as
bitfields to store and operate on data using bitwise operations. By default,
BitField operates on 31 bit long bitfield where bits are indexed from least
significant to most:

```javascript
import { BitField } from "structurae";

const bitfield = new BitField(29); // 29 === 0b11101
bitfield.get(0); //=> 1
bitfield.get(1); //=> 0
bitfield.has(2, 3, 4); //=> true
```

You can use BitFieldMixin or BigBitFieldMixin with your own schema by specifying
field names and their respective sizes in bits:

```javascript
const Field = BitFieldMixin({ width: 8, height: 8 });
const field = new Field({ width: 100, height: 200 });
field.get("width"); //=> 100;
field.get("height"); //=> 200
field.set("width", 18);
field.get("width"); //=> 18
field.toObject(); //=> { width: 18, height: 200 }
```

If the total size of your fields exceeds 31 bits, use BigBitFieldMixin that
internally uses a BigInt to represent the resulting number, however, you can
still use normal numbers to set each field and get their value as a number as
well:

```javascript
const LargeField = BitFieldMixin({ width: 20, height: 20 });
const largeField = new LargeField([1048576, 1048576]);
largeField.value; //=> 1099512676352n
largeField.set("width", 1000).get("width"); //=> 1000
```

If you have to add more fields to your schema later on, you do not have to
re-encode your existing values, just add new fields at the end of your new
schema:

```javascript
const OldField = BitFieldMixin({ width: 8, height: 8 });
const oldField = OldField.encode([20, 1]);
//=> oldField === 276

const NewField = BitFieldMixin({ width: 8, height: 8, area: 10 });
const newField = new NewField(oldField);
newField.get("width"); //=> 20
newField.get("height"); //=> 1
newField.set("weight", 100).get("weight"); //=> 100
```

If you only want to encode or decode a set of field values without creating an
instance, you can do so by using static methods `BitField.encode` and
`BitField.decode` respectively:

```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });

Field.encode([20, 1]); //=> 41
Field.encode({ height: 1, width: 20 }); //=> 41
Field.decode(41); //=> { width: 20, height: 1 }
```

If you don't know beforehand how many bits you need for your field, you can call
`BitField.getMinSize` with the maximum possible value of your field to find out:

```javascript
BitField.getMinSize(100); //=> 7
const Field = BitFieldMixin({ width: BitField.getMinSize(250), height: 8 });
```

For performance sake, BitField doesn't check the size of values being set and
setting values that exceed the specified field size will lead to undefined
behavior. If you want to check whether values fit their respective fields, you
can use `BitField.isValid`:

```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });

Field.isValid({ width: 100 }); //=> true
Field.isValid({ width: 100, height: 3 }); //=> false
```

`BitField#match` (and its static variation `BitField.match`) can be used to
check values of multiple fields at once:

```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });
const field = new Field([20, 1]);
field.match({ width: 20 }); //=> true
field.match({ height: 1, width: 20 }); //=> true
field.match({ height: 1, width: 19 }); //=> false
Field.match(field.valueOf(), { height: 1, width: 20 }); //=> true
```

If you have to check multiple BitField instances for the same values, create a
special matcher with `BitField.getMatcher` and use it in the match method, that
way each check will require only one bitwise operation and a comparison:

```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });
const matcher = Field.getMatcher({ height: 1, width: 20 });
Field.match(new Field([20, 1]).valueOf(), matcher); //=> true
Field.match(new Field([19, 1]).valueOf(), matcher); //=> false
```

#### BitArray

BitArray uses Uint32Array as an array or vector of bits. It's a simpler version
of BitField that only sets and checks individual bits:

```javascript
const array = new BitArray(10);
array.getBit(0); //=> 0
array.setBit(0).getBit(0); //=> 1
array.size; //=> 10
array.length; //=> 1
```

BitArray is the base class for
[Pool](https://github.com/zandaqo/structurae#Pool) and
[RankedBitArray](https://github.com/zandaqo/structurae#RankedBitArray) classes.
It's useful in cases where one needs more bits than can be stored in a number,
but doesn't want to use BigInts as it is done by
[BitField](https://github.com/zandaqo/structurae#BitField).

#### Pool

Implements a fast algorithm to manage availability of objects in an object pool
using a BitArray.

```javascript
const { Pool } = require("structurae");

// create a pool of 1600 indexes
const pool = new Pool(100 * 16);

// get the next available index and make it unavailable
pool.get(); //=> 0
pool.get(); //=> 1

// set index available
pool.free(0);
pool.get(); //=> 0
pool.get(); //=> 2
```

#### RankedBitArray

RankedBitArray is an extension of BitArray with methods to efficiently calculate
rank and select. The rank is calculated in constant time where as select has
O(logN) time complexity. This is often used as a basic element in implementing
succinct data structures.

```javascript
const array = new RankedBitArray(10);
array.setBit(1).setBit(3).setBit(7);
array.rank(2); //=> 1
array.rank(7); //=> 2
array.select(2); //=> 3
```

### Graphs

Structurae offers classes that implement adjacency list (`AdjacencyList`) and
adjacency matrix (`AdjacencyMatrixUnweightedDirected`,
`AdjacencyMatrixUnweightedUndirected`, `AdjacencyMatrixWeightedDirected`,
`AdjacencyMatrixWeightedUnirected`) as basic primitives to represent graphs
using TypedArrays, and the `Graph` class that extends the adjacency structures
to offer methods for traversing graphs (BFS, DFS), pathfinding (Dijkstra,
Bellman-Ford), and spanning tree construction (BFS, Prim).

#### Adjacency Structures

`AdjacencyList` implements adjacency list data structure extending a TypedArray
class. The adjacency list requires less storage space: number of vertices +
number of edges * 2 (for a weighted list). However, adding and removing edges is
much slower since it involves shifting/unshifting values in the underlying typed
array.

```javascript
import { AdjacencyListMixin } from "structurae";

const List = AdjacencyListMixin(Int32Array);
const graph = List.create(6, 6);

// the length of a weighted graph is vertices + edges * 2 + 1
graph.length; //=> 19
graph.addEdge(0, 1, 5);
graph.addEdge(0, 2, 1);
graph.addEdge(2, 4, 1);
graph.addEdge(2, 5, 2);
graph.hasEdge(0, 1); //=> true
graph.hasEdge(0, 4); //=> false
graph.outEdges(2); //=> [4, 5]
graph.inEdges(2); //=> [0]
graph.hasEdge(0, 1); //=> true
graph.getEdge(0, 1); //=> 5
```

Since the maximum amount of egdes in AdjacencyList is limited to the number
specified at creation, adding edges can overflow throwing a RangeError. If
that's a possibility, use `AdjacencyList#isFull` method to check if the limit is
reached before adding an edge.

`AdjacencyMatrixUnweightedDirected` and `AdjacencyMatrixUnweightedUndirected`
implement adjacency matrix data structure for unweighted graphs representing
each edge by a single bit in an underlying ArrayBuffer.

`AdjacencyMatrixWeightedDirected` and `AdjacencyMatrixWeightedUnirected`
implement adjacency matrix for weighted graphs extending a given TypedArray to
store the weights akin to [Grid](https://github.com/zandaqo/structurae#Grid).

```javascript
import {
  AdjacencyMatrixUnweightedDirected,
  AdjacencyMatrixWeightedDirectedMixin,
} from "structurae";

// creates a class for directed graphs that uses Int32Array for edge weights
const Matrix = AdjacencyMatrixWeightedDirectedMixin(Int32Array);

const unweightedMatrix = new AdjacencyMatrixUnweightedDirected.create(6);
unweightedMatrix.addEdge(0, 1);
unweightedMatrix.addEdge(0, 2);
unweightedMatrix.addEdge(0, 3);
unweightedMatrix.addEdge(2, 4);
unweightedMatrix.addEdge(2, 5);
unweightedMatrix.hasEdge(0, 1); //=> true
unweightedMatrix.hasEdge(0, 4); //=> false
unweightedMatrix.outEdges(2); //=> [4, 5]
unweightedMatrix.inEdges(2); //=> [0]

const weightedMatrix = Matrix.create(6);
weightedMatrix.addEdge(0, 1, 3);
weightedMatrix.hasEdge(0, 1); //=> true
weightedMatrix.hasEdge(1, 0); //=> false
weightedMatrix.getEdge(1, 0); //=> 3
```

#### Graph

`Graph` extends a provided adjacency structure with methods for traversing,
pathfinding, and spanning tree construction that use various graph algorithms.

```javascript
import {
  AdjacencyMatrixUnweightedDirected,
  AdjacencyMatrixWeightedDirectedMixin,
  GraphMixin,
} from "structurae";

// create a graph for directed unweighted graphs that use adjacency list structure
const UnweightedGraph = GraphMixin(AdjacencyMatrixUnweightedDirected);

// for directed weighted graphs that use adjacency matrix structure
const WeightedGraph = GraphMixin(
  AdjacencyMatrixWeightedDirectedMixin(Int32Array),
);
```

The traversal is done by a generator function `Graph#traverse` that can be
configured to use Breadth-First or Depth-First traversal, as well as returning
vertices on various stages of processing, i.e. only return vertices that are
fully processed (`black`), or being processed (`gray`), or just encountered
(`white`):

```javascript
const graph = WeightedGraph.create(6);
graph.addEdge(0, 1, 3);
graph.addEdge(0, 2, 2);
graph.addEdge(0, 3, 1);
graph.addEdge(2, 4, 8);
graph.addEdge(2, 5, 6);

// a BFS traversal results
[...graph.traverse()]; //=> [0, 1, 2, 3, 4, 5]

// DFS
[...graph.traverse(true)]; //=> [0, 3, 2, 5, 4, 1]

// BFS yeilding only non-encountered ("white") vertices starting from 0
[...graph.traverse(false, 0, false, true)]; //=> [1, 2, 3, 4, 5]
```

`Graph#path` returns the list of vertices constituting the shortest path between
two given vertices. By default, the class uses BFS based search for unweighted
graphs, and Bellman-Ford algorithm for weighted graphs. However, the method can
be configured to use other algorithms by specifying arguments of the function:

```javascript
graph.path(0, 5); // uses Bellman-Ford by default
graph.path(0, 5, true); // the graph is acyclic, uses DFS
graph.path(0, 5, false, true); // the graph might have cycles, but has no negative edges, uses Dijkstra
```

### Grids

#### BinaryGrid

BinaryGrid creates a grid or 2D matrix of bits and provides methods to operate
on it:

```javascript
import { BinaryGrid } from "structurae";

// create a grid of 2 rows and 8 columns
const bitGrid = BinaryGrid.create(2, 8);
bitGrid.setValue(0, 0).setValue(0, 2).setValue(0, 5);
bitGrid.getValue(0, 0); //=> 1
bitGrid.getValue(0, 1); //=> 0
bitGrid.getValue(0, 2); //=> 1
```

BinaryGrid packs bits into numbers like
[BitField](https://github.com/zandaqo/structurae#BitField) and holds them in an
ArrayBuffer, thus occupying the smallest possible space.

#### Grid

Grid extends a provided Array or TypedArray class to efficiently handle 2
dimensional data without creating nested arrays. Grid "unrolls" nested arrays
into a single array and pads its "columns" to the nearest power of 2 in order to
employ quick lookups with bitwise operations.

```javascript
import { GridMixin } from "structurae";

const ArrayGrid = GridMixin(Array);

// create a grid of 5 rows and 4 columns
const grid = ArrayGrid.create(5, 4);
grid.length; //=> 20
grid[0]; //=> 0

// create a grid from existing data:
const dataGrid = new ArrayGrid([
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
]);
// set columns number:
dataGrid.columns = 4;
dataGrid.getValue(1, 0); //=> 5

// you can change dimensions of the grid by setting columns number at any time:
dataGrid.columns = 2;
dataGrid.getValue(1, 0); //=> 3
```

You can get and set elements using their row and column indexes:

```javascript
//=> ArrayGrid [1, 2, 3, 4, 5, 6, 7, 8]
grid.getValue(0, 1); //=> 2
grid.setValue(0, 1, 10);
grid.getValue(0, 1); //=> 10

// use `getIndex` to get an array index of an element at given coordinates
grid.getIndex(0, 1); //=> 1

// use `getCoordinates` to find out row and column indexes of a given element by its array index:
grid.getCoordinates(0); //=> [0, 0]
grid.getCoordinates(1); //=> [0, 1]
```

A grid can be turned to and from an array of nested arrays using respectively
`Grid.fromArrays` and `Grid#toArrays` methods:

```javascript
const grid = ArrayGrid.fromArrays([[1, 2], [3, 4]]);
//=> ArrayGrid [ 1, 2, 3, 4 ]
grid.getValue(1, 1); //=> 4

// if arrays are not the same size or their size is not equal to a power two, Grid will pad them with 0 by default
// the value for padding can be specified as the second argument
const grid = ArrayGrid.fromArrays([[1, 2], [3, 4, 5]]);
//=> ArrayGrid [ 1, 2, 0, 0, 3, 4, 5, 0 ]
grid.getValue(1, 1); //=> 4
grid.toArrays(); //=> [ [1, 2], [3, 4, 5] ]

// you can choose to keep the padding values
grid.toArrays(true); //=> [ [1, 2, 0, 0], [3, 4, 5, 0] ]
```

#### SymmetricGrid

SymmetricGrid is a Grid that offers a more compact way of encoding symmetric or
triangular square matrices using half as much space.

```javascript
import { SymmetricGrid } from "structurae";

const grid = ArrayGrid.create(100, 100);
grid.length; //=> 12800
const symmetricGrid = SymmetricGrid.create(100);
symmetricGrid.length; //=> 5050
```

Since the grid is symmetric, it returns the same value for a given pair of
coordinates regardless of their position:

```javascript
symmetricGrid.setValue(0, 5, 10);
symmetricGrid.getValue(0, 5); //=> 10
symmetricGrid.getValue(5, 0); //=> 10
```

### Sorted Structures

#### BinaryHeap

BinaryHeap extends built-in Array to implement the binary heap data structure.
All the mutating methods (push, shift, splice, etc.) do so while maintaining the
valid heap structure. By default, BinaryHeap implements min-heap, but it can be
changed by providing a different comparator function:

```javascript
import { BinaryHeap } from "structurae";

class MaxHeap extends BinaryHeap {}
MaxHeap.compare = (a, b) => a > b;
```

In addition to all array methods, BinaryHeap provides a few methods to traverse
or change the heap:

```javascript
const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
heap[0]; //=> 1
// the left child of the first (minimal) element of the heap
heap.left(0); //=> 3
// the right child of the first (minimal) element of the heap
heap.right(0); //=> 8
// the parent of the second element of the heap
heap.parent(1); //=> 1
// returns the first element and adds a new element in one operation
heap.replace(4); //=> 1
heap[0]; //=> 3
heap[0] = 6;
// BinaryHeap [ 6, 4, 8, 10, 9, 20 ]
heap.update(0); // updates the position of an element in the heap
// BinaryHeap [ 4, 6, 8, 10, 9, 20 ]
```

#### SortedArray

SortedArray extends Array with methods to efficiently handle sorted data. The
methods that change the contents of an array do so while preserving the sorted
order:

```js
import { SortedArray } from "structurae";

const sortedArray = new SortedArray();
sortedArray.push(1);
//=> SortedArray [ 1, 2, 3, 4, 5, 9 ]
sortedArray.unshift(8);
//=> SortedArray [ 1, 2, 3, 4, 5, 8, 9 ]
sortedArray.splice(0, 2, 6);
//=> SortedArray [ 3, 4, 5, 6, 8, 9 ]
```

`uniquify` can be used to remove duplicating elements from the array:

```js
const a = SortedArray.from([1, 1, 2, 2, 3, 4]);
a.uniquify();
//=> SortedArray [ 1, 2, 3, 4 ]
```

If the instance property `unique` of an array is set to `true`, the array will
behave as a set and avoid duplicating elements:

```js
const a = new SortedArray();
a.unique = true;
a.push(1); //=> 1
a.push(2); //=> 2
a.push(1); //=> 2
a; //=> SortedArray [ 1, 2 ]
```

To create a sorted collection from unsorted array-like objects or items use
`from` and `of` static methods respectively:

```js
SortedArray.from([3, 2, 9, 5, 4]);
//=> SortedArray [ 2, 3, 4, 5, 9 ]
SortedArray.of(8, 5, 6);
//=> SortedArray [ 5, 6, 8 ]
```

`new SortedArray` behaves the same way as `new Array` and should be used with
already sorted elements:

```js
new SortedArray(...[1, 2, 3, 4, 8]);
//=> SortedArray [ 1, 2, 3, 4, 8 ];
```

`indexOf` and `includes` use binary search that increasingly outperforms the
built-in methods as the size of the array grows.

SortedArray provides `isSorted` method to check if the collection is sorted, and
`range` method to get elements of the collection whose values are between the
specified range:

```js
//=> SortedArray [ 2, 3, 4, 5, 9 ]
sortedArray.range(3, 5);
// => SortedArray [ 3, 4, 5 ]
sortedArray.range(undefined, 4);
// => SortedArray [ 2, 3, 4 ]
sortedArray.range(4);
// => SortedArray [ 4, 5, 8 ]
```

SortedArray also provides a set of functions to perform common set operations
and find statistics of any sorted array-like objects.

## License

MIT © [Maga D. Zandaqo](http://maga.name)
