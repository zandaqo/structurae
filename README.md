# Structurae

[![npm](https://img.shields.io/npm/v/structurae.svg?style=flat-square)](https://www.npmjs.com/package/structurae)
[![Travis branch](https://img.shields.io/travis/zandaqo/structurae.svg?style=flat-square)](https://travis-ci.org/zandaqo/structurae)
[![Codecov](https://img.shields.io/codecov/c/github/zandaqo/structurae.svg?style=flat-square)](https://codecov.io/github/zandaqo/structurae)

A collection of data structures for high-performance JavaScript applications that includes:

- [BitField](https://github.com/zandaqo/structurae#BitField) - stores and operates on data in Numbers and BigInts treating them as bitfields.
- [Graphs](https://github.com/zandaqo/structurae#Graphs):
    - [Graph](https://github.com/zandaqo/structurae#Graph) -  the general data structure for graphs, extends an adjacency list/matrix structure
     and provides methods for traversal (BFS, DFS), pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.
    - [UnweightedAdjacencyList](https://github.com/zandaqo/structurae#UnweightedAdjacencyList) -  implements Adjacency List for unweighted graphs.
    - [UnweightedAdjacencyMatrix](https://github.com/zandaqo/structurae#UnweightedAdjacencyMatrix) -  implements Adjacency Matrix using [BinaryGrid](https://github.com/zandaqo/structurae#BinaryGrid) for unweighted graphs.
    - [WeightedAdjacencyList](https://github.com/zandaqo/structurae#WeightedAdjacencyList) - implements Adjacency List for weighted graphs.
    - [WeightedAdjacencyMatrix](https://github.com/zandaqo/structurae#WeightedAdjacencyMatrix) - implements Adjacency Matrix using [Grid](https://github.com/zandaqo/structurae#Grid) or [SymmetricGrid](https://github.com/zandaqo/structurae#SymmetricGrid) for weighted graphs.
- [Grids](https://github.com/zandaqo/structurae#Grids):
    - [BinaryGrid](https://github.com/zandaqo/structurae#BinaryGrid) - creates a grid or 2D matrix of bits.
    - [Grid](https://github.com/zandaqo/structurae#Grid) - extends built-in indexed collections to handle 2 dimensional data (e.g. nested arrays).
    - [SymmetricGrid](https://github.com/zandaqo/structurae#SymmetricGrid) - a grid to handle symmetric or triangular matrices using half the space required for a normal grid.
- [Pool](https://github.com/zandaqo/structurae#Pool) - manages availability of objects in object pools.
- [RecordArray](https://github.com/zandaqo/structurae#RecordArray) - extends DataView to use ArrayBuffer as an array of records or C-like structs.
- [Sorted Structures](https://github.com/zandaqo/structurae#sorted-structures):
    - [BinaryHeap](https://github.com/zandaqo/structurae#BinaryHeap) - extends Array to implement the Binary Heap data structure.
    - [SortedCollection](https://github.com/zandaqo/structurae#SortedCollection) - extends TypedArrays  to handle sorted data.
    - [SortedArray](https://github.com/zandaqo/structurae#SortedArray) -  extends Array to handle sorted data.
- [StringView](https://github.com/zandaqo/structurae#StringView) - extends Uint8Array to handle C-like representation of UTF-8 encoded strings.

## Installation
```
npm i structurae 
```

## Documentation
- [API documentation](https://github.com/zandaqo/structurae/blob/master/doc/API.md)
- Articles:
    - [Structurae: Data Structures for Heigh-Performance JavaScript](https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8)

## Overview
### BitField
BitField uses JavaScript Numbers and BigInts as bitfields to store and operate on data using bitwise operations.
By default, BitField operates on 31 bit long bitfield where bits are indexed from least significant to most:
```javascript
const { BitField } = require('structurae');

const bitfield = new BitField(29); // 29 === 0b11101
bitfield.get(0);
//=> 1
bitfield.get(1);
//=> 0
bitfield.has(2, 3, 4);
//=> true
```

You can extend BitField and use your own schema by specifying field names and their respective sizes in bits:
```javascript
class Person extends BitField {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.get('age');
//=> 20
person.get('gender');
//=> 1
person.set('age', 18);
person.value
//=> 41
person.toObject();
//=> { age: 18, gender: 1 }
```

You can forgo specifying sizes if your field size is 1 bit:
```javascript
class Privileges extends BitField {}
Privileges.fields = ['user', 'moderator', 'administrator'];

const privileges = new Privileges(0);
privileges.set('user').set('moderator');
privileges.has('user', 'moderator');
//=> true
privileges.set('moderator', 0).has('moderator');
//=> false
```

If the total size of your fields exceeds 31 bits, BitField will internally use a BigInt to represent the resulting number,
however, you can still use normal numbers to set each field and get their value as a number as well:
```javascript
class LargeField extends BitField {}
LargeField.fields = [
  { name: 'width', size: 20 },
  { name: 'height', size: 20 },
];

const largeField = new LargeField([1048576, 1048576]);
largeField.value
//=> 1099512676352n
largeField.set('width', 1000).get('width')
//=> 1000
```

If you have to add more fields to your schema later on, you do not have to re-encode your existing values, just add new fields 
at the end of your new schema:

```javascript
class OldPerson extends BitField {}
OldPerson.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

const oldPerson = OldPerson.encode([20, 1]);
//=> oldPerson === 41

class Person extends BitField {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
  { name: 'weight', size: 8 },
];
const newPerson = new Person(oldPerson);
newPerson.get('age');
//=> 20
newPerson.get('weight');
//=> 0
newPerson.set('weight', 100).get('weight');
//=> 100
```

If you only want to encode or decode a set of field values without creating an instance, you can do so by use static methods
`BitField.encode` and `BitField.decode` respectively:
```javascript
class Person extends BitField {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

Person.encode([20, 1]);
//=> 41

Person.decode(41);
//=> { age: 20, gender: 1 }
```

If you don't know beforehand how many bits you need for your field, you can call `BitField.getMinSize` with the maximum
possible value of your field to find out:
```javascript
BitField.getMinSize(100);
//=> 7

class Person extends BitField {}
Person.fields = [
  { name: 'age', size: BitField.getMinSize(100) },
  { name: 'gender', size: 1 },
];
```

For performance sake, BitField doesn't check the size of values being set and setting values that exceed the specified
field size will lead to undefined behavior. If you want to check whether values fit their respective fields, you can use `BitField.isValid`:
```javascript
class Person extends BitField {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

Person.isValid({age: 100});
//=> true
Person.isValid({age: 100, gender: 3});
//=> false
Person.isValid([100, 1]);
//=> true
Person.isValid([100, 3]);
//=> false
```

`BitField#match` (and its static variation `BitField.match`) can be used to check values of multiple fields at once:
```javascript
const person = new Person([20, 1]);
person.match({ age: 20 });
//=> true
person.match({ gender: 1, age: 20 });
//=> true
person.match({ gender: 1, age: 19 });
//=> false
Person.match(person.valueOf(), { gender: 1, age: 20 });
//=> true
```

If you have to check multiple BitField instances for the same values, create a special matcher with `BitField.getMatcher`
and use it in the match method, that way each check will require only one bitwise operation and a comparison:
```javascript
const matcher = Person.getMatcher({ gender: 1, age: 20 });
Person.match(new Person([20, 1]).valueOf(), matcher);
//=> true
Person.match(new Person([19, 1]).valueOf(), matcher);
//=> false
```

### Graphs
Structurae offers classes that implement Adjacency List (`UnweightedAdjacencyList`, `WeightedAdjacencyList`) and Adjacency Matrix (`UnweightedAdjacencyMatrix`, 
 `WeightedAdjacencyMatrix`) as basic primitives to represent graphs using a TypedArray, and the `Graph` class that extends the adjacency structures to offer methods for traversing
 graphs (BFS, DFS), pathfinding (Dijkstra, Bellman-Ford), and spanning tree construction (BFS, Prim).
  
#### Adjacency Lists
`UnweightedAdjacencyList` and `WeightedAdjacencyList` implement Adjacency List data structure extending a TypedArray class.
The adjacency list requires less storage space: number of vertices + number of edges (for an unweighted list) or number of edges * 2 (for a weighted list).
However, adding and removing edges is much slower since it involves shifting/unshifting values in the underlying typed array.

```javascript
const { UnweightedAdjacencyList, WeightedAdjacencyListMixin } = require('structurae');

const WeightedAdjacencyList = WeightedAdjacencyListMixin(Int32Array);

const unweightedGraph = new UnweightedAdjacencyList({ vertices: 6, edges: 6 });
const weightedGraph = new WeightedAdjacencyList({ vertices: 6, edges: 6 });

// the length of an unweighted graph is vertices + edges + 1
unweightedGraph.length;
//=> 13

// the length of a weighted graph is vertices + edges * 2 + 1
weightedGraph.length;
//=> 19

unweightedGraph.addEdge(0, 1).addEdge(0, 2).addEdge(2, 4).addEdge(2, 5);

unweightedGraph.hasEdge(0, 1);
//=> true
unweightedGraph.hasEdge(0, 4);
//=> false
unweightedGraph.outEdges(2);
//=> [4, 5]
unweightedGraph.inEdges(2);
//=> [0]

weightedGraph.addEdge(0, 1, 5);
weightedGraph.hasEdge(0, 1);
//=> true
weightedGraph.get(0, 1);
//=> 5
```

Since the maximum amount of egdes is limited to the number specified at creation, adding edges can overflow throwing a RangeError.
If that's a possibility, use `isFull` to check if the limit is reached before adding. If additional edges are required, one can use the
`grow` method specifying the amount of additional vertices and edges required. `grow` creates a copy of the graph with increased limits:
```javascript
graph.length
//=> 13
const biggerGraph = graph.grow(4, 10); // add 4 vertices and 10 edges
biggerGraph.length
//=> 27
```

Adjacency lists can be created from an existing adjacency matrices or grids using the `fromGrid` method.

#### Adjacency Matrices
`UnweightedAdjacencyMatrix` and `WeightedAdjacencyMatrix` build on Grid classes extending them to implement Adjacency Matrix data structure
using TypedArrays. They offer the same methods to operate on edges as the adjacency list structures described above.

`UnweightedAdjacencyMatrix` extends [BinaryGrid](https://github.com/zandaqo/structurae#BinaryGrid) to represent
 an unweighted graph in the densest possible way: each edge is represented by a single bit in an underlying ArrayBuffer.
 For example, to represent a graph with 80 vertices as an Adjacency Matrix we need 80 * 80 bits or 800 bytes. UnweightedAdjacencyMatrix will
 will create an ArrayBuffer of that size, "view" it as Uint16Array (of length 400) and operate on edges using bitwise operations. 

`WeightedAdjacencyMatrix` extends [Grid](https://github.com/zandaqo/structurae#Grid) (for directed graphs)
 or [SymmetricGrid](https://github.com/zandaqo/structurae#SymmetricGrid) (for undirected) to handle weighted graphs. 
 
```javascript
const { UnweightedAdjacencyMatrix, WeightedAdjacencyMatrixMixin } = require('structurae');
// creates a class for directed graphs that uses Int32Array for edge weights
const WeightedAdjacencyMatrix = WeightedAdjacencyMatrixMixin(Int32Array, true);

const unweightedGraph = new UnweightedAdjacencyMatrix({ vertices: 6 });
unweightedGraph.addEdge(0, 1).addEdge(0, 2).addEdge(0, 3).addEdge(2, 4).addEdge(2, 5);
unweightedGraph.hasEdge(0, 1);
//=> true
unweightedGraph.hasEdge(0, 4);
//=> false
unweightedGraph.outEdges(2);
//=> [4, 5]
unweightedGraph.inEdges(2);
//=> [0]

const weightedGraph = new WeightedAdjacencyMatrix({ vertices: 6, pad: -1 });
weightedGraph.addEdge(0, 1, 3);
weightedGraph.hasEdge(0, 1);
//=> true
weightedGraph.hasEdge(1, 0);
//=> false
weightedGraph.get(1, 0);
//=> 3
``` 

#### Graph
`Graph` extends a provided adjacency structure with methods for traversing, pathfinding, and spanning tree construction that use various 
graph algorithms.

```javascript
const { GraphMixin, UnweightedAdjacencyList, WeightedAdjacencyMatrixMixin }  = require('structurae');

// create a graph for directed unweighted graphs that use adjacency list structure
const UnweightedGraph = GraphMixin(UnweightedAdjacencyList);

// for directed weighted graphs that use adjacency matrix structure
const WeightedGraph = GraphMixin(WeightedAdjacencyMatrixMixin(Int32Array));
```

The traversal is done by a generator function `Graph#traverse` that can be configured to use Breadth-First or Depth-First traversal,
as well as returning vertices on various stages of processing, i.e. only return vertices that are fully processed (`black`), or being
processed (`gray`), or just encountered (`white`):

```javascript
const graph = new WeightedGraph({ vertices: 6, edges: 12 });
graph.addEdge(0, 1, 3).addEdge(0, 2, 2).addEdge(0, 3, 1).addEdge(2, 4, 8).addEdge(2, 5, 6);

// a BFS traversal results
[...graph.traverse()];
//=> [0, 1, 2, 3, 4, 5]

// DFS
[...graph.traverse(true)];
//=> [0, 3, 2, 5, 4, 1]

// BFS yeilding only non-encountered ('white') vertices starting from 0
[...graph.traverse(false, 0, false, true)];
//=> [1, 2, 3, 4, 5]
```

`Graph#path` returns the list of vertices constituting the shortest path between two given vertices. By default, the class uses
BFS based search for unweighted graphs, and Bellman-Ford algorithm for weighted graphs. However, the method can be configured to use
other algorithms by specifying arguments of the function:
```javascript
graph.path(0, 5); // uses Bellman-Ford by default
graph.path(0, 5, true); // the graph is acyclic, uses DFS
graph.path(0, 5, false, true); // the graph might have cycles, but has no negative edges, uses Dijkstra
```

### Grids
#### BinaryGrid
BinaryGrid creates a grid or 2D matrix of bits and provides methods to operate on it:
```javascript
const { BinaryGrid } = require('structurae');

const bitGrid = new BinaryGrid({ rows: 2, columns: 8 });
bitGrid.set(0, 0).set(0, 2).set(0, 5);
bitGrid.get(0, 0);
//=> 1
bitGrid.get(0, 1);
//=> 0
bitGrid.get(0, 2);
//=> 1
bitGrid.getRow(0);
//=> [ 1, 0, 1, 0, 0, 1, 0, 0 ]
bitGrid.getColumn(0);
//=> [ 1, 0 ]
```
BinaryGrid packs bits into numbers like [BitField](https://github.com/zandaqo/structurae#BitField)
 and holds them in an ArrayBuffer, thus occupying the smallest possible space.

#### Grid
Grid extends a provided indexed collection class (Array or TypedArrays) to efficiently handle 2 dimensional data without creating
nested arrays. Grid "unrolls" nested arrays into a single array and pads its "columns" to the nearest power of 2 in order to employ
quick lookups with bitwise operations.

```javascript
const { GridMixin } = require('structurae');

const ArrayGrid = GridMixin(Array);

// create a grid of 5 rows and 4 columns filled with 0
const grid = new ArrayGrid({rows: 5, columns: 4 });
grid.length
//=> 20
grid[0]
//=> 0

// send data as the second parameter to instantiate a grid with data:
const  dataGrid = new ArrayGrid({rows: 5, columns: 4 }, [1, 2, 3, 4, 5, 6, 7, 8]);
grid.length
//=> 20
grid[0]
//=> 0

// you can change dimensions of the grid by setting columns number at any time:
dataGrid.columns = 2;
```

You can get and set elements using their row and column indexes:
```javascript
grid
//=> ArrayGrid [1, 2, 3, 4, 5, 6, 7, 8]
grid.get(0, 1);
//=> 2
grid.set(0, 1, 10);
grid.get(0, 1);
//=> 10


// use `getIndex` to get an array index of an element at given coordinates
grid.getIndex(0, 1);
//=> 1

// use `getCoordinates` to find out row and column indexes of a given element by its array index:
grid.getCoordinates(0);
//=> { row: 0, column: 0 }
grid.getCoordinates(1);
//=> { row: 0, column: 1 }
```

A grid can be turned to and from an array of nested arrays using respectively `Grid.fromArrays` and `Grid#toArrays` methods:
```javascript
const grid = ArrayGrid.fromArrays([[1,2], [3, 4]]);
//=> ArrayGrid [ 1, 2, 3, 4 ]
grid.get(1, 1);
//=> 4

// if arrays are not the same size or their size is not equal to a power two, Grid will pad them with 0 by default
// the value for padding can be specified as the second argument
const grid = ArrayGrid.fromArrays([[1, 2], [3, 4, 5]]);
//=> ArrayGrid [ 1, 2, 0, 0, 3, 4, 5, 0 ]
grid.get(1, 1);
//=> 4

grid.toArrays();
//=> [ [1, 2], [3, 4, 5] ]

// you can choose to keep the padding values
grid.toArrays(true);
//=> [ [1, 2, 0, 0], [3, 4, 5, 0] ]
```

#### SymmetricGrid
SymmetricGrid is a Grid that offers a more compact way of encoding symmetric or triangular square matrices using half as much space.
```javascript
const { SymmetricGrid } = require('structurae');

const grid = new ArrayGrid({rows: 100, columns: 100 });
grid.length;
//=> 12800
const symmetricGrid = new SymmetricGrid({ rows: 100 }); 
symmetricGrid.length;
//=> 5050
```
Since the grid is symmetric, it returns the same value for a given pair of coordinates regardless of their position:
```javascript
symmetricGrid.set(0, 5, 10);
symmetricGrid.get(0, 5);
//=> 10
symmetricGrid.get(5, 0);
//=> 10
```

### Pool
Implements a fast algorithm to manage availability of objects in an object pool.
```javascript
const { Pool } = require('structurae');

// create a pool of 1600 indexes
const pool = new Pool(100 * 16);

// get the next available index and make it unavailable
pool.get();
//=> 0
pool.get();
//=> 1

// set index available
pool.free(0);
pool.get();
//=> 0

pool.get();
//=> 2
```

### RecordArray
RecordArray extends DataView to use ArrayBuffer as an array of records or C-like structs. 
Records can contain fields of any type supported by DataView plus strings. 
For a string, the maximum size in bytes should be defined. 

```javascript
const { RecordArray } = require('structurae');

// create an array of 20 records where each has 'age', 'score', and 'name' fields
const people = new RecordArray([
 { name: 'age', type: 'Uint8' },
 { name: 'score', type: 'Float32' },
 { name: 'name', type: 'String', size: 10 },
], 20);
// get the 'age' field value for the first struct in the array
people.get(0, 'age');
//=> 0
// set the 'age' and 'score' field values for the first struct
people.set(0, 'age', 10).set(0, 'score', 5.0);
people.toObject(0);
//=> { age: 10, score: 5.0, name: '' }
```

The String type is handled with [StringView](https://github.com/zandaqo/structurae#StringView).
 You can use its methods to convert them to and from strings.
```javascript
people.get(0, 'name');
//=> StringView(10) [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const name = StringView.fromString('Smith');
people.set(0, name).get(0, 'name');
//=> StringView(10) [83, 109, 105, 116, 104, 0, 0, 0, 0, 0]
people.get(0, 'name').toString();
//=> Smith
```

### Sorted Structures
#### BinaryHeap
BinaryHeap extends built-in Array to implement the Binary Heap data structure. 
All the mutating methods (push, shift, splice, etc.) do so while maintaining the valid heap structure.
By default, BinaryHeap implements min-heap, but it can be changed by providing a different comparator function:
```javascript
const { BinaryHeap } = require('structurae');

class MaxHeap extends BinaryHeap {}
MaxHeap.compare = (a, b) => b - a; 
```
In addition to all array methods, BinaryHeap provides a few methods to traverse or change the heap:
```javascript
const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
heap[0]
//=> 1
heap.left(0); // the left child of the first (minimal) element of the heap
//=> 3
heap.right(0); // the right child of the first (minimal) element of the heap
//=> 8
heap.parent(1); // the parent of the second element of the heap
//=> 1

heap.replace(4) // returns the first element and adds a new element in one operation
//=> 1
heap[0]
//=> 3
heap[0] = 6;
// BinaryHeap [ 6, 4, 8, 10, 9, 20 ]
heap.update(0); // updates the position of an element in the heap
// BinaryHeap [ 4, 6, 8, 10, 9, 20 ]
``` 

#### SortedCollection
SortedCollection extends a given built-in indexed collection with methods to efficiently handle sorted data.

```javascript
const { SortedMixin } = require('structurae');

const SortedInt32Array = SortedMixin(Int32Array);
```

To create a sorted collection from unsorted array-like objects or items use `from` and `of` static methods respectively:
```js
SortedInt32Array.from(unsorted);
//=> SortedInt32Array [ 2, 3, 4, 5, 9 ]
SortedInt32Array.of(8, 5, 6);
//=> SortedInt32Array [ 5, 6, 8 ]
```

`new SortedInt32Array` behaves the same way as `new Int32Array` and should be used with already sorted elements:
```js
new SortedInt32Array(...[ 1, 2, 3, 4, 8 ]);
//=> SortedInt32Array [ 1, 2, 3, 4, 8 ];
new SortedInt32Array(2,3,4);
//=> SortedInt32Array [ 2, 3, 4 ];
```

A custom comparison function can be specified on the collection instance to be used for sorting:
```js
//=> SortedInt32Array [ 2, 3, 4, 5, 9 ]
sortedInt32Array.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
sortedInt32Array.sort();
//=> SortedInt32Array [ 9, 5, 4, 3, 2 ]
```

SortedCollection supports all the methods of its base class:
```javascript
//=> SortedInt32Array [ 2, 3, 4, 5, 9 ]
sortedInt32Array.slice(0, 2)
//=> SortedInt32Array [ 2, 3 ]
sortedInt32Array.set([0, 0, 1])
//=> SortedInt32Array [ 0, 0, 1, 5, 9 ]
```

`indexOf` and `includes` use binary search that increasingly outperforms the built-in methods as the size of the collection grows.

SortedCollection provides `isSorted` method to check if the collection is sorted,
 and `range` method to get elements of the collection whose values are between the specified range:
```js
//=> SortedInt32Array [ 2, 3, 4, 5, 9 ]
sortedInt32Array.range(3, 5);
// => SortedInt32Array [ 3, 4, 5 ]
sortedInt32Array.range(undefined, 4);
// => SortedInt32Array [ 2, 3, 4 ]
sortedInt32Array.range(4);
// => SortedInt32Array [ 4, 5, 8 ]

// set `subarray` to `true` to use `TypedArray#subarray` for the return value instead of copying it with slice:
sortedInt32Array.range(3, 5, true).buffer === sortedInt32Array.buffer;
// => true;
```

SortedCollection also provides a set of functions to perform common set operations 
and find statistics of any sorted array-like objects without converting them to sorted collection.
 Check [API documentation](https://github.com/zandaqo/structurae/blob/master/doc/API.md) for more information.
 

#### SortedArray
SortedArray extends SortedCollection using built-in Array.

SortedArray supports all the methods of Array as well as those provided by SortedCollection.
 The methods that change the contents of an array do so while preserving the sorted order:
```js
const { SortedArray } = require('structurae');

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
const a = SortedArray.from([ 1, 1, 2, 2, 3, 4 ]);
a.uniquify();
//=> SortedArray [ 1, 2, 3, 4 ]
```

If the instance property `unique` of an array is set to `true`, the array will behave as a set and avoid duplicating elements:
```js
const a = new SortedArray();
a.unique = true;
a.push(1);
//=> 1
a.push(2);
//=> 2
a.push(1);
//=> 2
a
//=> SortedArray [ 1, 2 ]
```

### StringView
Encoding API (available both in modern browsers and Node.js) allows us to convert JavaScript strings to 
(and from) UTF-8 encoded stream of bytes represented by a Uint8Array. StringView extends Uint8Array with string related methods
 and relies on Encoding API internally for conversions.
You can use `StringView.fromString` to create an encoded string, and `StringView#toString` to convert it back to a string:
```javascript
const { StringView } = require('structurae');

const stringView = StringView.fromString('abc😀a');
//=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
stringView.toString();
//=> 'abc😀a'
stringView == 'abc😀a';
//=> true
```

While the array itself holds code points, StringView provides methods to operate on characters of the underlying string:
```javascript
const stringView = StringView.fromString('abc😀');
stringView.length; // length of the view in bytes
//=> 8
stringView.size; // the amount of characters in the string
//=> 4
stringView.charAt(0); // get the first character in the string
//=> 'a'
stringView.charAt(3); // get the fourth character in the string
//=> '😀'
[...stringView.characters()] // iterate over characters
//=> ['a', 'b', 'c', '😀']
stringView.substring(0, 4);
//=> 'abc😀'
```

StringView also offers methods for searching and in-place changing the underlying string without decoding:
```javascript
const stringView = StringView.fromString('abc😀a');
const searchValue = StringView.fromString('😀');
stringView.search(searchValue); // equivalent of String#indexOf
//=> 3

const replacement = StringView.fromString('d');
stringView.replace(searchValue, replacement).toString();
//=> 'abcda'

stringView.reverse().toString();
//=> 'adcba'
```

## License
MIT © [Maga D. Zandaqo](http://maga.name)