# Structurae

[![npm](https://img.shields.io/npm/v/structurae.svg?style=flat-square)](https://www.npmjs.com/package/structurae)
[![Actions Status](https://github.com/zandaqo/structurae/workflows/Build/badge.svg)](https://github.com/zandaqo/structurae/actions)

A collection of data structures for high-performance JavaScript applications that includes:

- [Binary Structures](https://github.com/zandaqo/structurae#binary-structures):
    - [ObjectView](https://github.com/zandaqo/structurae#ObjectView) - extends DataView to implement C-like struct.
    - [ArrayView](https://github.com/zandaqo/structurae#ArrayView) - DataView based array of ObjectViews, strings, numbers, etc.
    - [MapView](https://github.com/zandaqo/structurae#MapView) - ObjectView with optional fields and fields of varying sizes.
    - [StringView](https://github.com/zandaqo/structurae#StringView) - extends Uint8Array to handle C-like representation of UTF-8 encoded strings.
    - [BinaryProtocol](https://github.com/zandaqo/structurae#BinaryProtocol) - a helper class that simplifies defining and operating on multiple tagged ObjectViews.
- Bit Structures:
    - [BitField & BigBitField](https://github.com/zandaqo/structurae#BitField) - stores and operates on data in Numbers and BigInts treating them as bitfields.
    - [BitArray](https://github.com/zandaqo/structurae#BitArray) - an array of bits implemented with Uint32Array.
    - [Pool](https://github.com/zandaqo/structurae#Pool) - manages availability of objects in object pools.
    - [RankedBitArray](https://github.com/zandaqo/structurae#RankedBitArray) - extends BitArray with O(1) time rank and O(logN) select methods.
- [Graphs](https://github.com/zandaqo/structurae#Graphs):
    - [Graph](https://github.com/zandaqo/structurae#Graph) -  extends an adjacency list/matrix structure and provides methods for traversal (BFS, DFS),
     pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.
    - [UnweightedAdjacencyList & WeightedAdjacencyList](https://github.com/zandaqo/structurae#Adjacency-Lists) -  implements Adjacency List data structure.
    - [UnweightedAdjacencyMatrix & WeightedAdjacencyMatrix](https://github.com/zandaqo/structurae#Adjacency-Matrices) -  implements Adjacency Matrix data structure.
- [Grids](https://github.com/zandaqo/structurae#Grids):
    - [BinaryGrid](https://github.com/zandaqo/structurae#BinaryGrid) - creates a grid or 2D matrix of bits.
    - [Grid](https://github.com/zandaqo/structurae#Grid) - extends built-in indexed collections to handle 2 dimensional data (e.g. nested arrays).
    - [SymmetricGrid](https://github.com/zandaqo/structurae#SymmetricGrid) - a grid to handle symmetric or triangular matrices using half the space required for a normal grid.
- [Sorted Structures](https://github.com/zandaqo/structurae#sorted-structures):
    - [BinaryHeap](https://github.com/zandaqo/structurae#BinaryHeap) - extends Array to implement the Binary Heap data structure.
    - [SortedCollection](https://github.com/zandaqo/structurae#SortedCollection) - extends TypedArrays  to handle sorted data.
    - [SortedArray](https://github.com/zandaqo/structurae#SortedArray) -  extends Array to handle sorted data.

## Installation
```
npm i structurae 
```

## Documentation
- [API documentation](https://github.com/zandaqo/structurae/blob/master/doc/API.md)
- Articles:
    - [Structurae: Data Structures for Heigh-Performance JavaScript](https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8)
    - [Structurae 1.0: Graphs, Strings, and WebAssembly](https://medium.com/@zandaqo/structurae-1-0-graphs-strings-and-webassembly-25dd964d5a70)

## Overview

### Binary Structures
Binary data in JavaScript is represented by ArrayBuffer and accessed through "view" objects--TypedArrays and DataView.
However, both of those interfaces are limited to working with numbers. Structurae offers a set of classes that extend these interfaces to
support using ArrayBuffers for strings, objects, and arrays of objects defined with schema akin to C-like structs.
Useful on their own, when combined, these classes form the basis for a simple binary protocol that is smaller and faster than
schema-less binary formats (e.g. BSON, MessagePack) and supports zero-copy operations. Unlike other schema-based formats 
(e.g. Flatbuffers), these interfaces are native to JavaScript, hence, supported in all modern browsers and Node.js,
and do not require compilation.

#### ObjectView
ObjectView extends DataView to store a JavaScript object in an ArrayBuffer akin to C-like struct.
Fields of an ObjectView are defined using a subset of JSON Schema. ObjectView supports all JavaScript values, that is, numbers, strings,
booleans, objects, and arrays. Internally, the data is laid out sequentially with fixed sizes, hence,
variable length arrays and optional fields are not supported (for those check out [MapView](https://github.com/zandaqo/structurae#MapView)).

```javascript
const { ObjectViewMixin } = require('structurae');

const Person = ObjectViewMixin({
  $id: 'Person', // each object requires a unique id
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 10 }, // the size of a string field is required and defined by maxLength
    fullName: {
      type: 'array',
      maxItems: 2, // the size of an array is required and defined by maxItems
      items: { type: 'string', maxLength: 10 }, // all items have to be the same type
    },
    bestFriend: { $ref: '#Friend' }, // objects can be referenced with $ref using their $id
    friends: {
      type: 'array',
      maxItems: 3,
      items: {
        $id: 'Friend',
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 10 },
        },
      },
    },
    scores: {
      type: 'array',
      maxItems: 10,
      items: { type: 'integer', btype: 'int16' },
    },
    house: {
      $id: 'House',
      type: 'object',
      properties: {
        size: { type: 'number', btype: 'float32', default: 100 }, // default values are applied upon creation of a view
      },
    },
    pets: {
      type: 'array',
      maxItems: 3,
      items: {
        $id: 'Pet',
        type: 'object',
        properties: {
          type: { type: 'string', maxLength: 10 },
        }
      },
    },
  },
});

const person = Person.from({
  name: 'Zaphod',
  fullName: ['Zaphod', 'Beeblebrox'],
  scores: [1, 2, 3],
  house: {
    size: 1,
  },
  pets: [
    { type: 'dog' }, { type: 'cat' }
  ],
});
person.byteLength
//=> 64
person.get('scores');
//=> 1
person.get('name');
//=> Zaphod
person.getView('name')
//=> StringView [10]
person.get('scores')
//=> [1, 2, 3, 0, 0, 0, 0, 0, 0, 0,]
person.set('house', { size: 5 });
person.get('house');
//=> { size: 5 }
person.toJSON()
//=> { name: 'Zaphod', fullName: ['Zaphod', 'Beeblebrox'], scores: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0,],
// house: { size: 5 }, pets: [{ type: 'dog' }, { type: 'cat' }, { type: '' }] }
```

There are certain requirements for a JSON Schema used for ObjectViews:
- Each object should have a unique id defined with `$id` field. Upon initialization, the view class is stored in `ObjectView.Views`
 and accessed with the id used as the key. References made with `$ref` are also resolved against the id.
- Sizes of strings and arrays should be defined using `maxLength` and `maxItems` properties respectfully.
- `$ref` can be used to reference objects and only objects by their `$id`. The referenced object should be defined either in the
same schema or in a schema of an ObjectView class initialized previously.
- Type `number` by default resolves to `float64` and type `integer` to `int32`, you can use any other type by specifying it in
`btype` property.

ObjectView supports setting default values of fields. Default values are applied upon creation of a view:
```javascript
const House = ObjectViewMixin({
  $id: 'House',
  type: 'object',
  properties: {
    size: { type: 'integer', btype: 'uint32', default: 100 }
  },
});

const house = House.from({});
house.get('size');
//=> 100
```

Default values of an ObjectView can be overridden when the view is used as a field inside other views:
```javascript
const Neighborhood = ObjectViewMixin({
  $id: 'Neighborhood',
  type: 'object',
  properties: {
    house: { $ref: '#House' },
    biggerHouse: { $ref: '#House', default: { size: 200 } },
  },
});

const neighborhood = Neighborhood.from({});
neighborhood.get('house')
//=> { size: 100 }
neighborhood.get('biggerHouse')
//=> { size: 200 }
```

You can add your own field types to ObjectView, for example an ObjectView that supports Date:
```javascript
const { TypeViewMixin } = require('structurae');
class DateView extends TypeViewMixin('float64', true) {
  static from(value, view, start) {
    super.from(+value, view, start);
  }
  
  static toJSON(view, start) {
    return new Date(super.toJSON(view, start));  
  }
}

class View extends ObjectView {}
View.types = {
  ...ObjectView.types,
  date(field) {
    return DateView;
  },
};

const ViewWithDate = ObjectViewMixin({
  $id: 'ViewWithDate',
  type: 'object',
  properties: {
    a: { type: 'date' },
  },
}, View);
const date = ViewWithDate.from({ a: new Date(0) });
date.get('a')
//=> Thu Jan 01 1970 00:00:00 GMT+0000
date.set('a', new Date(1e8));
date.toJSON();
//=> { a: Fri Jan 02 1970 03:46:40 GMT+0000 }
```

#### ArrayView
DataView based array of "views": objects, number, strings, etc:
```javascript
const { ObjectViewMixin, ArrayViewMixin, StringView } = require('structurae');

const Int32ArrayView = ArrayViewMixin('int32', true); // create an ArrayView class for int32 values with little endian encoding
const Int32ArrayViewBE = ArrayViewMixin('int32', false); // big endian int32 values
const StringsView = ArrayViewMixin(StringView, 20); // an ArrayView class for strings with maximum length of 20 bytes each

const Person = ObjectViewMixin({
  $id: 'Person', // each object requires a unique id
  type: 'object',
  properties: {
    id: { type: 'integer', btype: 'uint32' },
    name: { type: 'string', maxLength: 10 },
  },
});

// an array class for Person objects
const PeopleArray = ArrayViewMixin(Person);

// create an empty array view of 10 Person objects
const people = PeopleArray.of(10);

// create an array view from a given array
const hitchhikers = PeopleArray.from([
  { id: 1, name: 'Arthur' },
  { id: 2, name: 'Ford' },
]);
// get a view of the first object
hitchhikers.getView(0);
//=> Person [14]
// get the value of the first object
hitchhikers.get(0);
//=> { id: 1, name: 'Arthur' }

// set the first object data
hitchhikers.set(0, { id: 3, name: 'Trillian' });
hitchhikers.get(0);
//=> { id: 3, name: 'Trillian' }

hitchhikers.toJSON();
//=> [{ id: 1, name: 'Arthur' }, { id: 2, name: 'Ford' }]
```

TypedArrays in JavaScript have two limitations that make them cumbersome to use in conjunction with DataView.
First, there is no way to specify the endianness of numbers in TypedArrays unlike DataView.
Second, TypedArrays require their offset (byteOffset) to be a multiple of their element size (BYTES_PER_ELEMENT), 
which means that they often cannot "view" into existing ArrayBuffer starting from certain positions.
ArrayViews for numbers are essentially TypedArrays that circumvent both issues by using the DataView interface.
You can specify endianness and instantiate them at any position in an existing ArrayBuffer.

```javascript
const { ArrayViewMixin } = require('structurae');

// create a class for little endian doubles
const Float64View = ArrayViewMixin('float64', true);
const buffer = new ArrayBuffer(11);
const doubles = new Float64View(buffer, 3, 8);
doubles.byteLength
//=> 20
doubles.byteOffset
//=> 3
doubles.set(0, 5).set(1, 10);
[...doubles]
//=> [5, 10]
```


#### MapView
MapView is an ObjectView that supports optional fields and fields of variable size. The size and layout of each MapView instance 
is calculated upon creation and stored within the instance (unlike ObjectViews, where each instance have the same size and layout).
MapViews are useful for densely packing objects and arrays whose size my vary greatly.
There is a limitation, though, since ArrayBuffers cannot be resized, optional fields that were absent upon creation of a map view cannot be set later, and those set cannot be resized.

```javascript
const { MapViewMixin } = require('structurae');

const Person = MapViewMixin({
  $id: 'Person',
  type: 'object',
  properties: {
    id: { type: 'integer', btype: 'uint32', default: 10 },
    // notice that maxLength is not required for optional fields in MapView
    // however, if set, MapView with truncate longer strings to fit the maxLength
    name: { type: 'string' },
    pets: {
      type: 'array',
      // maxItems is also not required for MapView
      // if set, MapView truncate arrays exceeding the specified maximum
      items: {
        $id: 'Pet',
        type: 'object',
        properties: {
          // however both maxLengh and maxItems are required in nested objects and arrays
          type: { type: 'string', maxLength: 10 } 
        },
      },
    },
  },
  // required fields are always present and can have default values
  required: ['id'],  
});

const person0 = Person.from({});
person.get('id')
//=> 10
person.get('name')
//=> name

// create a person with one pet
const person1 = Person.from({ id: 1, name: 'Artur', pets: [{ type: 'dog'}] });
person1.byteLength;
//=> 31

// create a person with no pets
const person0 = PersonWithPets.from({ id: 1, name: 'Artur'});
person0.byteLength;
//=> 18
person0.get('pets');
//=> undefined
person0.set('pets', [{ type: 'dog'}]);
person0.get('pets');
//=> undefined
```

For performance reasons, MapView uses a single buffer for serialization, thus, limiting the maximum size of a view.
By default the size is 8192 bytes, if you expect bigger views, please set the desired size in `MapView.maxLength`.

#### StringView
Encoding API (available both in modern browsers and Node.js) allows us to convert JavaScript strings to 
(and from) UTF-8 encoded stream of bytes represented by a Uint8Array. StringView extends Uint8Array with string related methods
 and relies on Encoding API internally for conversions.
You can use `StringView.fromString` to create an encoded string, and `StringView#toString` to convert it back to a string:
```javascript
const { StringView } = require('structurae');

const stringView = StringView.from('abc😀a');
//=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
stringView.toString();
//=> 'abc😀a'
stringView == 'abc😀a';
//=> true
```

While the array itself holds code points, StringView provides methods to operate on characters of the underlying string:
```javascript
const stringView = StringView.from('abc😀');
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
const stringView = StringView.from('abc😀a');
const searchValue = StringView.from('😀');
stringView.search(searchValue); // equivalent of String#indexOf
//=> 3

const replacement = StringView.from('d');
stringView.replace(searchValue, replacement).toString();
//=> 'abcda'

stringView.reverse().toString();
//=> 'adcba'
```

#### BinaryProtocol
When transferring our buffers encoded with views we can often rely on meta information to know what kind of ObjectView
to use in order to decode a received buffer, e.g. let's say we have a `HouseView` class to encode/decode all buffers
that go through `/houses` route. However, sometimes we need our ObjectViews to carry within themselves an information
as to what kind of ObjectView was used to encode them. To do that, we can prepend or tag each view with a value indicating its
class, i.e. add a field that defaults to a certain value for each view class. Now upon receiving a buffer we can read that field
using the DataView and convert it into an appropriate view. The `BinaryProtocol` does all that under the hood serving as a helper class
to remove boilerplate, plus it creates the necessary ObjectView classes from schemas for when we are not concerned too much about individual
classes:

```javascript
const { BinaryProtocol } = require('structurae');

const protocol = new BinaryProtocol({
  0: {
    $id: 'Person',
    type: 'object',
    properties: {
      age: { type: 'integer', btype: 'int8' },
      name: { type: 'string', length: 10 },
    }
  },
  1: {
    $id: 'Items',
    type: 'object',
    properties: {
      id: { type: 'integer', btype: 'uint32' },
      items: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string', maxLength: 10 },
      },
    },
  },
});

const person = protocol.encode({ tag: 0, age: 100, name: 'abc' });
//=> ObjectView (12)
protocol.decode(person.buffer)
//=> { tag: 0, age: 100, name: 'abc' }
const personView = protocol.view(person.buffer);
personView.get('age');
//=> 100
const item = protocol.encode({ tag: 1, id: 10, items: ['a', 'b', 'c'] });
//=> ObjectView (35)
protocol.decode(item.buffer)
//=> { tag: 1, id: 10, items: ['a', 'b', 'c'] }
```

We can use references to existing ObjectViews, however, those views should have a tag field and appropriate default value specified.
```javascript
const View = ObjectViewMixin({
    $id: 'Items',
    type: 'object',
    properties: {
      tag: { type: 'integer', btype: 'uint8', default: 1 },
      id: { type: 'integer', btype: 'uint32' },
      items: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string', maxLength: 10 },
      },
    },
});

const protocol = new BinaryProtocol({
  0: {
    $id: 'Person',
    type: 'object',
    properties: {
      age: { type: 'integer', btype: 'int8' },
      name: { type: 'string', length: 10 },
    }
  },
  1: { $ref: '#Items' },
});
```

By default, the tag field is named `tag` and has the type of `uint8`, both can be changed and provided as second and third parameters to protocol constructor.
```javascript
const View = ObjectViewMixin({
    $id: 'Items',
    type: 'object',
    properties: {
      tagId: { type: 'integer', btype: 'uint32', default: 1 },
      id: { type: 'integer', btype: 'uint32' },
      items: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string', maxLength: 10 },
      },
    },
});

const protocol = new BinaryProtocol({
  0: {
    $id: 'Person',
    type: 'object',
    properties: {
      age: { type: 'integer', btype: 'int8' },
      name: { type: 'string', length: 10 },
    }
  },
  1: { $ref: '#Items' },
}, 'tagId', 'uint32');
```

### Bit Structures
#### BitField & BigBitField
BitField and BigBitField use JavaScript Numbers and BigInts respectively as bitfields to store and operate on data using bitwise operations.
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

You can extend BitField or BigBitField directly or use BitFieldMixin with your own schema by specifying field names and their respective sizes in bits:
```javascript
const Field = BitFieldMixin({ width: 8, height: 8 });
const field = new Field({ width: 100, height: 200 });
field.get('width');
//=> 100;
field.get('height');
//=> 200
field.set('width', 18);
field.get('width');
//=> 18
field.toObject();
//=> { width: 18, height: 200 }
```

You can forgo specifying sizes if your field size is 1 bit:
```javascript
const Privileges = BitFieldMixin(['user', 'moderator', 'administrator']);
const privileges = new Privileges(0);
privileges.set('user').set('moderator');
privileges.has('user', 'moderator');
//=> true
privileges.set('moderator', 0).has('moderator');
//=> false
```

If the total size of your fields exceeds 31 bits, BitFieldMixin will switch to BigBitField that internally uses
a BigInt to represent the resulting number, however, you can still use normal numbers to set each field
and get their value as a number as well:
```javascript
const LargeField = BitFieldMixin({ width: 20, height: 20 });
const largeField = new LargeField([1048576, 1048576]);
largeField.value
//=> 1099512676352n
largeField.set('width', 1000).get('width')
//=> 1000
```

If you have to add more fields to your schema later on, you do not have to re-encode your existing values, just add new fields 
at the end of your new schema:

```javascript
const OldField = BitFieldMixin({ width: 8, height: 8 });
const oldField = OldField.encode([20, 1]);
//=> oldField === 276

const NewField = BitFieldMixin({ width: 8, height: 8, area: 10 });
const newField = new NewField(oldField);
newField.get('width');
//=> 20
newField.get('height');
//=> 1
newField.set('weight', 100).get('weight');
//=> 100
```

If you only want to encode or decode a set of field values without creating an instance, you can do so by using static methods
`BitField.encode` and `BitField.decode` respectively:
```javascript
const Field = BitFieldMixin({ width: 7, height: 1 })

Field.encode([20, 1]);
//=> 41

Field.encode({ height: 1, width: 20 });
//=> 41

Field.decode(41);
//=> { width: 20, height: 1 }
```

If you don't know beforehand how many bits you need for your field, you can call `BitField.getMinSize` with the maximum
possible value of your field to find out:
```javascript
BitField.getMinSize(100);
//=> 7
const Field = BitFieldMixin({ width: BitField.getMinSize(250), height: 8 });
```

For performance sake, BitField doesn't check the size of values being set and setting values that exceed the specified
field size will lead to undefined behavior. If you want to check whether values fit their respective fields, you can use `BitField.isValid`:
```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });

Field.isValid({ width: 100 });
//=> true
Field.isValid({ width: 100, height: 3 });
//=> false
```

`BitField#match` (and its static variation `BitField.match`) can be used to check values of multiple fields at once:
```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });
const field = new Field([20, 1]);
field.match({ width: 20 });
//=> true
field.match({ height: 1, width: 20 });
//=> true
field.match({ height: 1, width: 19 });
//=> false
Field.match(field.valueOf(), { height: 1, width: 20 });
//=> true
```

If you have to check multiple BitField instances for the same values, create a special matcher with `BitField.getMatcher`
and use it in the match method, that way each check will require only one bitwise operation and a comparison:
```javascript
const Field = BitFieldMixin({ width: 7, height: 1 });
const matcher = Field.getMatcher({ height: 1, width: 20 });
Field.match(new Field([20, 1]).valueOf(), matcher);
//=> true
Field.match(new Field([19, 1]).valueOf(), matcher);
//=> false
```

#### BitArray
BitArray uses Uint32Array as an array or vector of bits. It's a simpler version of BitField that only sets and checks individual bits:

```javascript
const array = new BitArray(10);
array.getBit(0)
//=> 0
array.setBit(0).getBit(0);
//=> 1
array.size
//=> 10
array.length
//=> 1
```

BitArray is the base class for [Pool](https://github.com/zandaqo/structurae#Pool) and [RankedBitArray](https://github.com/zandaqo/structurae#RankedBitArray) classes. 
It's useful in cases where one needs more bits than can be stored in a number, but doesn't want to use BigInts as it is done by [BitField](https://github.com/zandaqo/structurae#BitField).

#### Pool
Implements a fast algorithm to manage availability of objects in an object pool using a BitArray.
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

#### RankedBitArray
RankedBitArray is an extension of BitArray with methods to efficiently calculate rank and select. 
The rank is calculated in constant time where as select has O(logN) time complexity.
This is often used as a basic element in implementing succinct data structures.

```javascript
const array = new RankedBitArray(10);
array.setBit(1).setBit(3).setBit(7);
array.rank(2);
//=> 1
array.rank(7);
//=> 2
array.select(2);
//=> 3
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
weightedGraph.getEdge(0, 1);
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
weightedGraph.getEdge(1, 0);
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

## License
MIT © [Maga D. Zandaqo](http://maga.name)