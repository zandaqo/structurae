## Classes

<dl>
<dt><a href="#ArrayView">ArrayView</a> ⇐ <code>DataView</code></dt>
<dd><p>An array of ObjectViews. Uses DataView to operate on an array of JavaScript objects
stored in an ArrayBuffer.</p>
</dd>
<dt><a href="#BigBitField">BigBitField</a></dt>
<dd><p>Stores and operates on data in BigInts treating them as bitfields.</p>
<p>// a bitfield that holds three integers of 32, 16, and 8 bits
class Field extends BigBitField {}
Field.schema = {
  area: 32,
  width: 16,
  height: 8,
};
Field.initialize();</p>
<p>// same using BitFieldMixin
const Field = BitFieldMixin({ area: 32, width: 16, height: 8 });</p>
</dd>
<dt><a href="#BinaryGrid">BinaryGrid</a> ⇐ <code>Uint16Array</code></dt>
<dd><p>Implements a grid or 2D matrix of bits.</p>
</dd>
<dt><a href="#BinaryHeap">BinaryHeap</a> ⇐ <code>Array</code></dt>
<dd><p>Extends Array to implement the Binary Heap data structure.</p>
</dd>
<dt><a href="#BinaryProtocol">BinaryProtocol</a></dt>
<dd><p>A helper class that simplifies defining and operating on multiple tagged ObjectViews.
The protocol instance tags each of its views with a numerical value (by default Uint8) as the first field
and uses it to convert data from objects to views and back.</p>
</dd>
<dt><a href="#BitArray">BitArray</a> ⇐ <code>Uint32Array</code></dt>
<dd><p>Uses Uint32Array as a vector or array of bits.</p>
</dd>
<dt><a href="#BitField">BitField</a></dt>
<dd><p>Stores and operates on data in Numbers treating them as bitfields.</p>
</dd>
<dt><a href="#CollectionView">CollectionView</a> ⇐ <code>DataView</code></dt>
<dd></dd>
<dt><a href="#Graph">Graph</a> ⇐ <code><a href="#AdjacencyStructure">AdjacencyStructure</a></code></dt>
<dd><p>Extends an adjacency list/matrix structure and provides methods for traversal (BFS, DFS),
pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.</p>
</dd>
<dt><a href="#Grid">Grid</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd><p>Extends built-in indexed collections to handle 2 dimensional data.</p>
</dd>
<dt><a href="#ObjectView">ObjectView</a> ⇐ <code>DataView</code></dt>
<dd><p>A DataView based C-like struct to store JavaScript objects in ArrayBuffer.</p>
</dd>
<dt><a href="#Pool">Pool</a> ⇐ <code><a href="#BitArray">BitArray</a></code></dt>
<dd><p>Manages availability of objects in object pools.</p>
</dd>
<dt><a href="#RankedBitArray">RankedBitArray</a> ⇐ <code><a href="#BitArray">BitArray</a></code></dt>
<dd><p>A bit array that supports constant time rank and O(logN) time select operations.</p>
</dd>
<dt><a href="#SortedArray">SortedArray</a> ⇐ <code><a href="#SortedCollection">SortedCollection</a></code></dt>
<dd><p>Extends Array to handle sorted data.</p>
</dd>
<dt><a href="#SortedCollection">SortedCollection</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd><p>Extends TypedArrays  to handle sorted data.</p>
</dd>
<dt><a href="#StringView">StringView</a> ⇐ <code>Uint8Array</code></dt>
<dd><p>Extends Uint8Array to handle C-like representation of UTF-8 encoded strings.</p>
</dd>
<dt><a href="#SymmetricGrid">SymmetricGrid</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd><p>A grid to handle symmetric or triangular matrices
using half the space required for a normal grid.</p>
</dd>
<dt><a href="#TypedArrayView">TypedArrayView</a> ⇐ <code>DataView</code></dt>
<dd><p>A DataView based TypedArray that supports endianness and can be set at any offset.</p>
</dd>
<dt><a href="#UnweightedAdjacencyList">UnweightedAdjacencyList</a> ⇐ <code>Uint32Array</code></dt>
<dd><p>Implements Adjacency List data structure for unweighted graphs.</p>
</dd>
<dt><a href="#UnweightedAdjacencyMatrix">UnweightedAdjacencyMatrix</a> ⇐ <code><a href="#BinaryGrid">BinaryGrid</a></code></dt>
<dd><p>Implements Adjacency Matrix for unweighted graphs.</p>
</dd>
<dt><a href="#WeightedAdjacencyList">WeightedAdjacencyList</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd><p>Implements Adjacency List data structure for weighted graphs.</p>
</dd>
<dt><a href="#WeightedAdjacencyMatrix">WeightedAdjacencyMatrix</a> ⇐ <code><a href="#Grid">Grid</a></code></dt>
<dd><p>Implements Adjacency Matrix for weighted graphs.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#ArrayViewMixin">ArrayViewMixin(ObjectViewClass, [itemLength])</a> ⇒ <code><a href="#ArrayView">Class.&lt;ArrayView&gt;</a></code></dt>
<dd><p>Creates an ArrayView class for a given ObjectView class.</p>
</dd>
<dt><a href="#BitFieldMixin">BitFieldMixin(schema, [BitFieldClass])</a> ⇒ <code><a href="#BitField">Class.&lt;BitField&gt;</a></code> | <code><a href="#BigBitField">Class.&lt;BigBitField&gt;</a></code></dt>
<dd><p>Creates a BitField or BigBitField class with a given schema.</p>
</dd>
<dt><a href="#GraphMixin">GraphMixin(Base, [undirected])</a> ⇒ <code><a href="#Graph">Graph</a></code></dt>
<dd><p>Creates a Graph class extending a given adjacency structure.</p>
</dd>
<dt><a href="#GridMixin">GridMixin(Base)</a> ⇒ <code><a href="#Grid">Grid</a></code></dt>
<dd><p>Creates a Grid class extending a given Array-like class.</p>
</dd>
<dt><a href="#ObjectViewMixin">ObjectViewMixin(schema, [ObjectViewClass])</a> ⇒ <code><a href="#ObjectView">Class.&lt;ObjectView&gt;</a></code></dt>
<dd><p>Creates an ObjectView class with a given schema.</p>
</dd>
<dt><a href="#Comparator">Comparator(a, b)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#SortedMixin">SortedMixin(Base)</a> ⇒ <code><a href="#SortedCollection">SortedCollection</a></code></dt>
<dd><p>Creates a SortedCollection class extending a given Array-like class.</p>
</dd>
<dt><a href="#SymmetricGridMixin">SymmetricGridMixin(Base)</a> ⇒ <code><a href="#SymmetricGrid">SymmetricGrid</a></code></dt>
<dd><p>Creates a SymmetricGrid class extending a given Array-like class.</p>
</dd>
<dt><a href="#TypedArrayViewMixin">TypedArrayViewMixin(type, [littleEndian])</a> ⇒ <code>Class.&lt;Base&gt;</code></dt>
<dd></dd>
<dt><a href="#popCount32">popCount32(value)</a> ⇒ <code>number</code></dt>
<dd><p>Counts set bits in a given number.</p>
</dd>
<dt><a href="#getLSBIndex">getLSBIndex(value)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the index of the Least Significant Bit in a number.</p>
</dd>
<dt><a href="#getBitSize">getBitSize(number)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the minimum amount of bits necessary to hold a given number.</p>
</dd>
<dt><a href="#WeightedAdjacencyListMixin">WeightedAdjacencyListMixin(Base)</a> ⇒ <code><a href="#WeightedAdjacencyList">WeightedAdjacencyList</a></code></dt>
<dd><p>Creates a WeightedAdjacencyList class extending a given TypedArray class.</p>
</dd>
<dt><a href="#WeightedAdjacencyMatrixMixin">WeightedAdjacencyMatrixMixin(Base, [undirected])</a> ⇒ <code><a href="#WeightedAdjacencyMatrix">WeightedAdjacencyMatrix</a></code></dt>
<dd><p>Creates a WeightedAdjacencyMatrix class extending a given Array-like class.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BitCoordinates">BitCoordinates</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AdjacencyStructure">AdjacencyStructure</a> : <code><a href="#UnweightedAdjacencyList">UnweightedAdjacencyList</a></code> | <code><a href="#UnweightedAdjacencyMatrix">UnweightedAdjacencyMatrix</a></code> | <code><a href="#WeightedAdjacencyList">WeightedAdjacencyList</a></code> | <code><a href="#WeightedAdjacencyMatrix">WeightedAdjacencyMatrix</a></code></dt>
<dd></dd>
<dt><a href="#TypedArrayConstructor">TypedArrayConstructor</a> : <code>Int8ArrayConstructor</code> | <code>Int8ArrayConstructor</code> | <code>Uint8ArrayConstructor</code> | <code>Uint8ClampedArrayConstructor</code> | <code>Int16ArrayConstructor</code> | <code>Uint16ArrayConstructor</code> | <code>Int32ArrayConstructor</code> | <code>Uint32ArrayConstructor</code> | <code>Float32ArrayConstructor</code> | <code>Float64ArrayConstructor</code></dt>
<dd></dd>
<dt><a href="#CollectionConstructor">CollectionConstructor</a> : <code>ArrayConstructor</code> | <code><a href="#TypedArrayConstructor">TypedArrayConstructor</a></code></dt>
<dd></dd>
<dt><a href="#TypedArray">TypedArray</a> : <code>Int8Array</code> | <code>Uint8Array</code> | <code>Uint8ClampedArray</code> | <code>Int16Array</code> | <code>Uint16Array</code> | <code>Int32Array</code> | <code>Uint32Array</code> | <code>Float32Array</code> | <code>Float64Array</code></dt>
<dd></dd>
<dt><a href="#Collection">Collection</a> : <code>Array</code> | <code><a href="#TypedArray">TypedArray</a></code></dt>
<dd></dd>
<dt><a href="#Coordinates">Coordinates</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ViewType">ViewType</a> : <code><a href="#ArrayView">Class.&lt;ArrayView&gt;</a></code> | <code><a href="#ObjectView">Class.&lt;ObjectView&gt;</a></code> | <code><a href="#TypedArrayView">Class.&lt;TypedArrayView&gt;</a></code> | <code><a href="#StringView">Class.&lt;StringView&gt;</a></code></dt>
<dd></dd>
<dt><a href="#View">View</a> : <code><a href="#ArrayView">ArrayView</a></code> | <code><a href="#ObjectView">ObjectView</a></code> | <code><a href="#TypedArrayView">TypedArrayView</a></code> | <code><a href="#StringView">StringView</a></code></dt>
<dd></dd>
<dt><a href="#PrimitiveFieldType">PrimitiveFieldType</a> : <code>&#x27;int8&#x27;</code> | <code>&#x27;uint8&#x27;</code> | <code>&#x27;int16&#x27;</code> | <code>&#x27;uint16&#x27;</code> | <code>&#x27;int32&#x27;</code> | <code>&#x27;uint32&#x27;</code> | <code>&#x27;float32&#x27;</code> | <code>&#x27;float64&#x27;</code> | <code>&#x27;bigint64&#x27;</code> | <code>&#x27;biguint64&#x27;</code></dt>
<dd></dd>
<dt><a href="#ObjectViewFieldType">ObjectViewFieldType</a> : <code><a href="#PrimitiveFieldType">PrimitiveFieldType</a></code> | <code>string</code> | <code><a href="#ViewType">ViewType</a></code></dt>
<dd></dd>
<dt><a href="#ObjectViewField">ObjectViewField</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ObjectViewSchema">ObjectViewSchema</a> : <code>Object.&lt;string, ObjectViewField&gt;</code></dt>
<dd></dd>
<dt><a href="#ObjectViewTypeDefs">ObjectViewTypeDefs</a> : <code>Object.&lt;string, function()&gt;</code></dt>
<dd></dd>
</dl>

<a name="ArrayView"></a>

## ArrayView ⇐ <code>DataView</code>
An array of ObjectViews. Uses DataView to operate on an array of JavaScript objects
stored in an ArrayBuffer.

**Kind**: global class  
**Extends**: <code>DataView</code>  

* [ArrayView](#ArrayView) ⇐ <code>DataView</code>
    * _instance_
        * [.size](#ArrayView+size) : <code>number</code>
        * [.get(index)](#ArrayView+get) ⇒ [<code>ObjectView</code>](#ObjectView)
        * [.getValue(index)](#ArrayView+getValue) ⇒ <code>Object</code>
        * [.set(index, value)](#ArrayView+set) ⇒ [<code>ArrayView</code>](#ArrayView)
        * [.setView(index, value)](#ArrayView+setView) ⇒ [<code>ArrayView</code>](#ArrayView)
        * [.toJSON()](#ArrayView+toJSON) ⇒ <code>Array.&lt;Object&gt;</code>
    * _static_
        * [.itemLength](#ArrayView.itemLength) : <code>number</code>
        * [.View](#ArrayView.View) : [<code>ObjectView</code>](#ObjectView)
        * [.from(value, [array])](#ArrayView.from) ⇒ [<code>ArrayView</code>](#ArrayView)
        * [.getLength(size)](#ArrayView.getLength) ⇒ <code>number</code>
        * [.of(size)](#ArrayView.of) ⇒ [<code>ArrayView</code>](#ArrayView)

<a name="ArrayView+size"></a>

### arrayView.size : <code>number</code>
Returns the amount of available objects in the array.

**Kind**: instance property of [<code>ArrayView</code>](#ArrayView)  
<a name="ArrayView+get"></a>

### arrayView.get(index) ⇒ [<code>ObjectView</code>](#ObjectView)
Returns an object view at a given index.

**Kind**: instance method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="ArrayView+getValue"></a>

### arrayView.getValue(index) ⇒ <code>Object</code>
Returns an object at a given index.

**Kind**: instance method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="ArrayView+set"></a>

### arrayView.set(index, value) ⇒ [<code>ArrayView</code>](#ArrayView)
Sets an object at a given index.

**Kind**: instance method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| value | <code>Object</code> | 

<a name="ArrayView+setView"></a>

### arrayView.setView(index, value) ⇒ [<code>ArrayView</code>](#ArrayView)
Sets an object view at a given index.

**Kind**: instance method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| value | [<code>ObjectView</code>](#ObjectView) | 

<a name="ArrayView+toJSON"></a>

### arrayView.toJSON() ⇒ <code>Array.&lt;Object&gt;</code>
Returns an array representation of the array view.

**Kind**: instance method of [<code>ArrayView</code>](#ArrayView)  
<a name="ArrayView.itemLength"></a>

### ArrayView.itemLength : <code>number</code>
**Kind**: static property of [<code>ArrayView</code>](#ArrayView)  
<a name="ArrayView.View"></a>

### ArrayView.View : [<code>ObjectView</code>](#ObjectView)
**Kind**: static property of [<code>ArrayView</code>](#ArrayView)  
<a name="ArrayView.from"></a>

### ArrayView.from(value, [array]) ⇒ [<code>ArrayView</code>](#ArrayView)
Creates an array view from a given array of objects.

**Kind**: static method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| value | <code>ArrayLike.&lt;Object&gt;</code> | 
| [array] | [<code>ArrayView</code>](#ArrayView) | 

<a name="ArrayView.getLength"></a>

### ArrayView.getLength(size) ⇒ <code>number</code>
Returns the byte length of an array view to hold a given amount of objects.

**Kind**: static method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

<a name="ArrayView.of"></a>

### ArrayView.of(size) ⇒ [<code>ArrayView</code>](#ArrayView)
Creates an empty array view of specified size.

**Kind**: static method of [<code>ArrayView</code>](#ArrayView)  

| Param | Type | Default |
| --- | --- | --- |
| size | <code>number</code> | <code>1</code> | 

<a name="BigBitField"></a>

## BigBitField
Stores and operates on data in BigInts treating them as bitfields.

// a bitfield that holds three integers of 32, 16, and 8 bits
class Field extends BigBitField {}
Field.schema = {
  area: 32,
  width: 16,
  height: 8,
};
Field.initialize();

// same using BitFieldMixin
const Field = BitFieldMixin({ area: 32, width: 16, height: 8 });

**Kind**: global class  

* [BigBitField](#BigBitField)
    * [new BigBitField([data])](#new_BigBitField_new)
    * _instance_
        * [.get(field)](#BigBitField+get) ⇒ <code>number</code>
        * [.set(field, value)](#BigBitField+set) ⇒ [<code>BigBitField</code>](#BigBitField)
        * [.has(...fields)](#BigBitField+has) ⇒ <code>boolean</code>
        * [.match(matcher)](#BigBitField+match) ⇒ <code>boolean</code>
        * [.toJSON()](#BigBitField+toJSON) ⇒ <code>bigint</code>
        * [.toObject()](#BigBitField+toObject) ⇒ <code>Object.&lt;string, number&gt;</code>
        * [.toString()](#BigBitField+toString) ⇒ <code>string</code>
        * [.valueOf()](#BigBitField+valueOf) ⇒ <code>bigint</code>
    * _static_
        * [.encode(data)](#BigBitField.encode) ⇒ <code>bigint</code>
        * [.decode(data)](#BigBitField.decode) ⇒ <code>Object.&lt;string, number&gt;</code>
        * [.isValid(data)](#BigBitField.isValid) ⇒ <code>boolean</code>
        * [.getMinSize(number)](#BigBitField.getMinSize) ⇒ <code>number</code>
        * [.initialize()](#BigBitField.initialize) ⇒ <code>void</code>
        * [.getMatcher(matcher)](#BigBitField.getMatcher) ⇒ <code>Array.&lt;bigint&gt;</code>
        * [.match(value, matcher)](#BigBitField.match) ⇒ <code>boolean</code>

<a name="new_BigBitField_new"></a>

### new BigBitField([data])

| Param | Type | Default |
| --- | --- | --- |
| [data] | <code>bigint</code> \| [<code>BigBitField</code>](#BigBitField) \| <code>Array.&lt;number&gt;</code> \| <code>Object.&lt;string, number&gt;</code> | <code>0</code> | 

**Example**  
```js
const field = new Field({ area: 100, width: 10, height: 10 });
//=> Field { value: 2814792716779620n }
field.get('width');
//=> 10;

const copy = new Field(2814792716779620n);
copy.get('width');
//=> 10
```
<a name="BigBitField+get"></a>

### bigBitField.get(field) ⇒ <code>number</code>
Returns the value of a given field.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>number</code> - value value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | name of the field |

**Example**  
```js
const field = new Field({ area: 100, width: 10, height: 10 });
//=> Field { value: 2814792716779620n }
field.get('width');
//=> 10;
field.get('area');
//=> 100;
```
<a name="BigBitField+set"></a>

### bigBitField.set(field, value) ⇒ [<code>BigBitField</code>](#BigBitField)
Stores a given value in a field.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: [<code>BigBitField</code>](#BigBitField) - the instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  | name of the field |
| value | <code>number</code> | <code>1</code> | value of the field |

**Example**  
```js
const field = new Field({ area: 100, width: 10, height: 10 });
//=> Field { value: 2814792716779620n }
field.get('width');
//=> 10;
field.set('width', 100);
field.get('width');
//=> 100;
```
<a name="BigBitField+has"></a>

### bigBitField.has(...fields) ⇒ <code>boolean</code>
Checks if an instance has all the specified fields set to 1. Useful for bit flags.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>boolean</code> - whether all the specified fields are set in the instance  

| Param | Type | Description |
| --- | --- | --- |
| ...fields | <code>string</code> \| <code>number</code> | names of the fields to check |

**Example**  
```js
const Flags = BitFieldMixin(['a', 'b', 'c']);
const settings = new Flags({ 'a': 0, 'b': 1, 'c': 1 });
settings.has('b', 'c');
//=> true
settings.has('a', 'b');
//=> false
```
<a name="BigBitField+match"></a>

### bigBitField.match(matcher) ⇒ <code>boolean</code>
Checks if the instance contains all the key-value pairs listed in matcher.
Use `BigBitField.getMatcher` to get an array of precomputed values
that you can use to efficiently compare multiple instances
to the same key-value pairs as shown in the examples below.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>boolean</code> - whether the instance matches with the provided fields  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> \| <code>Array.&lt;bigint&gt;</code> | an object with key-value pairs,                                                or an array of precomputed matcher values |

**Example**  
```js
const field = new Field({ area: 200, width: 10, height: 20 });
field.match({ height: 20 });
//=> true
field.match({ width: 10, height: 20 });
//=> true
field.match({ area: 10 });
//=> false
field.match({ width: 10, height: 10 });
//=> false

// use precomputed matcher
const matcher = BitField.getMatcher({ height: 20});
new Field({ width: 10, height: 20 }).match(matcher);
//=> true
new Field({ width: 10, height: 10 }).match(matcher);
//=> false
```
<a name="BigBitField+toJSON"></a>

### bigBitField.toJSON() ⇒ <code>bigint</code>
Returns the bigint value of an instance.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
<a name="BigBitField+toObject"></a>

### bigBitField.toObject() ⇒ <code>Object.&lt;string, number&gt;</code>
Returns the object representation of the instance,
with field names as properties with corresponding values.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - the object representation of the instance  
**Example**  
```js
const field = new Field({ area: 200, width: 10, height: 20 });
field.toObject();
//=> { area: 200, width: 10, height: 20 }
```
<a name="BigBitField+toString"></a>

### bigBitField.toString() ⇒ <code>string</code>
Returns a string representing the value of the instance.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>string</code> - a string representing the value of the instance  
<a name="BigBitField+valueOf"></a>

### bigBitField.valueOf() ⇒ <code>bigint</code>
Returns the bigint value of an instance.

**Kind**: instance method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>bigint</code> - the numerical value of the instance  
<a name="BigBitField.encode"></a>

### BigBitField.encode(data) ⇒ <code>bigint</code>
Encodes a given list of numbers into a single number according to the schema.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>bigint</code> - encoded number  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> \| <code>Object.&lt;string, number&gt;</code> | the list of numbers to encode |

**Example**  
```js
new Field({ area: 100, width: 10, height: 10 });
//=> 2814792716779620n
```
<a name="BigBitField.decode"></a>

### BigBitField.decode(data) ⇒ <code>Object.&lt;string, number&gt;</code>
Decodes an encoded number into its object representation according to the schema.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - object representation  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>bigint</code> | encoded number |

**Example**  
```js
new Field({ area: 100, width: 10, height: 10 });
//=> 2814792716779620n
Field.decode(2814792716779620n);
//=> { area: 100, width: 10, height: 10 }
```
<a name="BigBitField.isValid"></a>

### BigBitField.isValid(data) ⇒ <code>boolean</code>
Checks if a given set of values or all given pairs of field name and value
are valid according to the schema.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>boolean</code> - whether all pairs are valid  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object.&lt;string, number&gt;</code> | pairs of field name and value to check |

**Example**  
```js
Field.isValid({ area: 100000, width: 20 })
//=> true
Field.isValid({ width: 10, height: 20 })
//=> true
Field.isValid({ width: -10, height: 20 })
//=> false
Field.isValid({ width: 1000000, height: 20 });
//=> false
```
<a name="BigBitField.getMinSize"></a>

### BigBitField.getMinSize(number) ⇒ <code>number</code>
Returns the minimum amount of bits necessary to hold a given number.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>number</code> - the amount of bits  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

**Example**  
```js
BigBitField.getMinSize(100)
//=> 7

BigBitField.getMinSize(2000)
//=> 11

BigBitField.getMinSize(Number.MAX_SAFE_INTEGER)
//=> 53
```
<a name="BigBitField.initialize"></a>

### BigBitField.initialize() ⇒ <code>void</code>
Prepares the class to handle data according to its schema provided in `BigBitField.schema`.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
<a name="BigBitField.getMatcher"></a>

### BigBitField.getMatcher(matcher) ⇒ <code>Array.&lt;bigint&gt;</code>
Creates an array of values to be used as a matcher
to efficiently match against multiple instances.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  
**Returns**: <code>Array.&lt;bigint&gt;</code> - an array of precomputed values  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> | an object containing field names and their values |

**Example**  
```js
Field.getMatcher({ area: 100 });
//=> [ 100n, 72057598332895231n ]
```
<a name="BigBitField.match"></a>

### BigBitField.match(value, matcher) ⇒ <code>boolean</code>
The static version of `BigBitField#match`, matches a given value against a precomputed matcher.

**Kind**: static method of [<code>BigBitField</code>](#BigBitField)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>bigint</code> | a value to check |
| matcher | <code>Array.&lt;bigint&gt;</code> | a precomputed set of values |

**Example**  
```js
Field.match(new Field({ area: 100 }), Field.getMatcher({ area: 100}));
//=> true
Field.match(new Field({ area: 1000 }), Field.getMatcher({ area: 100}));
//=> false
```
<a name="BinaryGrid"></a>

## BinaryGrid ⇐ <code>Uint16Array</code>
Implements a grid or 2D matrix of bits.

**Kind**: global class  
**Extends**: <code>Uint16Array</code>  

* [BinaryGrid](#BinaryGrid) ⇐ <code>Uint16Array</code>
    * [new BinaryGrid([options], [...args])](#new_BinaryGrid_new)
    * _instance_
        * [.get(row, column)](#BinaryGrid+get) ⇒ <code>number</code>
        * [.set(row, [column], [value])](#BinaryGrid+set) ⇒ [<code>BinaryGrid</code>](#BinaryGrid)
    * _static_
        * [.getLength(rows, columns)](#BinaryGrid.getLength) ⇒ <code>number</code>

<a name="new_BinaryGrid_new"></a>

### new BinaryGrid([options], [...args])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.rows] | <code>number</code> | <code>1</code> | the number of rows |
| [options.columns] | <code>number</code> | <code>16</code> | the number of columns |
| [...args] | <code>\*</code> |  |  |

<a name="BinaryGrid+get"></a>

### binaryGrid.get(row, column) ⇒ <code>number</code>
Returns the value of a bit at given coordinates.

**Kind**: instance method of [<code>BinaryGrid</code>](#BinaryGrid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

<a name="BinaryGrid+set"></a>

### binaryGrid.set(row, [column], [value]) ⇒ [<code>BinaryGrid</code>](#BinaryGrid)
Sets the value of a bit at given coordinates.
Proxies to TypedArray#set if the first parameter is Array-like.

**Kind**: instance method of [<code>BinaryGrid</code>](#BinaryGrid)  

| Param | Type | Default |
| --- | --- | --- |
| row | <code>number</code> \| [<code>Collection</code>](#Collection) |  | 
| [column] | <code>number</code> |  | 
| [value] | <code>number</code> | <code>1</code> | 

<a name="BinaryGrid.getLength"></a>

### BinaryGrid.getLength(rows, columns) ⇒ <code>number</code>
Returns the length of underlying Array required to hold the grid.

**Kind**: static method of [<code>BinaryGrid</code>](#BinaryGrid)  

| Param | Type |
| --- | --- |
| rows | <code>number</code> | 
| columns | <code>number</code> | 

<a name="BinaryHeap"></a>

## BinaryHeap ⇐ <code>Array</code>
Extends Array to implement the Binary Heap data structure.

**Kind**: global class  
**Extends**: <code>Array</code>  

* [BinaryHeap](#BinaryHeap) ⇐ <code>Array</code>
    * [new BinaryHeap(...args)](#new_BinaryHeap_new)
    * _instance_
        * [.heapify()](#BinaryHeap+heapify) ⇒ [<code>BinaryHeap</code>](#BinaryHeap)
        * [.isHeap()](#BinaryHeap+isHeap) ⇒ <code>boolean</code>
        * [.left(index)](#BinaryHeap+left) ⇒ <code>\*</code>
        * [.parent(index)](#BinaryHeap+parent) ⇒ <code>\*</code>
        * [.push(...elements)](#BinaryHeap+push) ⇒ <code>number</code>
        * [.replace(element)](#BinaryHeap+replace) ⇒ <code>\*</code>
        * [.right(index)](#BinaryHeap+right) ⇒ <code>\*</code>
        * [.shift()](#BinaryHeap+shift) ⇒ <code>\*</code>
        * [.splice(...args)](#BinaryHeap+splice) ⇒ <code>Array.&lt;\*&gt;</code>
        * [.unshift(...items)](#BinaryHeap+unshift) ⇒ <code>number</code>
        * [.update(index)](#BinaryHeap+update) ⇒ <code>void</code>
    * _static_
        * [.compare(a, b)](#BinaryHeap.compare) ⇒ <code>boolean</code>
        * [.from(arrayLike, mapFn, thisArg)](#BinaryHeap.from) ⇒ [<code>SortedCollection</code>](#SortedCollection)
        * [.isHeap(heap)](#BinaryHeap.isHeap) ⇒ <code>boolean</code>
        * [.of(...elements)](#BinaryHeap.of) ⇒ [<code>SortedCollection</code>](#SortedCollection)

<a name="new_BinaryHeap_new"></a>

### new BinaryHeap(...args)

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="BinaryHeap+heapify"></a>

### binaryHeap.heapify() ⇒ [<code>BinaryHeap</code>](#BinaryHeap)
Restores the binary heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  
<a name="BinaryHeap+isHeap"></a>

### binaryHeap.isHeap() ⇒ <code>boolean</code>
Checks whether the array is a valid binary heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  
**Returns**: <code>boolean</code> - whether the array is a valid binary heap  
<a name="BinaryHeap+left"></a>

### binaryHeap.left(index) ⇒ <code>\*</code>
Returns the left child of an element at a given index.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BinaryHeap+parent"></a>

### binaryHeap.parent(index) ⇒ <code>\*</code>
Returns the parent of an element at a given index.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BinaryHeap+push"></a>

### binaryHeap.push(...elements) ⇒ <code>number</code>
Adds items to the heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| ...elements | <code>\*</code> | 

<a name="BinaryHeap+replace"></a>

### binaryHeap.replace(element) ⇒ <code>\*</code>
Returns the first (min/max) element of the heap and replaces it with a given element.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| element | <code>\*</code> | 

<a name="BinaryHeap+right"></a>

### binaryHeap.right(index) ⇒ <code>\*</code>
Returns the right child of an element at a given index.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BinaryHeap+shift"></a>

### binaryHeap.shift() ⇒ <code>\*</code>
Extracts the first element of the heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  
<a name="BinaryHeap+splice"></a>

### binaryHeap.splice(...args) ⇒ <code>Array.&lt;\*&gt;</code>
Changes elements of the heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="BinaryHeap+unshift"></a>

### binaryHeap.unshift(...items) ⇒ <code>number</code>
Adds elements to the heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| ...items | <code>\*</code> | 

<a name="BinaryHeap+update"></a>

### binaryHeap.update(index) ⇒ <code>void</code>
Updates the position of an element inside the heap.

**Kind**: instance method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BinaryHeap.compare"></a>

### BinaryHeap.compare(a, b) ⇒ <code>boolean</code>
The comparator function used by the heap.

**Kind**: static method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| a | <code>\*</code> | 
| b | <code>\*</code> | 

<a name="BinaryHeap.from"></a>

### BinaryHeap.from(arrayLike, mapFn, thisArg) ⇒ [<code>SortedCollection</code>](#SortedCollection)
Creates a new BinaryHeap from a given array-like object.

**Kind**: static method of [<code>BinaryHeap</code>](#BinaryHeap)  
**Returns**: [<code>SortedCollection</code>](#SortedCollection) - a new BinaryHeap  

| Param | Type | Description |
| --- | --- | --- |
| arrayLike | <code>\*</code> | an array-like object to convert to a heap |
| mapFn | <code>function</code> | a map function to call on every element of the array |
| thisArg | <code>Object</code> | the value to use as `this` when invoking the `mapFn` |

<a name="BinaryHeap.isHeap"></a>

### BinaryHeap.isHeap(heap) ⇒ <code>boolean</code>
Checks if a given collection is a valid binary heap.

**Kind**: static method of [<code>BinaryHeap</code>](#BinaryHeap)  

| Param | Type |
| --- | --- |
| heap | [<code>Collection</code>](#Collection) | 

<a name="BinaryHeap.of"></a>

### BinaryHeap.of(...elements) ⇒ [<code>SortedCollection</code>](#SortedCollection)
Creates a new BinaryHeap with a variable number of arguments,
regardless of number or type of the arguments.

**Kind**: static method of [<code>BinaryHeap</code>](#BinaryHeap)  
**Returns**: [<code>SortedCollection</code>](#SortedCollection) - the new BinaryHeap  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>\*</code> | the elements of which to create the heap |

<a name="BinaryProtocol"></a>

## BinaryProtocol
A helper class that simplifies defining and operating on multiple tagged ObjectViews.
The protocol instance tags each of its views with a numerical value (by default Uint8) as the first field
and uses it to convert data from objects to views and back.

**Kind**: global class  

* [BinaryProtocol](#BinaryProtocol)
    * [new BinaryProtocol(views, [tagName], [tagType])](#new_BinaryProtocol_new)
    * [.view(buffer, [offset])](#BinaryProtocol+view) ⇒ [<code>ObjectView</code>](#ObjectView)
    * [.encode(object, [arrayBuffer], [offset])](#BinaryProtocol+encode) ⇒ [<code>ObjectView</code>](#ObjectView)
    * [.decode(buffer, [offset])](#BinaryProtocol+decode) ⇒ <code>Object</code>

<a name="new_BinaryProtocol_new"></a>

### new BinaryProtocol(views, [tagName], [tagType])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| views | <code>Object.&lt;number, (object\|ObjectView)&gt;</code> |  | a hash of tag values and corresponding views or schemas |
| [tagName] | <code>string</code> | <code>&quot;tag&quot;</code> | a custom name for the tag field |
| [tagType] | <code>string</code> | <code>&quot;uint8&quot;</code> | a custom type for the tag field |

**Example**  
```js
const protocol = new BinaryProtocol({
  0: {
    age: { type: 'int8' },
    name: { type: 'string', length: 10 },
  },
  1: {
    id: { type: 'uint32' },
    items: { type: 'string', size: 3, length: 10 },
  },
});
const person = protocol.encode({ tag: 0, age: 100, name: 'abc' });
//=> ObjectView (12)
protocol.decode(person.buffer)
//=> { tag: 0, age: 100, name: 'abc' }
const item = protocol.encode({ tag: 1, id: 10, items: ['a', 'b', 'c'] });
//=> ObjectView (35)
protocol.decode(item.buffer)
//=> { tag: 1, id: 10, items: ['a', 'b', 'c'] }
```
<a name="BinaryProtocol+view"></a>

### binaryProtocol.view(buffer, [offset]) ⇒ [<code>ObjectView</code>](#ObjectView)
Creates a View instance corresponding from a given ArrayBuffer
according to its tag field information.

**Kind**: instance method of [<code>BinaryProtocol</code>](#BinaryProtocol)  

| Param | Type | Default |
| --- | --- | --- |
| buffer | <code>ArrayBuffer</code> |  | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="BinaryProtocol+encode"></a>

### binaryProtocol.encode(object, [arrayBuffer], [offset]) ⇒ [<code>ObjectView</code>](#ObjectView)
Encodes a given object into a View according to the tag information.

**Kind**: instance method of [<code>BinaryProtocol</code>](#BinaryProtocol)  

| Param | Type | Default |
| --- | --- | --- |
| object | <code>Object</code> |  | 
| [arrayBuffer] | <code>ArrayBuffer</code> |  | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="BinaryProtocol+decode"></a>

### binaryProtocol.decode(buffer, [offset]) ⇒ <code>Object</code>
Decodes a given ArrayBuffer into an object according to the tag information.

**Kind**: instance method of [<code>BinaryProtocol</code>](#BinaryProtocol)  

| Param | Type | Default |
| --- | --- | --- |
| buffer | <code>ArrayBuffer</code> |  | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="BitArray"></a>

## BitArray ⇐ <code>Uint32Array</code>
Uses Uint32Array as a vector or array of bits.

**Kind**: global class  
**Extends**: <code>Uint32Array</code>  

* [BitArray](#BitArray) ⇐ <code>Uint32Array</code>
    * [new BitArray([size], [...args])](#new_BitArray_new)
    * _instance_
        * [.size](#BitArray+size) : <code>number</code>
        * [.getBit(index)](#BitArray+getBit) ⇒ <code>number</code>
        * [.setBit(index, [value])](#BitArray+setBit) ⇒ [<code>BitArray</code>](#BitArray)
        * [.getBitPosition(index)](#BitArray+getBitPosition) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)
    * _static_
        * [.getLength(size)](#BitArray.getLength) ⇒ <code>number</code>

<a name="new_BitArray_new"></a>

### new BitArray([size], [...args])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [size] | <code>number</code> | <code>32</code> | the number of bits |
| [...args] | <code>\*</code> |  |  |

<a name="BitArray+size"></a>

### bitArray.size : <code>number</code>
Returns the amount of available bits in the array.

**Kind**: instance property of [<code>BitArray</code>](#BitArray)  
<a name="BitArray+getBit"></a>

### bitArray.getBit(index) ⇒ <code>number</code>
Returns the bit value at a given index.

**Kind**: instance method of [<code>BitArray</code>](#BitArray)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BitArray+setBit"></a>

### bitArray.setBit(index, [value]) ⇒ [<code>BitArray</code>](#BitArray)
Sets the bit value at a given index.

**Kind**: instance method of [<code>BitArray</code>](#BitArray)  

| Param | Type | Default |
| --- | --- | --- |
| index | <code>number</code> |  | 
| [value] | <code>number</code> | <code>1</code> | 

<a name="BitArray+getBitPosition"></a>

### bitArray.getBitPosition(index) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)
**Kind**: instance method of [<code>BitArray</code>](#BitArray)  
**Access**: protected  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BitArray.getLength"></a>

### BitArray.getLength(size) ⇒ <code>number</code>
Returns the length of underlying TypedArray required to hold the bit array.

**Kind**: static method of [<code>BitArray</code>](#BitArray)  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

<a name="BitField"></a>

## BitField
Stores and operates on data in Numbers treating them as bitfields.

**Kind**: global class  

* [BitField](#BitField)
    * [new BitField([data])](#new_BitField_new)
    * _instance_
        * [.get(field)](#BitField+get) ⇒ <code>number</code>
        * [.set(field, value)](#BitField+set) ⇒ [<code>BitField</code>](#BitField)
        * [.has(...fields)](#BitField+has) ⇒ <code>boolean</code>
        * [.match(matcher)](#BitField+match) ⇒ <code>boolean</code>
        * [.toJSON()](#BitField+toJSON) ⇒ <code>number</code>
        * [.toObject()](#BitField+toObject) ⇒ <code>Object.&lt;string, number&gt;</code>
        * [.toString()](#BitField+toString) ⇒ <code>string</code>
        * [.valueOf()](#BitField+valueOf) ⇒ <code>number</code>
    * _static_
        * [.schema](#BitField.schema) : <code>Object.&lt;string, number&gt;</code>
        * [.size](#BitField.size) : <code>number</code>
        * [.isInitialized](#BitField.isInitialized) : <code>boolean</code>
        * [.encode(data)](#BitField.encode) ⇒ <code>number</code>
        * [.decode(data)](#BitField.decode) ⇒ <code>Object.&lt;string, number&gt;</code>
        * [.isValid(data)](#BitField.isValid) ⇒ <code>boolean</code>
        * [.getMinSize(number)](#BitField.getMinSize) ⇒ <code>number</code>
        * [.initialize()](#BitField.initialize) ⇒ <code>void</code>
        * [.getMatcher(matcher)](#BitField.getMatcher) ⇒ <code>Array.&lt;number&gt;</code>
        * [.match(value, matcher)](#BitField.match) ⇒ <code>boolean</code>

<a name="new_BitField_new"></a>

### new BitField([data])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [data] | <code>number</code> \| [<code>BitField</code>](#BitField) \| <code>Array.&lt;number&gt;</code> \| <code>Object.&lt;string, number&gt;</code> | <code>0</code> | a single number value of the field                                        or a map of field names with their respective values |

**Example**  
```js
const field = new Field({ width: 100, height: 100 });
//=> Field { value: 25700 }
field.get('width');
//=> 100;

const copy = new Field(25700);
copy.get('width');
//=> 100
```
<a name="BitField+get"></a>

### bitField.get(field) ⇒ <code>number</code>
Returns the value of a given field.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>number</code> - value value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> \| <code>number</code> | name of the field |

**Example**  
```js
const field = new Field({ width: 100, height: 200 });
//=> Field { value: 51300 }
field.get('width');
//=> 100;
field.get('height');
//=> 200;
```
<a name="BitField+set"></a>

### bitField.set(field, value) ⇒ [<code>BitField</code>](#BitField)
Stores a given value in a field.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>BitField</code>](#BitField) - the instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> \| <code>number</code> |  | name of the field |
| value | <code>number</code> | <code>1</code> | value of the field |

**Example**  
```js
const field = new Field({ width: 100, height: 200 });
//=> Field { value: 51300 }
field.get('width');
//=> 100;
field.set('width', 50);
//=> Field { value: 51250 }
field.get('width');
//=> 50
```
<a name="BitField+has"></a>

### bitField.has(...fields) ⇒ <code>boolean</code>
Checks if an instance has all the specified fields set to 1. Useful for bit flags.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether all the specified fields are set in the instance  

| Param | Type | Description |
| --- | --- | --- |
| ...fields | <code>string</code> \| <code>number</code> | names of the fields to check |

**Example**  
```js
const Flags = BitFieldMixin(['a', 'b', 'c']);
const settings = new Flags({ 'a': 0, 'b': 1, 'c': 1 });
settings.has('b', 'c');
//=> true
settings.has('a', 'b');
//=> false
```
<a name="BitField+match"></a>

### bitField.match(matcher) ⇒ <code>boolean</code>
Checks if the instance contains all the key-value pairs listed in matcher.
Use `BitField.getMatcher` to get an array of precomputed values
that you can use to efficiently compare multiple instances
to the same key-value pairs as shown in the examples below.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether the instance matches with the provided fields  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> \| <code>Matcher</code> | an object with key-value pairs,                                                or an array of precomputed matcher values |

**Example**  
```js
const field = new Field({ width: 10, height: 20 });
field.match({ height: 20 });
//=> true
field.match({ width: 10, height: 20 });
//=> true
field.match({ width: 10 });
//=> true
field.match({ width: 10, height: 10 });
//=> false

// use precomputed matcher
const matcher = BitField.getMatcher({ height: 20});
new Field({ width: 10, height: 20 }).match(matcher);
//=> true
new Field({ width: 10, height: 10 }).match(matcher);
//=> false
```
<a name="BitField+toJSON"></a>

### bitField.toJSON() ⇒ <code>number</code>
Returns the numerical value of an instance.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
<a name="BitField+toObject"></a>

### bitField.toObject() ⇒ <code>Object.&lt;string, number&gt;</code>
Returns the object representation of the instance,
with field names as properties with corresponding values.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - the object representation of the instance  
**Example**  
```js
const field = new Field({ width: 10, height: 20 });
field.toObject();
//=> { width: 10, height: 20 }
```
<a name="BitField+toString"></a>

### bitField.toString() ⇒ <code>string</code>
Returns a string representing the value of the instance.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>string</code> - a string representing the value of the instance  
<a name="BitField+valueOf"></a>

### bitField.valueOf() ⇒ <code>number</code>
Returns the numerical value of an instance.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>number</code> - the numerical value of the instance  
<a name="BitField.schema"></a>

### BitField.schema : <code>Object.&lt;string, number&gt;</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.size"></a>

### BitField.size : <code>number</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.isInitialized"></a>

### BitField.isInitialized : <code>boolean</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.encode"></a>

### BitField.encode(data) ⇒ <code>number</code>
Encodes a given list of numbers or map of fields and their respective values
into a single number according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>number</code> - encoded number  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> \| <code>Object.&lt;string, number&gt;</code> | the list of numbers to encode |

**Example**  
```js
Field.encode({ width: 10, height: 20 })
//=> 5130
```
<a name="BitField.decode"></a>

### BitField.decode(data) ⇒ <code>Object.&lt;string, number&gt;</code>
Decodes an encoded number into its object representation according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - object representation  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>number</code> | encoded number |

**Example**  
```js
const data = Field.encode({ width: 10, height: 20 })
//=> 5130
Field.decode(5130);
//=> { width: 10, height: 20 }
```
<a name="BitField.isValid"></a>

### BitField.isValid(data) ⇒ <code>boolean</code>
Checks if a given set of values or all given pairs of field name and value
are valid according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether all pairs are valid  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object.&lt;string, number&gt;</code> | pairs of field name and value to check |

**Example**  
```js
Field.isValid({ width: 20 })
//=> true
Field.isValid({ width: 10, height: 20 })
//=> true
Field.isValid({ width: -10, height: 20 })
//=> false
Field.isValid({ width: 1000, height: 20 });
//=> false
```
<a name="BitField.getMinSize"></a>

### BitField.getMinSize(number) ⇒ <code>number</code>
Returns the minimum amount of bits necessary to hold a given number.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>number</code> - the amount of bits  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

**Example**  
```js
BitField.getMinSize(100)
//=> 7

BitField.getMinSize(2000)
//=> 11

BitField.getMinSize(Number.MAX_SAFE_INTEGER)
//=> 53
```
<a name="BitField.initialize"></a>

### BitField.initialize() ⇒ <code>void</code>
Prepares the class to handle data according to its schema provided in `BitField.schema`.

**Kind**: static method of [<code>BitField</code>](#BitField)  
<a name="BitField.getMatcher"></a>

### BitField.getMatcher(matcher) ⇒ <code>Array.&lt;number&gt;</code>
Creates an array of values to be used as a matcher
to efficiently match against multiple instances.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>Array.&lt;number&gt;</code> - an array of precomputed values  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> | an object containing field names and their values |

<a name="BitField.match"></a>

### BitField.match(value, matcher) ⇒ <code>boolean</code>
The static version of `BitField#match`, matches a given value against a precomputed matcher.

**Kind**: static method of [<code>BitField</code>](#BitField)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | a value to check |
| matcher | <code>Matcher</code> | a precomputed set of values |

**Example**  
```js
Field.match(new Field({ width: 10 }), Field.getMatcher({ width: 10 }));
//=> true
Field.match(new Field({ width: 100 }), Field.getMatcher({ width: 10}));
//=> false
```
<a name="CollectionView"></a>

## CollectionView ⇐ <code>DataView</code>
**Kind**: global class  
**Extends**: <code>DataView</code>  

* [CollectionView](#CollectionView) ⇐ <code>DataView</code>
    * _instance_
        * [.get(index)](#CollectionView+get) ⇒ [<code>View</code>](#View)
        * [.set(index, value)](#CollectionView+set) ⇒ [<code>CollectionView</code>](#CollectionView)
        * [.toJSON()](#CollectionView+toJSON) ⇒ <code>Array.&lt;Object&gt;</code>
    * _static_
        * [.schema](#CollectionView.schema) : [<code>Array.&lt;ViewType&gt;</code>](#ViewType)
        * [.from(value, [array])](#CollectionView.from) ⇒ [<code>CollectionView</code>](#CollectionView)
        * [.getLength(sizes)](#CollectionView.getLength) ⇒ <code>number</code>
        * [.of(sizes)](#CollectionView.of) ⇒ [<code>CollectionView</code>](#CollectionView)

<a name="CollectionView+get"></a>

### collectionView.get(index) ⇒ [<code>View</code>](#View)
Returns a view at a given index.

**Kind**: instance method of [<code>CollectionView</code>](#CollectionView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="CollectionView+set"></a>

### collectionView.set(index, value) ⇒ [<code>CollectionView</code>](#CollectionView)
Sets an object at a given index.

**Kind**: instance method of [<code>CollectionView</code>](#CollectionView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| value | <code>Object</code> | 

<a name="CollectionView+toJSON"></a>

### collectionView.toJSON() ⇒ <code>Array.&lt;Object&gt;</code>
Returns an array representation of the collection view.

**Kind**: instance method of [<code>CollectionView</code>](#CollectionView)  
<a name="CollectionView.schema"></a>

### CollectionView.schema : [<code>Array.&lt;ViewType&gt;</code>](#ViewType)
**Kind**: static property of [<code>CollectionView</code>](#CollectionView)  
<a name="CollectionView.from"></a>

### CollectionView.from(value, [array]) ⇒ [<code>CollectionView</code>](#CollectionView)
Creates a collection view from a given collection of objects.

**Kind**: static method of [<code>CollectionView</code>](#CollectionView)  

| Param | Type |
| --- | --- |
| value | <code>Array.&lt;Object&gt;</code> | 
| [array] | [<code>CollectionView</code>](#CollectionView) | 

<a name="CollectionView.getLength"></a>

### CollectionView.getLength(sizes) ⇒ <code>number</code>
Returns the byte length of a collection view to hold a given amount of objects.

**Kind**: static method of [<code>CollectionView</code>](#CollectionView)  

| Param | Type |
| --- | --- |
| sizes | <code>Array.&lt;number&gt;</code> | 

<a name="CollectionView.of"></a>

### CollectionView.of(sizes) ⇒ [<code>CollectionView</code>](#CollectionView)
Creates an empty collection view of specified size.

**Kind**: static method of [<code>CollectionView</code>](#CollectionView)  

| Param | Type |
| --- | --- |
| sizes | <code>Array.&lt;number&gt;</code> | 

<a name="Graph"></a>

## Graph ⇐ [<code>AdjacencyStructure</code>](#AdjacencyStructure)
Extends an adjacency list/matrix structure and provides methods for traversal (BFS, DFS),
pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.

**Kind**: global class  
**Extends**: [<code>AdjacencyStructure</code>](#AdjacencyStructure)  

* [Graph](#Graph) ⇐ [<code>AdjacencyStructure</code>](#AdjacencyStructure)
    * [new Graph(options, ...args)](#new_Graph_new)
    * [.isGray(vertex)](#Graph+isGray) ⇒ <code>boolean</code>
    * [.setGray(vertex)](#Graph+setGray) ⇒ [<code>Graph</code>](#Graph)
    * [.isBlack(vertex)](#Graph+isBlack) ⇒ <code>boolean</code>
    * [.setBlack(vertex)](#Graph+setBlack) ⇒ [<code>Graph</code>](#Graph)
    * [.traverse([isDFS], [start], [gray], [white], [black])](#Graph+traverse) ⇒ <code>Iterable.&lt;number&gt;</code>
    * [.isAcyclic()](#Graph+isAcyclic) ⇒ <code>boolean</code>
    * [.topologicalSort()](#Graph+topologicalSort) ⇒ <code>Array.&lt;number&gt;</code>
    * [.path(start, end, [isAcyclic], [isNonNegative])](#Graph+path) ⇒ <code>Array.&lt;number&gt;</code>
    * [.tree([start])](#Graph+tree) ⇒ <code>Array.&lt;number&gt;</code>

<a name="new_Graph_new"></a>

### new Graph(options, ...args)

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| options.vertices | <code>number</code> | 
| [options.edges] | <code>number</code> | 
| [options.pad] | <code>number</code> | 
| ...args | <code>\*</code> | 

<a name="Graph+isGray"></a>

### graph.isGray(vertex) ⇒ <code>boolean</code>
Checks if a vertex is entered during a traversal.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="Graph+setGray"></a>

### graph.setGray(vertex) ⇒ [<code>Graph</code>](#Graph)
Marks a vertex as entered during a traversal.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="Graph+isBlack"></a>

### graph.isBlack(vertex) ⇒ <code>boolean</code>
Checks if a vertex has been fully processed during a traversal.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="Graph+setBlack"></a>

### graph.setBlack(vertex) ⇒ [<code>Graph</code>](#Graph)
Marks a vertex as fully processed during a traversal.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="Graph+traverse"></a>

### graph.traverse([isDFS], [start], [gray], [white], [black]) ⇒ <code>Iterable.&lt;number&gt;</code>
Does a Breadth-First or Depth-First traversal of the graph.

**Kind**: instance method of [<code>Graph</code>](#Graph)  
**Returns**: <code>Iterable.&lt;number&gt;</code> - the vertex at each step  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isDFS] | <code>boolean</code> | <code>false</code> | whether to do DFS traversal, does BFS otherwise |
| [start] | <code>number</code> | <code>0</code> | the vertex to start at |
| [gray] | <code>boolean</code> | <code>true</code> | whether to return vertices upon entering |
| [white] | <code>boolean</code> | <code>false</code> | whether to return edges upon first encountering |
| [black] | <code>boolean</code> | <code>false</code> | whether to return vertices after processing |

<a name="Graph+isAcyclic"></a>

### graph.isAcyclic() ⇒ <code>boolean</code>
Checks whether the graph is acyclic.

**Kind**: instance method of [<code>Graph</code>](#Graph)  
<a name="Graph+topologicalSort"></a>

### graph.topologicalSort() ⇒ <code>Array.&lt;number&gt;</code>
Returns a list of vertexes sorted topologically.

**Kind**: instance method of [<code>Graph</code>](#Graph)  
<a name="Graph+path"></a>

### graph.path(start, end, [isAcyclic], [isNonNegative]) ⇒ <code>Array.&lt;number&gt;</code>
Returns a list of vertices along the shortest path between two given vertices.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>number</code> |  | the starting vertex |
| end | <code>number</code> |  | the ending vertex |
| [isAcyclic] | <code>boolean</code> | <code>false</code> | whether the graph is acyclic |
| [isNonNegative] | <code>boolean</code> | <code>false</code> | whether all edges are non-negative |

<a name="Graph+tree"></a>

### graph.tree([start]) ⇒ <code>Array.&lt;number&gt;</code>
Returns a minimal spanning tree of the graph.
Uses the Prim's algorithm for weighted graphs and BFS tree for unweighted graphs.

**Kind**: instance method of [<code>Graph</code>](#Graph)  

| Param | Type | Default |
| --- | --- | --- |
| [start] | <code>number</code> | <code>0</code> | 

<a name="Grid"></a>

## Grid ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
Extends built-in indexed collections to handle 2 dimensional data.

**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [Grid](#Grid) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * [new Grid([options], [...args])](#new_Grid_new)
    * _instance_
        * [.columns](#Grid+columns) ⇒ <code>void</code>
        * [.columns](#Grid+columns) : <code>number</code>
        * [.rows](#Grid+rows) : <code>number</code>
        * [.getIndex(row, column)](#Grid+getIndex) ⇒ <code>\*</code>
        * [.get(row, column)](#Grid+get) ⇒ <code>\*</code>
        * [.set(row, [column], [value])](#Grid+set) ⇒ [<code>Grid</code>](#Grid)
        * [.setArray(array, [offset])](#Grid+setArray) ⇒ <code>void</code>
        * [.getCoordinates(index)](#Grid+getCoordinates) ⇒ [<code>Coordinates</code>](#Coordinates)
        * [.toArrays([withPadding])](#Grid+toArrays) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
    * _static_
        * [.getLength(rows, columns)](#Grid.getLength) ⇒ <code>number</code>
        * [.fromArrays(arrays, [pad])](#Grid.fromArrays) ⇒ [<code>Grid</code>](#Grid)

<a name="new_Grid_new"></a>

### new Grid([options], [...args])
Passes all arguments to the Base class except if called with a special set of grid options,
in that case creates and empty grid of specified parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.rows] | <code>number</code> | <code>1</code> | the number of rows |
| [options.columns] | <code>number</code> | <code>2</code> | the number of columns |
| [options.pad] | <code>\*</code> | <code>0</code> | the initial value of cells |
| [...args] | <code>\*</code> |  |  |

**Example**  
```js
new ArrayGrid('a')
//=> ArrayGrid ['a']

new ArrayGrid(2)
//=> ArrayGrid [undefined, undefined]

new ArrayGrid({ rows: 3, columns: 2 })
//=> ArrayGrid [0, 0, 0, 0, 0, 0]

new ArrayGrid({ rows: 3, columns: 2, pad: 1 })
//=> ArrayGrid [1, 1, 1, 1, 1, 1]
```
<a name="Grid+columns"></a>

### grid.columns ⇒ <code>void</code>
Specifies the number of columns of the grid.

**Kind**: instance property of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| columns | <code>number</code> | 

<a name="Grid+columns"></a>

### grid.columns : <code>number</code>
Number of columns in the grid.

**Kind**: instance property of [<code>Grid</code>](#Grid)  
<a name="Grid+rows"></a>

### grid.rows : <code>number</code>
Number of rows in the grid.

**Kind**: instance property of [<code>Grid</code>](#Grid)  
<a name="Grid+getIndex"></a>

### grid.getIndex(row, column) ⇒ <code>\*</code>
Returns an array index of an element at given coordinates.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.get(1, 0);
//=> 2
```
<a name="Grid+get"></a>

### grid.get(row, column) ⇒ <code>\*</code>
Returns an element from given coordinates.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.get(0, 1);
//=> 3
```
<a name="Grid+set"></a>

### grid.set(row, [column], [value]) ⇒ [<code>Grid</code>](#Grid)
Sets the element at given coordinates.
Proxies to TypedArray#set if the first parameter is Array-like
and the grid is based on a TypedArray.

**Kind**: instance method of [<code>Grid</code>](#Grid)  
**Returns**: [<code>Grid</code>](#Grid) - the instance  

| Param | Type |
| --- | --- |
| row | <code>number</code> \| [<code>Collection</code>](#Collection) | 
| [column] | <code>number</code> | 
| [value] | <code>\*</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.set(0, 1, 5);
a.get(0, 1);
//=> 5
```
<a name="Grid+setArray"></a>

### grid.setArray(array, [offset]) ⇒ <code>void</code>
Implements in-place replacement of the grid elements if it's based on Array.
Proxies to TypedArray#set if the grid is based on a TypedArray.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| array | [<code>Collection</code>](#Collection) | 
| [offset] | <code>number</code> | 

<a name="Grid+getCoordinates"></a>

### grid.getCoordinates(index) ⇒ [<code>Coordinates</code>](#Coordinates)
Gets coordinates of an element at specified index.

**Kind**: instance method of [<code>Grid</code>](#Grid)  
**Returns**: [<code>Coordinates</code>](#Coordinates) - coordinates  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.getCoordinates(1);
//=> [0, 1]
a.getCoordinates(2);
//=> [1, 0]
```
<a name="Grid+toArrays"></a>

### grid.toArrays([withPadding]) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
Returns an array of arrays where each nested array correspond to a row in the grid.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [withPadding] | <code>boolean</code> | <code>false</code> | whether to remove padding from the end of the rows |

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.toArrays();
//=> [[3, 3], [3, 3], [3, 3]]
```
<a name="Grid.getLength"></a>

### Grid.getLength(rows, columns) ⇒ <code>number</code>
Returns the length of underlying Array required to hold the grid.

**Kind**: static method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| rows | <code>number</code> | 
| columns | <code>number</code> | 

<a name="Grid.fromArrays"></a>

### Grid.fromArrays(arrays, [pad]) ⇒ [<code>Grid</code>](#Grid)
Creates a grid from an array of arrays.

**Kind**: static method of [<code>Grid</code>](#Grid)  
**Returns**: [<code>Grid</code>](#Grid) - const a = ArrayGrid.from([[1, 2], [3], [4, 5, 6]])
//=> ArrayGrid [1, 2, 0, 0, 3, 0, 0, 0, 4, 5, 6, 0]
a.get(1, 0);
//=> 3
a.get(2, 1);
//=> 5  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrays | <code>Array.&lt;Array.&lt;\*&gt;&gt;</code> |  |  |
| [pad] | <code>\*</code> | <code>0</code> | the value to pad the arrays to create equal sized rows |

<a name="ObjectView"></a>

## ObjectView ⇐ <code>DataView</code>
A DataView based C-like struct to store JavaScript objects in ArrayBuffer.

**Kind**: global class  
**Extends**: <code>DataView</code>  

* [ObjectView](#ObjectView) ⇐ <code>DataView</code>
    * _instance_
        * [.get(field)](#ObjectView+get) ⇒ <code>\*</code>
        * [.getValue(field)](#ObjectView+getValue) ⇒ <code>\*</code>
        * [.getView(field)](#ObjectView+getView) ⇒ <code>\*</code>
        * [.set(field, value)](#ObjectView+set) ⇒ [<code>ObjectView</code>](#ObjectView)
        * [.setView(field, value)](#ObjectView+setView) ⇒ [<code>ObjectView</code>](#ObjectView)
        * [.toJSON()](#ObjectView+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.types](#ObjectView.types) : [<code>ObjectViewTypeDefs</code>](#ObjectViewTypeDefs)
            * [.number(field)](#ObjectView.types.number) ⇒ <code>void</code>
            * [.typedarray(field)](#ObjectView.types.typedarray) ⇒ <code>void</code>
            * [.string(field)](#ObjectView.types.string) ⇒ <code>void</code>
            * [.object(field)](#ObjectView.types.object) ⇒ <code>void</code>
            * [.array(field)](#ObjectView.types.array) ⇒ <code>void</code>
        * [.schema](#ObjectView.schema) : [<code>ObjectViewSchema</code>](#ObjectViewSchema)
        * [.isInitialized](#ObjectView.isInitialized) : <code>boolean</code>
        * [.from(object, [view])](#ObjectView.from) ⇒ [<code>ObjectView</code>](#ObjectView)
        * [.getLength()](#ObjectView.getLength) ⇒ <code>number</code>
        * [.initialize()](#ObjectView.initialize) ⇒ <code>void</code>

<a name="ObjectView+get"></a>

### objectView.get(field) ⇒ <code>\*</code>
Returns a number for primitive fields or a view for all other fields.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  
**Returns**: <code>\*</code> - value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | the name of the field |

<a name="ObjectView+getValue"></a>

### objectView.getValue(field) ⇒ <code>\*</code>
Returns the JavaScript value of a given field.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  
**Returns**: <code>\*</code> - value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | the name of the field |

<a name="ObjectView+getView"></a>

### objectView.getView(field) ⇒ <code>\*</code>
Returns a view of a given field.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  
**Returns**: <code>\*</code> - view of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | the name of the field |

<a name="ObjectView+set"></a>

### objectView.set(field, value) ⇒ [<code>ObjectView</code>](#ObjectView)
Sets a JavaScript value to a field.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | the name of the field |
| value | <code>\*</code> | the value to be set |

<a name="ObjectView+setView"></a>

### objectView.setView(field, value) ⇒ [<code>ObjectView</code>](#ObjectView)
Sets an View to a field.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | the name of the field |
| value | [<code>View</code>](#View) | the view to set |

<a name="ObjectView+toJSON"></a>

### objectView.toJSON() ⇒ <code>Object</code>
Returns an Object corresponding to the view.

**Kind**: instance method of [<code>ObjectView</code>](#ObjectView)  
<a name="ObjectView.types"></a>

### ObjectView.types : [<code>ObjectViewTypeDefs</code>](#ObjectViewTypeDefs)
**Kind**: static property of [<code>ObjectView</code>](#ObjectView)  

* [.types](#ObjectView.types) : [<code>ObjectViewTypeDefs</code>](#ObjectViewTypeDefs)
    * [.number(field)](#ObjectView.types.number) ⇒ <code>void</code>
    * [.typedarray(field)](#ObjectView.types.typedarray) ⇒ <code>void</code>
    * [.string(field)](#ObjectView.types.string) ⇒ <code>void</code>
    * [.object(field)](#ObjectView.types.object) ⇒ <code>void</code>
    * [.array(field)](#ObjectView.types.array) ⇒ <code>void</code>

<a name="ObjectView.types.number"></a>

#### types.number(field) ⇒ <code>void</code>
**Kind**: static method of [<code>types</code>](#ObjectView.types)  

| Param | Type |
| --- | --- |
| field | [<code>ObjectViewField</code>](#ObjectViewField) | 

<a name="ObjectView.types.typedarray"></a>

#### types.typedarray(field) ⇒ <code>void</code>
**Kind**: static method of [<code>types</code>](#ObjectView.types)  

| Param | Type |
| --- | --- |
| field | [<code>ObjectViewField</code>](#ObjectViewField) | 

<a name="ObjectView.types.string"></a>

#### types.string(field) ⇒ <code>void</code>
**Kind**: static method of [<code>types</code>](#ObjectView.types)  

| Param | Type |
| --- | --- |
| field | [<code>ObjectViewField</code>](#ObjectViewField) | 

<a name="ObjectView.types.object"></a>

#### types.object(field) ⇒ <code>void</code>
**Kind**: static method of [<code>types</code>](#ObjectView.types)  

| Param | Type |
| --- | --- |
| field | [<code>ObjectViewField</code>](#ObjectViewField) | 

<a name="ObjectView.types.array"></a>

#### types.array(field) ⇒ <code>void</code>
**Kind**: static method of [<code>types</code>](#ObjectView.types)  

| Param | Type |
| --- | --- |
| field | [<code>ObjectViewField</code>](#ObjectViewField) | 

<a name="ObjectView.schema"></a>

### ObjectView.schema : [<code>ObjectViewSchema</code>](#ObjectViewSchema)
**Kind**: static property of [<code>ObjectView</code>](#ObjectView)  
<a name="ObjectView.isInitialized"></a>

### ObjectView.isInitialized : <code>boolean</code>
**Kind**: static property of [<code>ObjectView</code>](#ObjectView)  
<a name="ObjectView.from"></a>

### ObjectView.from(object, [view]) ⇒ [<code>ObjectView</code>](#ObjectView)
Assigns fields of a given object to the provided view or a new object view.

**Kind**: static method of [<code>ObjectView</code>](#ObjectView)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | the object to take data from |
| [view] | [<code>ObjectView</code>](#ObjectView) | the object view to assign fields to |

<a name="ObjectView.getLength"></a>

### ObjectView.getLength() ⇒ <code>number</code>
Returns the byte length of an object view.

**Kind**: static method of [<code>ObjectView</code>](#ObjectView)  
<a name="ObjectView.initialize"></a>

### ObjectView.initialize() ⇒ <code>void</code>
Initializes the object view class.

**Kind**: static method of [<code>ObjectView</code>](#ObjectView)  
<a name="Pool"></a>

## Pool ⇐ [<code>BitArray</code>](#BitArray)
Manages availability of objects in object pools.

**Kind**: global class  
**Extends**: [<code>BitArray</code>](#BitArray)  

* [Pool](#Pool) ⇐ [<code>BitArray</code>](#BitArray)
    * [new Pool(size)](#new_Pool_new)
    * [.size](#BitArray+size) : <code>number</code>
    * [.get()](#Pool+get) ⇒ <code>number</code>
    * [.free(index)](#Pool+free) ⇒ <code>void</code>
    * [.getBit(index)](#BitArray+getBit) ⇒ <code>number</code>
    * [.setBit(index, [value])](#BitArray+setBit) ⇒ [<code>BitArray</code>](#BitArray)
    * [.getBitPosition(index)](#BitArray+getBitPosition) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)

<a name="new_Pool_new"></a>

### new Pool(size)

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | the size of the pool |

<a name="BitArray+size"></a>

### pool.size : <code>number</code>
Returns the amount of available bits in the array.

**Kind**: instance property of [<code>Pool</code>](#Pool)  
**Overrides**: [<code>size</code>](#BitArray+size)  
<a name="Pool+get"></a>

### pool.get() ⇒ <code>number</code>
Gets the next available index in the pool.

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>number</code> - the next available index  
<a name="Pool+free"></a>

### pool.free(index) ⇒ <code>void</code>
Makes a given index available.

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | index to be freed |

<a name="BitArray+getBit"></a>

### pool.getBit(index) ⇒ <code>number</code>
Returns the bit value at a given index.

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Overrides**: [<code>getBit</code>](#BitArray+getBit)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BitArray+setBit"></a>

### pool.setBit(index, [value]) ⇒ [<code>BitArray</code>](#BitArray)
Sets the bit value at a given index.

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Overrides**: [<code>setBit</code>](#BitArray+setBit)  

| Param | Type | Default |
| --- | --- | --- |
| index | <code>number</code> |  | 
| [value] | <code>number</code> | <code>1</code> | 

<a name="BitArray+getBitPosition"></a>

### pool.getBitPosition(index) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Overrides**: [<code>getBitPosition</code>](#BitArray+getBitPosition)  
**Access**: protected  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="RankedBitArray"></a>

## RankedBitArray ⇐ [<code>BitArray</code>](#BitArray)
A bit array that supports constant time rank and O(logN) time select operations.

**Kind**: global class  
**Extends**: [<code>BitArray</code>](#BitArray)  

* [RankedBitArray](#RankedBitArray) ⇐ [<code>BitArray</code>](#BitArray)
    * _instance_
        * [.size](#RankedBitArray+size) : <code>number</code>
        * [.setBit(index, [value])](#RankedBitArray+setBit) ⇒ [<code>RankedBitArray</code>](#RankedBitArray)
        * [.rank(index)](#RankedBitArray+rank) ⇒ <code>number</code>
        * [.select(index)](#RankedBitArray+select) ⇒ <code>number</code>
        * [.getBit(index)](#BitArray+getBit) ⇒ <code>number</code>
        * [.getBitPosition(index)](#BitArray+getBitPosition) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)
    * _static_
        * [.getLength(size)](#RankedBitArray.getLength) ⇒ <code>number</code>

<a name="RankedBitArray+size"></a>

### rankedBitArray.size : <code>number</code>
Returns the amount of available bits in the array.

**Kind**: instance property of [<code>RankedBitArray</code>](#RankedBitArray)  
**Overrides**: [<code>size</code>](#BitArray+size)  
<a name="RankedBitArray+setBit"></a>

### rankedBitArray.setBit(index, [value]) ⇒ [<code>RankedBitArray</code>](#RankedBitArray)
Sets the bit value at a given index.

**Kind**: instance method of [<code>RankedBitArray</code>](#RankedBitArray)  
**Overrides**: [<code>setBit</code>](#BitArray+setBit)  

| Param | Type | Default |
| --- | --- | --- |
| index | <code>number</code> |  | 
| [value] | <code>number</code> | <code>1</code> | 

<a name="RankedBitArray+rank"></a>

### rankedBitArray.rank(index) ⇒ <code>number</code>
Returns the rank of a bit at a given index.

**Kind**: instance method of [<code>RankedBitArray</code>](#RankedBitArray)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="RankedBitArray+select"></a>

### rankedBitArray.select(index) ⇒ <code>number</code>
Returns the select of a bit at a given index.

**Kind**: instance method of [<code>RankedBitArray</code>](#RankedBitArray)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BitArray+getBit"></a>

### rankedBitArray.getBit(index) ⇒ <code>number</code>
Returns the bit value at a given index.

**Kind**: instance method of [<code>RankedBitArray</code>](#RankedBitArray)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="BitArray+getBitPosition"></a>

### rankedBitArray.getBitPosition(index) ⇒ [<code>BitCoordinates</code>](#BitCoordinates)
**Kind**: instance method of [<code>RankedBitArray</code>](#RankedBitArray)  
**Access**: protected  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="RankedBitArray.getLength"></a>

### RankedBitArray.getLength(size) ⇒ <code>number</code>
Returns the length of underlying TypedArray required to hold the bit array.

**Kind**: static method of [<code>RankedBitArray</code>](#RankedBitArray)  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

<a name="SortedArray"></a>

## SortedArray ⇐ [<code>SortedCollection</code>](#SortedCollection)
Extends Array to handle sorted data.

**Kind**: global class  
**Extends**: [<code>SortedCollection</code>](#SortedCollection)  

* [SortedArray](#SortedArray) ⇐ [<code>SortedCollection</code>](#SortedCollection)
    * [.set(arr)](#SortedArray+set) ⇒ [<code>SortedArray</code>](#SortedArray)
    * [.uniquify()](#SortedArray+uniquify) ⇒ [<code>SortedArray</code>](#SortedArray)
    * [.isSorted()](#SortedCollection+isSorted) ⇒ <code>boolean</code>
    * [.isUnique()](#SortedCollection+isUnique) ⇒ <code>boolean</code>
    * [.range(start, end, [subarray])](#SortedCollection+range) ⇒ [<code>SortedCollection</code>](#SortedCollection)
    * [.rank(element)](#SortedCollection+rank) ⇒ <code>number</code>

<a name="SortedArray+set"></a>

### sortedArray.set(arr) ⇒ [<code>SortedArray</code>](#SortedArray)
Implements in-place replacement of the array elements.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  

| Param | Type | Description |
| --- | --- | --- |
| arr | [<code>Collection</code>](#Collection) | an array of new elements to use |

**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.set([1, 2, 3]);
//=> SortedArray [ 1, 2, 3 ]
```
<a name="SortedArray+uniquify"></a>

### sortedArray.uniquify() ⇒ [<code>SortedArray</code>](#SortedArray)
Removes duplicating elements from the array.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Example**  
```js
//=> SortedArray [ 2, 2, 3, 4, 5, 5, 9 ];
sortedArray.uniquify();
// => SortedArray [ 2, 3, 4, 5, 9 ]
```
<a name="SortedCollection+isSorted"></a>

### sortedArray.isSorted() ⇒ <code>boolean</code>
Checks if the array is sorted.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array is sorted  
**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.isSorted();
//=> true
sortedCollection.reverse();
sortedCollection.isSorted();
//=> false;
```
<a name="SortedCollection+isUnique"></a>

### sortedArray.isUnique() ⇒ <code>boolean</code>
Checks if the array has duplicating elements.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array has duplicating elements  
**Example**  
```js
//=> SortedCollection [ 2, 3, 3, 4, 5, 9 ];
sortedCollection.isUnique();
//=> false;
```
<a name="SortedCollection+range"></a>

### sortedArray.range(start, end, [subarray]) ⇒ [<code>SortedCollection</code>](#SortedCollection)
Returns a range of elements of the array that are greater or equal to the provided
starting element and less or equal to the provided ending element.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: [<code>SortedCollection</code>](#SortedCollection) - the resulting range of elements  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>\*</code> |  | the starting element |
| end | <code>\*</code> |  | the ending element |
| [subarray] | <code>boolean</code> | <code>false</code> | return a subarray                                   instead of copying resulting value with slice |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.range(3, 5);
// => [ 3, 4, 5 ]
sortedCollection.range(undefined, 4);
// => [ 2, 3, 4 ]
sortedCollection.range(4);
// => [ 4, 5, 8 ]
```
<a name="SortedCollection+rank"></a>

### sortedArray.rank(element) ⇒ <code>number</code>
Returns the rank of an element in the array.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the rank in the array  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | the element to look for |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.rank(1);
// => 0
sortedCollection.rank(6);
// => 4
```
<a name="SortedCollection"></a>

## SortedCollection ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
Extends TypedArrays  to handle sorted data.

**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [SortedCollection](#SortedCollection) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * _instance_
        * [.isSorted()](#SortedCollection+isSorted) ⇒ <code>boolean</code>
        * [.isUnique()](#SortedCollection+isUnique) ⇒ <code>boolean</code>
        * [.range(start, end, [subarray])](#SortedCollection+range) ⇒ [<code>SortedCollection</code>](#SortedCollection)
        * [.rank(element)](#SortedCollection+rank) ⇒ <code>number</code>
    * _static_
        * [.compare(a, b)](#SortedCollection.compare) ⇒ <code>number</code>
        * [.getDifference(a, b, [symmetric], [comparator], [container])](#SortedCollection.getDifference) ⇒ <code>Array</code>
        * [.getDifferenceScore(a, b, [symmetric], [comparator])](#SortedCollection.getDifferenceScore) ⇒ <code>number</code>
        * [.getIndex(arr, target, [comparator], [rank], [start], [end])](#SortedCollection.getIndex) ⇒ <code>number</code>
        * [.getIntersection(a, b, [comparator], [container])](#SortedCollection.getIntersection) ⇒ <code>Array</code>
        * [.getIntersectionScore(a, b, [comparator])](#SortedCollection.getIntersectionScore) ⇒ <code>number</code>
        * [.getRange(arr, [start], [end], [comparator], [subarray])](#SortedCollection.getRange) ⇒ [<code>Collection</code>](#Collection)
        * [.getUnion(a, b, [unique], [comparator], [container])](#SortedCollection.getUnion) ⇒ <code>Array</code>
        * [.getUnique(arr, [comparator], [container])](#SortedCollection.getUnique) ⇒ <code>Array</code>
        * [.isSorted(arr, [comparator])](#SortedCollection.isSorted) ⇒ <code>boolean</code>
        * [.isUnique(arr, [comparator])](#SortedCollection.isUnique) ⇒ <code>boolean</code>

<a name="SortedCollection+isSorted"></a>

### sortedCollection.isSorted() ⇒ <code>boolean</code>
Checks if the array is sorted.

**Kind**: instance method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>boolean</code> - whether the array is sorted  
**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.isSorted();
//=> true
sortedCollection.reverse();
sortedCollection.isSorted();
//=> false;
```
<a name="SortedCollection+isUnique"></a>

### sortedCollection.isUnique() ⇒ <code>boolean</code>
Checks if the array has duplicating elements.

**Kind**: instance method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>boolean</code> - whether the array has duplicating elements  
**Example**  
```js
//=> SortedCollection [ 2, 3, 3, 4, 5, 9 ];
sortedCollection.isUnique();
//=> false;
```
<a name="SortedCollection+range"></a>

### sortedCollection.range(start, end, [subarray]) ⇒ [<code>SortedCollection</code>](#SortedCollection)
Returns a range of elements of the array that are greater or equal to the provided
starting element and less or equal to the provided ending element.

**Kind**: instance method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: [<code>SortedCollection</code>](#SortedCollection) - the resulting range of elements  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>\*</code> |  | the starting element |
| end | <code>\*</code> |  | the ending element |
| [subarray] | <code>boolean</code> | <code>false</code> | return a subarray                                   instead of copying resulting value with slice |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.range(3, 5);
// => [ 3, 4, 5 ]
sortedCollection.range(undefined, 4);
// => [ 2, 3, 4 ]
sortedCollection.range(4);
// => [ 4, 5, 8 ]
```
<a name="SortedCollection+rank"></a>

### sortedCollection.rank(element) ⇒ <code>number</code>
Returns the rank of an element in the array.

**Kind**: instance method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>number</code> - the rank in the array  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | the element to look for |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.rank(1);
// => 0
sortedCollection.rank(6);
// => 4
```
<a name="SortedCollection.compare"></a>

### SortedCollection.compare(a, b) ⇒ <code>number</code>
The default comparator.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Throws**:

- <code>RangeError</code> if the comparison is unstable


| Param | Type | Description |
| --- | --- | --- |
| a | <code>\*</code> | the first value |
| b | <code>\*</code> | the second value |

<a name="SortedCollection.getDifference"></a>

### SortedCollection.getDifference(a, b, [symmetric], [comparator], [container]) ⇒ <code>Array</code>
Returns the difference of two sorted arrays,
i.e. elements present in the first array but not in the second array.
If `symmetric=true` finds the symmetric difference of two arrays, that is,
the elements that are absent in one or another array.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>Array</code> - the difference of the arrays  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | [<code>Collection</code>](#Collection) |  | the first array |
| b | [<code>Collection</code>](#Collection) |  | the second array |
| [symmetric] | <code>boolean</code> | <code>false</code> | whether to get symmetric difference. |
| [comparator] | [<code>Comparator</code>](#Comparator) |  | the comparator static used to sort the arrays |
| [container] | [<code>Collection</code>](#Collection) |  | an array-like object to hold the results |

**Example**  
```js
SortedCollection.getDifference([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 1, 3, 8 ]

// symmetric difference of sorted arrays:
SortedCollection.getDifference(first, second, true);
//=> [ 1, 3, 6, 7, 8, 9 ]
// difference using a custom comparator:
const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedCollection.getDifference([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], false, customComparator);
//=> [ 8, 3, 1 ]
```
<a name="SortedCollection.getDifferenceScore"></a>

### SortedCollection.getDifferenceScore(a, b, [symmetric], [comparator]) ⇒ <code>number</code>
Returns the amount of differing elements in the first array.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>number</code> - the amount of differing elements  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | [<code>Collection</code>](#Collection) |  | the first array |
| b | [<code>Collection</code>](#Collection) |  | the second array |
| [symmetric] | <code>boolean</code> | <code>false</code> | whether to use symmetric difference |
| [comparator] | [<code>Comparator</code>](#Comparator) |  | the comparator static used to sort the arrays |

**Example**  
```js
SortedCollection.getDifferenceScore([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> 3
```
<a name="SortedCollection.getIndex"></a>

### SortedCollection.getIndex(arr, target, [comparator], [rank], [start], [end]) ⇒ <code>number</code>
Uses binary search to find the index of an element inside a sorted array.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>number</code> - the index of the searched element or it's rank  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | [<code>Collection</code>](#Collection) |  | the array to search |
| target | <code>\*</code> |  | the target value to search for |
| [comparator] | [<code>Comparator</code>](#Comparator) |  | a custom comparator |
| [rank] | <code>boolean</code> | <code>false</code> | whether to return the element's rank if the element isn't found |
| [start] | <code>number</code> | <code>0</code> | the start position of the search |
| [end] | <code>number</code> |  | the end position of the search |

**Example**  
```js
SortedCollection.getIndex([1, 2, 3, 4, 8], 4);
//=> 3
```
<a name="SortedCollection.getIntersection"></a>

### SortedCollection.getIntersection(a, b, [comparator], [container]) ⇒ <code>Array</code>
Returns the intersection of two sorted arrays.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>Array</code> - the intersection of the arrays  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Collection</code>](#Collection) | the first array |
| b | [<code>Collection</code>](#Collection) | the second array |
| [comparator] | [<code>Comparator</code>](#Comparator) | the comparator static used to sort the arrays |
| [container] | [<code>Collection</code>](#Collection) | an array-like object to hold the results |

**Example**  
```js
SortedCollection.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 2, 4 ]

// intersection using a custom comparator:
const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedCollection.getIntersection([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], customComparator);
//=> [ 4, 2 ]
```
<a name="SortedCollection.getIntersectionScore"></a>

### SortedCollection.getIntersectionScore(a, b, [comparator]) ⇒ <code>number</code>
Returns the amount of common elements in two sorted arrays.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>number</code> - the amount of different elements  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Collection</code>](#Collection) | the first array |
| b | [<code>Collection</code>](#Collection) | the second array |
| [comparator] | [<code>Comparator</code>](#Comparator) | the comparator static used to sort the arrays |

**Example**  
```js
SortedCollection.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> 2
```
<a name="SortedCollection.getRange"></a>

### SortedCollection.getRange(arr, [start], [end], [comparator], [subarray]) ⇒ [<code>Collection</code>](#Collection)
Returns a range of elements of a sorted array from the start through the end inclusively.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: [<code>Collection</code>](#Collection) - the range of items  

| Param | Type | Description |
| --- | --- | --- |
| arr | [<code>Collection</code>](#Collection) | the array |
| [start] | <code>number</code> | the starting item |
| [end] | <code>number</code> | the ending item |
| [comparator] | [<code>Comparator</code>](#Comparator) | a custom comparator |
| [subarray] | <code>boolean</code> | return a subarray instead of copying resulting value with slice |

**Example**  
```js
SortedCollection.getRange([1, 2, 3, 4, 8], 2, 4);
//=> [ 2, 3, 4 ]

const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedCollection.getRange([8, 4, 3, 2, 1], 8, 3, customComparator);
//=> [ 8, 4, 3 ]
```
<a name="SortedCollection.getUnion"></a>

### SortedCollection.getUnion(a, b, [unique], [comparator], [container]) ⇒ <code>Array</code>
Returns the union of two sorted arrays as a sorted array.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>Array</code> - the union of the arrays  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | [<code>Collection</code>](#Collection) |  | the first array |
| b | [<code>Collection</code>](#Collection) |  | the second array |
| [unique] | <code>boolean</code> | <code>false</code> | whether to avoid duplicating items when merging unique arrays |
| [comparator] | [<code>Comparator</code>](#Comparator) |  | the comparator static used to sort the arrays |
| [container] | [<code>Collection</code>](#Collection) |  | an array-like object to hold the results |

**Example**  
```js
SortedCollection.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 1, 2, 2, 3, 4, 4, 6, 7, 8, 9 ]

// union of sorted arrays without duplicates:
SortedCollection.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9], true);
//=> [ 1, 2, 3, 4, 6, 7, 8, 9 ]

//union using a custom comparator:
SortedCollection.getUnion([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], true, customComparator);
//=> [ 9, 8, 7, 6, 4, 3, 2, 1 ]
```
<a name="SortedCollection.getUnique"></a>

### SortedCollection.getUnique(arr, [comparator], [container]) ⇒ <code>Array</code>
Returns an array of unique elements from a sorted array.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>Array</code> - the sorted array without duplicates  

| Param | Type | Description |
| --- | --- | --- |
| arr | [<code>Collection</code>](#Collection) | the sorted array |
| [comparator] | [<code>Comparator</code>](#Comparator) | a custom comparator |
| [container] | [<code>Collection</code>](#Collection) | an array-like object to hold the results |

**Example**  
```js
SortedCollection.getUnique([1, 1, 2, 2, 3, 4]);
//=> [ 1, 2, 3, 4 ]
```
<a name="SortedCollection.isSorted"></a>

### SortedCollection.isSorted(arr, [comparator]) ⇒ <code>boolean</code>
Checks whether an array is sorted according to a provided comparator.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>boolean</code> - whether the array is sorted  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array to check |
| [comparator] | [<code>Comparator</code>](#Comparator) | a custom comparator |

**Example**  
```js
SortedCollection.isSorted([1, 2, 3, 4, 8]);
//=> true
```
<a name="SortedCollection.isUnique"></a>

### SortedCollection.isUnique(arr, [comparator]) ⇒ <code>boolean</code>
Checks whether an array has any duplicating elements.

**Kind**: static method of [<code>SortedCollection</code>](#SortedCollection)  
**Returns**: <code>boolean</code> - whether the array has duplicating elements  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array to check |
| [comparator] | [<code>Comparator</code>](#Comparator) | a custom comparator |

**Example**  
```js
SortedCollection.isUnique([1, 2, 2, 3, 4]);
//=> false
```
<a name="StringView"></a>

## StringView ⇐ <code>Uint8Array</code>
Extends Uint8Array to handle C-like representation of UTF-8 encoded strings.

**Kind**: global class  
**Extends**: <code>Uint8Array</code>  

* [StringView](#StringView) ⇐ <code>Uint8Array</code>
    * _instance_
        * [.size](#StringView+size) : <code>number</code>
        * [.characters()](#StringView+characters) ⇒ <code>Iterable.&lt;string&gt;</code>
        * [.charAt([index])](#StringView+charAt) ⇒ <code>string</code>
        * [.replace(pattern, replacement)](#StringView+replace) ⇒ [<code>StringView</code>](#StringView)
        * [.reverse()](#StringView+reverse) ⇒ [<code>StringView</code>](#StringView)
        * [.search(searchValue, [fromIndex])](#StringView+search) ⇒ <code>number</code>
        * [.substring(indexStart, [indexEnd])](#StringView+substring) ⇒ <code>string</code>
        * [.toString()](#StringView+toString) ⇒ <code>string</code>
        * [.toJSON()](#StringView+toJSON) ⇒ <code>string</code>
        * [.trim()](#StringView+trim) ⇒ [<code>StringView</code>](#StringView)
    * _static_
        * [.encoder](#StringView.encoder) : <code>TextEncoder</code>
            * [.encodeInto(source, destination)](#StringView.encoder.encodeInto) ⇒ <code>Uint8Array</code>
        * [.decoder](#StringView.decoder) : <code>TextDecoder</code>
        * [.from(arrayLike, [mapFn], [thisArg])](#StringView.from) ⇒ <code>Uint8Array</code> \| [<code>StringView</code>](#StringView)
        * [.getByteSize(string)](#StringView.getByteSize) ⇒ <code>number</code>

<a name="StringView+size"></a>

### stringView.size : <code>number</code>
The amount of UTF characters in the StringView.

**Kind**: instance property of [<code>StringView</code>](#StringView)  
**Example**  
```js
const stringView = StringView.fromString('abc😀a');
stringView.size
//=> 5
stringView.length
//=> 8
```
<a name="StringView+characters"></a>

### stringView.characters() ⇒ <code>Iterable.&lt;string&gt;</code>
Iterates over the characters in the StringView.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Example**  
```js
const stringView = StringView.fromString('abc😀');
[...stringView.characters()]
//=> ['a', 'b', 'c', '😀']
```
<a name="StringView+charAt"></a>

### stringView.charAt([index]) ⇒ <code>string</code>
Returns a new string consisting of the single UTF character
located at the specified character index.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Returns**: <code>string</code> - a string representing the character  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [index] | <code>number</code> | <code>0</code> | a character index |

**Example**  
```js
const stringView = StringView.fromString('abc😀');
stringView.charAt(0);
//=> 'a'
stringView.charAt(3);
//=> '😀'
```
<a name="StringView+replace"></a>

### stringView.replace(pattern, replacement) ⇒ [<code>StringView</code>](#StringView)
Performs an in-place replacement within the StringView
of all occurrences of a given pattern with a given replacement.

**Kind**: instance method of [<code>StringView</code>](#StringView)  

| Param | Type | Description |
| --- | --- | --- |
| pattern | [<code>Collection</code>](#Collection) | the pattern to be replaced |
| replacement | [<code>Collection</code>](#Collection) | the replacement |

**Example**  
```js
const stringView = StringView.fromString('abc😀a');
const pattern = StringView.fromString('a');
const replacement = StringView.fromString('d');
stringView.replace(pattern, replacement).toString();
//=> 'dbc😀d'
```
<a name="StringView+reverse"></a>

### stringView.reverse() ⇒ [<code>StringView</code>](#StringView)
Reverses the characters of the StringView in-place.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Example**  
```js
const stringView = StringView.fromString('abc😀a');
stringView.reverse().toString();
//=> 'a😀cba'
```
<a name="StringView+search"></a>

### stringView.search(searchValue, [fromIndex]) ⇒ <code>number</code>
Returns the index within the calling StringView
of the first occurrence of the specified value, starting the search at start.
Returns -1 if the value is not found.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Returns**: <code>number</code> - the index of the first occurrence of the specified value  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchValue | [<code>Collection</code>](#Collection) |  | the value to search for |
| [fromIndex] | <code>number</code> | <code>0</code> | the index at which to start the search |

**Example**  
```js
const stringView = StringView.fromString('abc😀a');
const searchValue = StringView.fromString('😀');
stringView.search(searchValue);
//=> 3
```
<a name="StringView+substring"></a>

### stringView.substring(indexStart, [indexEnd]) ⇒ <code>string</code>
Returns a string of characters between the start and end
character indexes, or to the end of the string.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Returns**: <code>string</code> - a new string containing the specified part of the given string  

| Param | Type | Description |
| --- | --- | --- |
| indexStart | <code>number</code> | the character index of the first character to include |
| [indexEnd] | <code>number</code> | the character index of the first character to exclude |

**Example**  
```js
const stringView = StringView.fromString('abc😀a');
stringView.substring(0, 4);
//=> 'abc😀'
stringView.substring(2);
//=> 'c😀a'
```
<a name="StringView+toString"></a>

### stringView.toString() ⇒ <code>string</code>
Returns a string representation of the StringView.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Example**  
```js
const stringView = StringView.fromString('abc😀a');
stringView.toString();
//=> 'abc😀a'
stringView == 'abc😀a'
//=> true
```
<a name="StringView+toJSON"></a>

### stringView.toJSON() ⇒ <code>string</code>
**Kind**: instance method of [<code>StringView</code>](#StringView)  
<a name="StringView+trim"></a>

### stringView.trim() ⇒ [<code>StringView</code>](#StringView)
Returns a StringView without trailing zeros.

**Kind**: instance method of [<code>StringView</code>](#StringView)  
**Example**  
```js
const stringView = StringView.fromString('abc😀a', 10);
stringView
//=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97, 0, 0 ]
stringView.trim();
//=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
```
<a name="StringView.encoder"></a>

### StringView.encoder : <code>TextEncoder</code>
**Kind**: static property of [<code>StringView</code>](#StringView)  
<a name="StringView.encoder.encodeInto"></a>

#### encoder.encodeInto(source, destination) ⇒ <code>Uint8Array</code>
Polyfill for TextEncoder#encodeInto

**Kind**: static method of [<code>encoder</code>](#StringView.encoder)  

| Param | Type |
| --- | --- |
| source | <code>string</code> | 
| destination | <code>Uint8Array</code> | 

<a name="StringView.decoder"></a>

### StringView.decoder : <code>TextDecoder</code>
**Kind**: static property of [<code>StringView</code>](#StringView)  
<a name="StringView.from"></a>

### StringView.from(arrayLike, [mapFn], [thisArg]) ⇒ <code>Uint8Array</code> \| [<code>StringView</code>](#StringView)
Creates a StringView from a string or an array like object.

**Kind**: static method of [<code>StringView</code>](#StringView)  

| Param | Type |
| --- | --- |
| arrayLike | <code>ArrayLike.&lt;number&gt;</code> \| <code>string</code> | 
| [mapFn] | <code>function</code> \| <code>Uint8Array</code> | 
| [thisArg] | <code>Object</code> | 

<a name="StringView.getByteSize"></a>

### StringView.getByteSize(string) ⇒ <code>number</code>
Returns the size in bytes of a given string without encoding it.

**Kind**: static method of [<code>StringView</code>](#StringView)  
**Returns**: <code>number</code> - the size in bytes  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | the string to check |

**Example**  
```js
const stringView = StringView.getByteSize('abc😀a');
//=> 8
```
<a name="SymmetricGrid"></a>

## SymmetricGrid ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
A grid to handle symmetric or triangular matrices
using half the space required for a normal grid.

**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [SymmetricGrid](#SymmetricGrid) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * [new SymmetricGrid([options], [...args])](#new_SymmetricGrid_new)
    * _instance_
        * [.get(row, column)](#SymmetricGrid+get) ⇒ <code>\*</code>
        * [.set(row, [column], [value])](#SymmetricGrid+set) ⇒ [<code>SymmetricGrid</code>](#SymmetricGrid)
        * [.setArray(array, [offset])](#SymmetricGrid+setArray) ⇒ <code>void</code>
        * [.getCoordinates(index)](#SymmetricGrid+getCoordinates) ⇒ [<code>Coordinates</code>](#Coordinates)
        * [.toArrays()](#SymmetricGrid+toArrays) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
    * _static_
        * [.getIndex(row, column)](#SymmetricGrid.getIndex) ⇒ <code>\*</code>
        * [.getLength(rows)](#SymmetricGrid.getLength) ⇒ <code>number</code>
        * [.fromArrays(arrays, [pad])](#SymmetricGrid.fromArrays) ⇒ [<code>SymmetricGrid</code>](#SymmetricGrid)

<a name="new_SymmetricGrid_new"></a>

### new SymmetricGrid([options], [...args])
Passes all arguments to the Base class except if called with a special set of grid options,
in that case creates and empty grid of specified parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.rows] | <code>number</code> | <code>2</code> | the number of rows |
| [options.pad] | <code>\*</code> | <code>0</code> | the initial value of cells |
| [...args] | <code>\*</code> |  |  |

**Example**  
```js
new SymmetricGrid('a')
//=> SymmetricGrid ['a']

new SymmetricGrid(2)
//=> SymmetricGrid [undefined, undefined]

new SymmetricGrid({ rows: 3 })
//=> SymmetricGrid [0, 0, 0, 0]

new SymmetricGrid({ rows: 3, pad: 1 })
//=> SymmetricGrid [1, 1, 1, 1]
```
<a name="SymmetricGrid+get"></a>

### symmetricGrid.get(row, column) ⇒ <code>\*</code>
Returns an element from given coordinates.

**Kind**: instance method of [<code>SymmetricGrid</code>](#SymmetricGrid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = SymmetricGrid({ rows: 3, pad: 3});
a.get(0, 1);
//=> 3
```
<a name="SymmetricGrid+set"></a>

### symmetricGrid.set(row, [column], [value]) ⇒ [<code>SymmetricGrid</code>](#SymmetricGrid)
Sets the element at given coordinates.
Proxies to TypedArray#set if the first parameter is Array-like
and the grid is based on a TypedArray.

**Kind**: instance method of [<code>SymmetricGrid</code>](#SymmetricGrid)  
**Returns**: [<code>SymmetricGrid</code>](#SymmetricGrid) - the instance  

| Param | Type |
| --- | --- |
| row | <code>number</code> \| [<code>Collection</code>](#Collection) | 
| [column] | <code>number</code> | 
| [value] | <code>\*</code> | 

**Example**  
```js
const a = SymmetricGrid({ rows: 3, pad: 3});
a.set(0, 1, 5);
a.get(0, 1);
//=> 5
```
<a name="SymmetricGrid+setArray"></a>

### symmetricGrid.setArray(array, [offset]) ⇒ <code>void</code>
Implements in-place replacement of the grid elements if it's based on Array.
Proxies to TypedArray#set if the grid is based on a TypedArray.

**Kind**: instance method of [<code>SymmetricGrid</code>](#SymmetricGrid)  

| Param | Type |
| --- | --- |
| array | [<code>Collection</code>](#Collection) | 
| [offset] | <code>number</code> | 

<a name="SymmetricGrid+getCoordinates"></a>

### symmetricGrid.getCoordinates(index) ⇒ [<code>Coordinates</code>](#Coordinates)
Gets coordinates of an element at specified index.

**Kind**: instance method of [<code>SymmetricGrid</code>](#SymmetricGrid)  
**Returns**: [<code>Coordinates</code>](#Coordinates) - coordinates  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

**Example**  
```js
const a = SymmetricGrid({ rows: 3, pad: 3});
a.getCoordinates(1);
//=> [0, 1]
a.getCoordinates(2);
//=> [1, 1]
```
<a name="SymmetricGrid+toArrays"></a>

### symmetricGrid.toArrays() ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
Returns an array of arrays where each nested array correspond to a row in the grid.

**Kind**: instance method of [<code>SymmetricGrid</code>](#SymmetricGrid)  
**Example**  
```js
const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
//=> SymmetricGrid [1, 2, 3, 4, 5, 6]
a.toArrays();
//=> Array [[1, 2, 4], [2, 3, 5], [4, 5, 6]]
```
<a name="SymmetricGrid.getIndex"></a>

### SymmetricGrid.getIndex(row, column) ⇒ <code>\*</code>
Returns an array index of an element at given coordinates.

**Kind**: static method of [<code>SymmetricGrid</code>](#SymmetricGrid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = SymmetricGrid({ rows: 3 });
a.get(1, 0);
//=> 1
a.get(0, 1);
//=> 1
```
<a name="SymmetricGrid.getLength"></a>

### SymmetricGrid.getLength(rows) ⇒ <code>number</code>
Returns the length of underlying Array required to hold the grid.

**Kind**: static method of [<code>SymmetricGrid</code>](#SymmetricGrid)  

| Param | Type |
| --- | --- |
| rows | <code>number</code> | 

<a name="SymmetricGrid.fromArrays"></a>

### SymmetricGrid.fromArrays(arrays, [pad]) ⇒ [<code>SymmetricGrid</code>](#SymmetricGrid)
Creates a grid from an array of arrays.

**Kind**: static method of [<code>SymmetricGrid</code>](#SymmetricGrid)  
**Returns**: [<code>SymmetricGrid</code>](#SymmetricGrid) - const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
//=> SymmetricGrid [1, 2, 3, 4, 5, 6]
a.get(1, 0);
//=> 2
a.get(2, 1);
//=> 4  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrays | <code>Array.&lt;Array.&lt;\*&gt;&gt;</code> |  |  |
| [pad] | <code>\*</code> | <code>0</code> | the value to pad the arrays to create equal sized rows |

<a name="TypedArrayView"></a>

## TypedArrayView ⇐ <code>DataView</code>
A DataView based TypedArray that supports endianness and can be set at any offset.

**Kind**: global class  
**Extends**: <code>DataView</code>  

* [TypedArrayView](#TypedArrayView) ⇐ <code>DataView</code>
    * _instance_
        * [.size](#TypedArrayView+size) : <code>number</code>
        * [.get(index)](#TypedArrayView+get) ⇒ <code>number</code>
        * [.set(index, value)](#TypedArrayView+set) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)
        * [.toJSON()](#TypedArrayView+toJSON) ⇒ <code>Array.&lt;number&gt;</code>
    * _static_
        * [.typeGetter](#TypedArrayView.typeGetter) : <code>string</code>
        * [.typeSetter](#TypedArrayView.typeSetter) : <code>string</code>
        * [.offset](#TypedArrayView.offset) : <code>number</code>
        * [.littleEndian](#TypedArrayView.littleEndian) : <code>boolean</code>
        * [.getLength(size)](#TypedArrayView.getLength) ⇒ <code>number</code>
        * [.from(value, [array])](#TypedArrayView.from) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)
        * [.of(size)](#TypedArrayView.of) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)

<a name="TypedArrayView+size"></a>

### typedArrayView.size : <code>number</code>
Returns the amount of available numbers in the array.

**Kind**: instance property of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView+get"></a>

### typedArrayView.get(index) ⇒ <code>number</code>
Returns a number at a given index.

**Kind**: instance method of [<code>TypedArrayView</code>](#TypedArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="TypedArrayView+set"></a>

### typedArrayView.set(index, value) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)
Sets a number at a given index.

**Kind**: instance method of [<code>TypedArrayView</code>](#TypedArrayView)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 
| value | <code>number</code> | 

<a name="TypedArrayView+toJSON"></a>

### typedArrayView.toJSON() ⇒ <code>Array.&lt;number&gt;</code>
Returns an array representation of the array view.

**Kind**: instance method of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView.typeGetter"></a>

### TypedArrayView.typeGetter : <code>string</code>
**Kind**: static property of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView.typeSetter"></a>

### TypedArrayView.typeSetter : <code>string</code>
**Kind**: static property of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView.offset"></a>

### TypedArrayView.offset : <code>number</code>
**Kind**: static property of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView.littleEndian"></a>

### TypedArrayView.littleEndian : <code>boolean</code>
**Kind**: static property of [<code>TypedArrayView</code>](#TypedArrayView)  
<a name="TypedArrayView.getLength"></a>

### TypedArrayView.getLength(size) ⇒ <code>number</code>
Returns the byte length of an array view to hold a given amount of numbers.

**Kind**: static method of [<code>TypedArrayView</code>](#TypedArrayView)  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

<a name="TypedArrayView.from"></a>

### TypedArrayView.from(value, [array]) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)
Creates an array view from a given array of numbers.

**Kind**: static method of [<code>TypedArrayView</code>](#TypedArrayView)  

| Param | Type |
| --- | --- |
| value | <code>ArrayLike.&lt;number&gt;</code> | 
| [array] | [<code>TypedArrayView</code>](#TypedArrayView) | 

<a name="TypedArrayView.of"></a>

### TypedArrayView.of(size) ⇒ [<code>TypedArrayView</code>](#TypedArrayView)
Creates an empty array view of specified size.

**Kind**: static method of [<code>TypedArrayView</code>](#TypedArrayView)  

| Param | Type | Default |
| --- | --- | --- |
| size | <code>number</code> | <code>1</code> | 

<a name="UnweightedAdjacencyList"></a>

## UnweightedAdjacencyList ⇐ <code>Uint32Array</code>
Implements Adjacency List data structure for unweighted graphs.

**Kind**: global class  
**Extends**: <code>Uint32Array</code>  

* [UnweightedAdjacencyList](#UnweightedAdjacencyList) ⇐ <code>Uint32Array</code>
    * [new UnweightedAdjacencyList([options], ...args)](#new_UnweightedAdjacencyList_new)
    * _instance_
        * [.addEdge(x, y)](#UnweightedAdjacencyList+addEdge) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
        * [.removeEdge(x, y)](#UnweightedAdjacencyList+removeEdge) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
        * [.hasEdge(x, y)](#UnweightedAdjacencyList+hasEdge) ⇒ <code>boolean</code>
        * [.getEdge(x, y)](#UnweightedAdjacencyList+getEdge) ⇒ <code>number</code>
        * [.outEdges(vertex)](#UnweightedAdjacencyList+outEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.inEdges(vertex)](#UnweightedAdjacencyList+inEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.isFull()](#UnweightedAdjacencyList+isFull) ⇒ <code>boolean</code>
        * [.grow([vertices], [edges])](#UnweightedAdjacencyList+grow) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
    * _static_
        * [.undirected](#UnweightedAdjacencyList.undirected) : <code>boolean</code>
        * [.weighted](#UnweightedAdjacencyList.weighted) : <code>boolean</code>
        * [.getLength(vertices, edges)](#UnweightedAdjacencyList.getLength) ⇒ <code>number</code>
        * [.getVertexCount(array)](#UnweightedAdjacencyList.getVertexCount) ⇒ <code>number</code>
        * [.fromGrid(grid)](#UnweightedAdjacencyList.fromGrid) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)

<a name="new_UnweightedAdjacencyList_new"></a>

### new UnweightedAdjacencyList([options], ...args)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.vertices] | <code>number</code> | <code>2</code> | the maximum amount of vertices in the graph |
| [options.edges] | <code>number</code> | <code>2</code> | the maximum amount of edges in the graph |
| ...args | <code>\*</code> |  |  |

<a name="UnweightedAdjacencyList+addEdge"></a>

### unweightedAdjacencyList.addEdge(x, y) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
Adds an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  
**Throws**:

- <code>RangeError</code> if the list is full


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyList+removeEdge"></a>

### unweightedAdjacencyList.removeEdge(x, y) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
Removes an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyList+hasEdge"></a>

### unweightedAdjacencyList.hasEdge(x, y) ⇒ <code>boolean</code>
Checks if there is an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyList+getEdge"></a>

### unweightedAdjacencyList.getEdge(x, y) ⇒ <code>number</code>
Returns 1 if the edge between the given vertices exists, 0 otherwise.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyList+outEdges"></a>

### unweightedAdjacencyList.outEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over outgoing edges of a vertex.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="UnweightedAdjacencyList+inEdges"></a>

### unweightedAdjacencyList.inEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over incoming edges of a vertex.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="UnweightedAdjacencyList+isFull"></a>

### unweightedAdjacencyList.isFull() ⇒ <code>boolean</code>
Checks whether the list is full--all available edges are set.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  
<a name="UnweightedAdjacencyList+grow"></a>

### unweightedAdjacencyList.grow([vertices], [edges]) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
Creates a larger copy of the graph with a space
for a specified amount of additional vertices and edges.

**Kind**: instance method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vertices] | <code>number</code> | <code>0</code> | the amount of additional vertices |
| [edges] | <code>number</code> | <code>1</code> | the amount of additional edges |

<a name="UnweightedAdjacencyList.undirected"></a>

### UnweightedAdjacencyList.undirected : <code>boolean</code>
Whether the graph is undirected.

**Kind**: static property of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  
<a name="UnweightedAdjacencyList.weighted"></a>

### UnweightedAdjacencyList.weighted : <code>boolean</code>
Whether the graph is weighted.

**Kind**: static property of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  
<a name="UnweightedAdjacencyList.getLength"></a>

### UnweightedAdjacencyList.getLength(vertices, edges) ⇒ <code>number</code>
Returns the length of underlying TypedArray required to hold the graph.

**Kind**: static method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type |
| --- | --- |
| vertices | <code>number</code> | 
| edges | <code>number</code> | 

<a name="UnweightedAdjacencyList.getVertexCount"></a>

### UnweightedAdjacencyList.getVertexCount(array) ⇒ <code>number</code>
Derives the vertex count of an adjacency list stored as an array-like object.

**Kind**: static method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type |
| --- | --- |
| array | [<code>Collection</code>](#Collection) | 

<a name="UnweightedAdjacencyList.fromGrid"></a>

### UnweightedAdjacencyList.fromGrid(grid) ⇒ [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)
Creates an adjacency list from a given grid or adjacency matrix.

**Kind**: static method of [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList)  

| Param | Type |
| --- | --- |
| grid | [<code>Grid</code>](#Grid) \| [<code>BinaryGrid</code>](#BinaryGrid) \| [<code>SymmetricGrid</code>](#SymmetricGrid) | 

<a name="UnweightedAdjacencyMatrix"></a>

## UnweightedAdjacencyMatrix ⇐ [<code>BinaryGrid</code>](#BinaryGrid)
Implements Adjacency Matrix for unweighted graphs.

**Kind**: global class  
**Extends**: [<code>BinaryGrid</code>](#BinaryGrid)  

* [UnweightedAdjacencyMatrix](#UnweightedAdjacencyMatrix) ⇐ [<code>BinaryGrid</code>](#BinaryGrid)
    * [new UnweightedAdjacencyMatrix([options], [...args])](#new_UnweightedAdjacencyMatrix_new)
    * _instance_
        * [.addEdge(x, y)](#UnweightedAdjacencyMatrix+addEdge) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)
        * [.removeEdge(x, y)](#UnweightedAdjacencyMatrix+removeEdge) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)
        * [.hasEdge(x, y)](#UnweightedAdjacencyMatrix+hasEdge) ⇒ <code>boolean</code>
        * [.getEdge(x, y)](#UnweightedAdjacencyMatrix+getEdge) ⇒ <code>number</code>
        * [.outEdges(vertex)](#UnweightedAdjacencyMatrix+outEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.inEdges(vertex)](#UnweightedAdjacencyMatrix+inEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.get(row, column)](#BinaryGrid+get) ⇒ <code>number</code>
        * [.set(row, [column], [value])](#BinaryGrid+set) ⇒ [<code>BinaryGrid</code>](#BinaryGrid)
    * _static_
        * [.undirected](#UnweightedAdjacencyMatrix.undirected) : <code>boolean</code>
        * [.weighted](#UnweightedAdjacencyMatrix.weighted) : <code>boolean</code>
        * [.getLength(vertices)](#UnweightedAdjacencyMatrix.getLength) ⇒ <code>number</code>
        * [.fromList(list)](#UnweightedAdjacencyMatrix.fromList) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)

<a name="new_UnweightedAdjacencyMatrix_new"></a>

### new UnweightedAdjacencyMatrix([options], [...args])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.vertices] | <code>number</code> | <code>2</code> | the maximum number of vertices |
| [...args] | <code>\*</code> |  |  |

<a name="UnweightedAdjacencyMatrix+addEdge"></a>

### unweightedAdjacencyMatrix.addEdge(x, y) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)
Adds an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyMatrix+removeEdge"></a>

### unweightedAdjacencyMatrix.removeEdge(x, y) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)
Removes an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyMatrix+hasEdge"></a>

### unweightedAdjacencyMatrix.hasEdge(x, y) ⇒ <code>boolean</code>
Checks if there is an edge between two vertices.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyMatrix+getEdge"></a>

### unweightedAdjacencyMatrix.getEdge(x, y) ⇒ <code>number</code>
Returns 1 if the edge between the given vertices exists, 0 otherwise.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="UnweightedAdjacencyMatrix+outEdges"></a>

### unweightedAdjacencyMatrix.outEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over outgoing edges of a vertex.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="UnweightedAdjacencyMatrix+inEdges"></a>

### unweightedAdjacencyMatrix.inEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over incoming edges of a vertex.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="BinaryGrid+get"></a>

### unweightedAdjacencyMatrix.get(row, column) ⇒ <code>number</code>
Returns the value of a bit at given coordinates.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  
**Overrides**: [<code>get</code>](#BinaryGrid+get)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

<a name="BinaryGrid+set"></a>

### unweightedAdjacencyMatrix.set(row, [column], [value]) ⇒ [<code>BinaryGrid</code>](#BinaryGrid)
Sets the value of a bit at given coordinates.
Proxies to TypedArray#set if the first parameter is Array-like.

**Kind**: instance method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  
**Overrides**: [<code>set</code>](#BinaryGrid+set)  

| Param | Type | Default |
| --- | --- | --- |
| row | <code>number</code> \| [<code>Collection</code>](#Collection) |  | 
| [column] | <code>number</code> |  | 
| [value] | <code>number</code> | <code>1</code> | 

<a name="UnweightedAdjacencyMatrix.undirected"></a>

### UnweightedAdjacencyMatrix.undirected : <code>boolean</code>
Whether the graph is undirected.

**Kind**: static property of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  
<a name="UnweightedAdjacencyMatrix.weighted"></a>

### UnweightedAdjacencyMatrix.weighted : <code>boolean</code>
Whether the graph is weighted.

**Kind**: static property of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  
<a name="UnweightedAdjacencyMatrix.getLength"></a>

### UnweightedAdjacencyMatrix.getLength(vertices) ⇒ <code>number</code>
Returns the length of underlying TypedArray required to hold the graph.

**Kind**: static method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type |
| --- | --- |
| vertices | <code>number</code> | 

<a name="UnweightedAdjacencyMatrix.fromList"></a>

### UnweightedAdjacencyMatrix.fromList(list) ⇒ [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)
Creates an adjacency matrix from a given adjacency list.

**Kind**: static method of [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix)  

| Param | Type |
| --- | --- |
| list | [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList) | 

<a name="WeightedAdjacencyList"></a>

## WeightedAdjacencyList ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
Implements Adjacency List data structure for weighted graphs.

**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [WeightedAdjacencyList](#WeightedAdjacencyList) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * [new WeightedAdjacencyList([options], ...args)](#new_WeightedAdjacencyList_new)
    * _instance_
        * [.addEdge(x, y, weight)](#WeightedAdjacencyList+addEdge) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
        * [.removeEdge(x, y)](#WeightedAdjacencyList+removeEdge) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
        * [.hasEdge(x, y)](#WeightedAdjacencyList+hasEdge) ⇒ <code>boolean</code>
        * [.getEdge(x, y)](#WeightedAdjacencyList+getEdge) ⇒ <code>number</code>
        * [.outEdges(vertex)](#WeightedAdjacencyList+outEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.inEdges(vertex)](#WeightedAdjacencyList+inEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.isFull()](#WeightedAdjacencyList+isFull) ⇒ <code>boolean</code>
        * [.grow([vertices], [edges])](#WeightedAdjacencyList+grow) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
    * _static_
        * [.getLength(vertices, edges)](#WeightedAdjacencyList.getLength) ⇒ <code>number</code>
        * [.getVertexCount(array)](#WeightedAdjacencyList.getVertexCount) ⇒ <code>number</code>
        * [.fromGrid(grid)](#WeightedAdjacencyList.fromGrid) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)

<a name="new_WeightedAdjacencyList_new"></a>

### new WeightedAdjacencyList([options], ...args)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.vertices] | <code>number</code> | <code>2</code> | the maximum amount of vertices in the graph |
| [options.edges] | <code>number</code> | <code>2</code> | the maximum amount of edges in the graph |
| ...args | <code>\*</code> |  |  |

<a name="WeightedAdjacencyList+addEdge"></a>

### weightedAdjacencyList.addEdge(x, y, weight) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
Adds an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  
**Throws**:

- <code>RangeError</code> if the list is full


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |
| weight | <code>number</code> | the weight |

<a name="WeightedAdjacencyList+removeEdge"></a>

### weightedAdjacencyList.removeEdge(x, y) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
Removes an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyList+hasEdge"></a>

### weightedAdjacencyList.hasEdge(x, y) ⇒ <code>boolean</code>
Checks if there is an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyList+getEdge"></a>

### weightedAdjacencyList.getEdge(x, y) ⇒ <code>number</code>
Returns the weight of the edge between given vertices
or NaN if the edge doesn't exist.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyList+outEdges"></a>

### weightedAdjacencyList.outEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over outgoing edges of a vertex.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="WeightedAdjacencyList+inEdges"></a>

### weightedAdjacencyList.inEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over incoming edges of a vertex.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="WeightedAdjacencyList+isFull"></a>

### weightedAdjacencyList.isFull() ⇒ <code>boolean</code>
Checks whether the list is full--all available edges are set.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  
<a name="WeightedAdjacencyList+grow"></a>

### weightedAdjacencyList.grow([vertices], [edges]) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
Creates a larger copy of the graph with a space
for a specified amount of additional vertices and edges.

**Kind**: instance method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vertices] | <code>number</code> | <code>0</code> | the amount of additional vertices |
| [edges] | <code>number</code> | <code>1</code> | the amount of additional edges |

<a name="WeightedAdjacencyList.getLength"></a>

### WeightedAdjacencyList.getLength(vertices, edges) ⇒ <code>number</code>
Returns the length of underlying TypedArray required to hold the graph.

**Kind**: static method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type |
| --- | --- |
| vertices | <code>number</code> | 
| edges | <code>number</code> | 

<a name="WeightedAdjacencyList.getVertexCount"></a>

### WeightedAdjacencyList.getVertexCount(array) ⇒ <code>number</code>
Derives the vertex count of an adjacency list stored as an array-like object.

**Kind**: static method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type |
| --- | --- |
| array | [<code>Collection</code>](#Collection) | 

<a name="WeightedAdjacencyList.fromGrid"></a>

### WeightedAdjacencyList.fromGrid(grid) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
Creates an adjacency list from a given grid or adjacency matrix.

**Kind**: static method of [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)  

| Param | Type |
| --- | --- |
| grid | [<code>Grid</code>](#Grid) \| [<code>BinaryGrid</code>](#BinaryGrid) \| [<code>SymmetricGrid</code>](#SymmetricGrid) | 

<a name="WeightedAdjacencyMatrix"></a>

## WeightedAdjacencyMatrix ⇐ [<code>Grid</code>](#Grid)
Implements Adjacency Matrix for weighted graphs.

**Kind**: global class  
**Extends**: [<code>Grid</code>](#Grid)  

* [WeightedAdjacencyMatrix](#WeightedAdjacencyMatrix) ⇐ [<code>Grid</code>](#Grid)
    * [new WeightedAdjacencyMatrix([options], [...args])](#new_WeightedAdjacencyMatrix_new)
    * _instance_
        * [.columns](#Grid+columns) ⇒ <code>void</code>
        * [.rows](#Grid+rows) : <code>number</code>
        * [.addEdge(x, y, weight)](#WeightedAdjacencyMatrix+addEdge) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
        * [.removeEdge(x, y)](#WeightedAdjacencyMatrix+removeEdge) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
        * [.hasEdge(x, y)](#WeightedAdjacencyMatrix+hasEdge) ⇒ <code>boolean</code>
        * [.getEdge(x, y)](#WeightedAdjacencyMatrix+getEdge) ⇒ <code>number</code>
        * [.outEdges(vertex)](#WeightedAdjacencyMatrix+outEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.inEdges(vertex)](#WeightedAdjacencyMatrix+inEdges) ⇒ <code>Iterable.&lt;number&gt;</code>
        * [.getIndex(row, column)](#Grid+getIndex) ⇒ <code>\*</code>
        * [.get(row, column)](#Grid+get) ⇒ <code>\*</code>
        * [.set(row, [column], [value])](#Grid+set) ⇒ [<code>Grid</code>](#Grid)
        * [.setArray(array, [offset])](#Grid+setArray) ⇒ <code>void</code>
        * [.getCoordinates(index)](#Grid+getCoordinates) ⇒ [<code>Coordinates</code>](#Coordinates)
        * [.toArrays([withPadding])](#Grid+toArrays) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
    * _static_
        * [.getLength(vertices)](#WeightedAdjacencyMatrix.getLength) ⇒ <code>number</code>
        * [.fromList(list, [pad])](#WeightedAdjacencyMatrix.fromList) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)

<a name="new_WeightedAdjacencyMatrix_new"></a>

### new WeightedAdjacencyMatrix([options], [...args])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.vertices] | <code>number</code> | <code>2</code> | the maximum number of vertices |
| [options.pad] | <code>\*</code> | <code>0</code> | the initial value of all edges |
| [...args] | <code>\*</code> |  |  |

<a name="Grid+columns"></a>

### weightedAdjacencyMatrix.columns ⇒ <code>void</code>
Specifies the number of columns of the grid.

**Kind**: instance property of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>columns</code>](#Grid+columns)  

| Param | Type |
| --- | --- |
| columns | <code>number</code> | 

<a name="Grid+rows"></a>

### weightedAdjacencyMatrix.rows : <code>number</code>
Number of rows in the grid.

**Kind**: instance property of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>rows</code>](#Grid+rows)  
<a name="WeightedAdjacencyMatrix+addEdge"></a>

### weightedAdjacencyMatrix.addEdge(x, y, weight) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
Adds an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |
| weight | <code>number</code> |  |

<a name="WeightedAdjacencyMatrix+removeEdge"></a>

### weightedAdjacencyMatrix.removeEdge(x, y) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
Removes an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyMatrix+hasEdge"></a>

### weightedAdjacencyMatrix.hasEdge(x, y) ⇒ <code>boolean</code>
Checks if there is an edge between two vertices.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyMatrix+getEdge"></a>

### weightedAdjacencyMatrix.getEdge(x, y) ⇒ <code>number</code>
Returns the weight of the edge between given vertices if it exists.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | the starting vertex |
| y | <code>number</code> | the ending vertex |

<a name="WeightedAdjacencyMatrix+outEdges"></a>

### weightedAdjacencyMatrix.outEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over outgoing edges of a vertex.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="WeightedAdjacencyMatrix+inEdges"></a>

### weightedAdjacencyMatrix.inEdges(vertex) ⇒ <code>Iterable.&lt;number&gt;</code>
Iterates over incoming edges of a vertex.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| vertex | <code>number</code> | the vertex |

<a name="Grid+getIndex"></a>

### weightedAdjacencyMatrix.getIndex(row, column) ⇒ <code>\*</code>
Returns an array index of an element at given coordinates.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>getIndex</code>](#Grid+getIndex)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.get(1, 0);
//=> 2
```
<a name="Grid+get"></a>

### weightedAdjacencyMatrix.get(row, column) ⇒ <code>\*</code>
Returns an element from given coordinates.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>get</code>](#Grid+get)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.get(0, 1);
//=> 3
```
<a name="Grid+set"></a>

### weightedAdjacencyMatrix.set(row, [column], [value]) ⇒ [<code>Grid</code>](#Grid)
Sets the element at given coordinates.
Proxies to TypedArray#set if the first parameter is Array-like
and the grid is based on a TypedArray.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>set</code>](#Grid+set)  
**Returns**: [<code>Grid</code>](#Grid) - the instance  

| Param | Type |
| --- | --- |
| row | <code>number</code> \| [<code>Collection</code>](#Collection) | 
| [column] | <code>number</code> | 
| [value] | <code>\*</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.set(0, 1, 5);
a.get(0, 1);
//=> 5
```
<a name="Grid+setArray"></a>

### weightedAdjacencyMatrix.setArray(array, [offset]) ⇒ <code>void</code>
Implements in-place replacement of the grid elements if it's based on Array.
Proxies to TypedArray#set if the grid is based on a TypedArray.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>setArray</code>](#Grid+setArray)  

| Param | Type |
| --- | --- |
| array | [<code>Collection</code>](#Collection) | 
| [offset] | <code>number</code> | 

<a name="Grid+getCoordinates"></a>

### weightedAdjacencyMatrix.getCoordinates(index) ⇒ [<code>Coordinates</code>](#Coordinates)
Gets coordinates of an element at specified index.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>getCoordinates</code>](#Grid+getCoordinates)  
**Returns**: [<code>Coordinates</code>](#Coordinates) - coordinates  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.getCoordinates(1);
//=> [0, 1]
a.getCoordinates(2);
//=> [1, 0]
```
<a name="Grid+toArrays"></a>

### weightedAdjacencyMatrix.toArrays([withPadding]) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
Returns an array of arrays where each nested array correspond to a row in the grid.

**Kind**: instance method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  
**Overrides**: [<code>toArrays</code>](#Grid+toArrays)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [withPadding] | <code>boolean</code> | <code>false</code> | whether to remove padding from the end of the rows |

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.toArrays();
//=> [[3, 3], [3, 3], [3, 3]]
```
<a name="WeightedAdjacencyMatrix.getLength"></a>

### WeightedAdjacencyMatrix.getLength(vertices) ⇒ <code>number</code>
Returns the length of underlying Array required to hold the graph.

**Kind**: static method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type |
| --- | --- |
| vertices | <code>number</code> | 

<a name="WeightedAdjacencyMatrix.fromList"></a>

### WeightedAdjacencyMatrix.fromList(list, [pad]) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
Creates an adjacency matrix from a given adjacency list.

**Kind**: static method of [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)  

| Param | Type | Default |
| --- | --- | --- |
| list | [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList) |  | 
| [pad] | <code>number</code> | <code>0</code> | 

<a name="ArrayViewMixin"></a>

## ArrayViewMixin(ObjectViewClass, [itemLength]) ⇒ [<code>Class.&lt;ArrayView&gt;</code>](#ArrayView)
Creates an ArrayView class for a given ObjectView class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| ObjectViewClass | [<code>Class.&lt;ObjectView&gt;</code>](#ObjectView) \| [<code>Class.&lt;StringView&gt;</code>](#StringView) | 
| [itemLength] | <code>number</code> | 

<a name="BitFieldMixin"></a>

## BitFieldMixin(schema, [BitFieldClass]) ⇒ [<code>Class.&lt;BitField&gt;</code>](#BitField) \| [<code>Class.&lt;BigBitField&gt;</code>](#BigBitField)
Creates a BitField or BigBitField class with a given schema.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object.&lt;string, number&gt;</code> \| <code>Array.&lt;string&gt;</code> | the schema to use for the class |
| [BitFieldClass] | [<code>Class.&lt;BitField&gt;</code>](#BitField) \| [<code>Class.&lt;BigBitField&gt;</code>](#BigBitField) | an optional BitField class to extend |

<a name="GraphMixin"></a>

## GraphMixin(Base, [undirected]) ⇒ [<code>Graph</code>](#Graph)
Creates a Graph class extending a given adjacency structure.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| Base | [<code>AdjacencyStructure</code>](#AdjacencyStructure) |  | 
| [undirected] | <code>boolean</code> | <code>false</code> | 

<a name="GridMixin"></a>

## GridMixin(Base) ⇒ [<code>Grid</code>](#Grid)
Creates a Grid class extending a given Array-like class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Base | [<code>CollectionConstructor</code>](#CollectionConstructor) | 

**Example**  
```js
const ArrayGrid = Grid(Array);
```
<a name="ObjectViewMixin"></a>

## ObjectViewMixin(schema, [ObjectViewClass]) ⇒ [<code>Class.&lt;ObjectView&gt;</code>](#ObjectView)
Creates an ObjectView class with a given schema.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>object</code> | the schema to use for the class |
| [ObjectViewClass] | [<code>Class.&lt;ObjectView&gt;</code>](#ObjectView) | an optional ObjectView class to extend |

<a name="Comparator"></a>

## Comparator(a, b) ⇒ <code>number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>\*</code> | 
| b | <code>\*</code> | 

<a name="SortedMixin"></a>

## SortedMixin(Base) ⇒ [<code>SortedCollection</code>](#SortedCollection)
Creates a SortedCollection class extending a given Array-like class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Base | [<code>CollectionConstructor</code>](#CollectionConstructor) | 

**Example**  
```js
const SortedCollection = Grid(Uint32Array);
```
<a name="SymmetricGridMixin"></a>

## SymmetricGridMixin(Base) ⇒ [<code>SymmetricGrid</code>](#SymmetricGrid)
Creates a SymmetricGrid class extending a given Array-like class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Base | [<code>CollectionConstructor</code>](#CollectionConstructor) | 

**Example**  
```js
const SymmetricGrid = SymmetricGridMixin(Array);
```
<a name="TypedArrayViewMixin"></a>

## TypedArrayViewMixin(type, [littleEndian]) ⇒ <code>Class.&lt;Base&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| [littleEndian] | <code>boolean</code> | 

<a name="popCount32"></a>

## popCount32(value) ⇒ <code>number</code>
Counts set bits in a given number.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>number</code> | 

<a name="getLSBIndex"></a>

## getLSBIndex(value) ⇒ <code>number</code>
Returns the index of the Least Significant Bit in a number.

**Kind**: global function  

| Param | Type |
| --- | --- |
| value | <code>number</code> | 

<a name="getBitSize"></a>

## getBitSize(number) ⇒ <code>number</code>
Returns the minimum amount of bits necessary to hold a given number.

**Kind**: global function  
**Returns**: <code>number</code> - the amount of bits  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

<a name="WeightedAdjacencyListMixin"></a>

## WeightedAdjacencyListMixin(Base) ⇒ [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList)
Creates a WeightedAdjacencyList class extending a given TypedArray class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Base | [<code>CollectionConstructor</code>](#CollectionConstructor) | 

<a name="WeightedAdjacencyMatrixMixin"></a>

## WeightedAdjacencyMatrixMixin(Base, [undirected]) ⇒ [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
Creates a WeightedAdjacencyMatrix class extending a given Array-like class.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| Base | [<code>CollectionConstructor</code>](#CollectionConstructor) |  | 
| [undirected] | <code>boolean</code> | <code>false</code> | 

<a name="BitCoordinates"></a>

## BitCoordinates : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bucket | <code>number</code> | row index |
| position | <code>number</code> | column index |

<a name="AdjacencyStructure"></a>

## AdjacencyStructure : [<code>UnweightedAdjacencyList</code>](#UnweightedAdjacencyList) \| [<code>UnweightedAdjacencyMatrix</code>](#UnweightedAdjacencyMatrix) \| [<code>WeightedAdjacencyList</code>](#WeightedAdjacencyList) \| [<code>WeightedAdjacencyMatrix</code>](#WeightedAdjacencyMatrix)
**Kind**: global typedef  
<a name="TypedArrayConstructor"></a>

## TypedArrayConstructor : <code>Int8ArrayConstructor</code> \| <code>Int8ArrayConstructor</code> \| <code>Uint8ArrayConstructor</code> \| <code>Uint8ClampedArrayConstructor</code> \| <code>Int16ArrayConstructor</code> \| <code>Uint16ArrayConstructor</code> \| <code>Int32ArrayConstructor</code> \| <code>Uint32ArrayConstructor</code> \| <code>Float32ArrayConstructor</code> \| <code>Float64ArrayConstructor</code>
**Kind**: global typedef  
<a name="CollectionConstructor"></a>

## CollectionConstructor : <code>ArrayConstructor</code> \| [<code>TypedArrayConstructor</code>](#TypedArrayConstructor)
**Kind**: global typedef  
<a name="TypedArray"></a>

## TypedArray : <code>Int8Array</code> \| <code>Uint8Array</code> \| <code>Uint8ClampedArray</code> \| <code>Int16Array</code> \| <code>Uint16Array</code> \| <code>Int32Array</code> \| <code>Uint32Array</code> \| <code>Float32Array</code> \| <code>Float64Array</code>
**Kind**: global typedef  
<a name="Collection"></a>

## Collection : <code>Array</code> \| [<code>TypedArray</code>](#TypedArray)
**Kind**: global typedef  
<a name="Coordinates"></a>

## Coordinates : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| row | <code>number</code> | row index |
| column | <code>number</code> | column index |

<a name="ViewType"></a>

## ViewType : [<code>Class.&lt;ArrayView&gt;</code>](#ArrayView) \| [<code>Class.&lt;ObjectView&gt;</code>](#ObjectView) \| [<code>Class.&lt;TypedArrayView&gt;</code>](#TypedArrayView) \| [<code>Class.&lt;StringView&gt;</code>](#StringView)
**Kind**: global typedef  
<a name="View"></a>

## View : [<code>ArrayView</code>](#ArrayView) \| [<code>ObjectView</code>](#ObjectView) \| [<code>TypedArrayView</code>](#TypedArrayView) \| [<code>StringView</code>](#StringView)
**Kind**: global typedef  
<a name="PrimitiveFieldType"></a>

## PrimitiveFieldType : <code>&#x27;int8&#x27;</code> \| <code>&#x27;uint8&#x27;</code> \| <code>&#x27;int16&#x27;</code> \| <code>&#x27;uint16&#x27;</code> \| <code>&#x27;int32&#x27;</code> \| <code>&#x27;uint32&#x27;</code> \| <code>&#x27;float32&#x27;</code> \| <code>&#x27;float64&#x27;</code> \| <code>&#x27;bigint64&#x27;</code> \| <code>&#x27;biguint64&#x27;</code>
**Kind**: global typedef  
<a name="ObjectViewFieldType"></a>

## ObjectViewFieldType : [<code>PrimitiveFieldType</code>](#PrimitiveFieldType) \| <code>string</code> \| [<code>ViewType</code>](#ViewType)
**Kind**: global typedef  
<a name="ObjectViewField"></a>

## ObjectViewField : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [<code>ObjectViewFieldType</code>](#ObjectViewFieldType) |  |
| [size] | <code>number</code> | the maximum size in bytes for a string type |
| [littleEndian] | <code>boolean</code> |  |
| [length] | <code>number</code> |  |
| [start] | <code>number</code> |  |
| [View] | [<code>ViewType</code>](#ViewType) |  |
| [getter] | <code>string</code> |  |
| [setter] | <code>string</code> |  |
| [itemLength] | <code>number</code> |  |
| [default] | <code>\*</code> |  |

<a name="ObjectViewSchema"></a>

## ObjectViewSchema : <code>Object.&lt;string, ObjectViewField&gt;</code>
**Kind**: global typedef  
<a name="ObjectViewTypeDefs"></a>

## ObjectViewTypeDefs : <code>Object.&lt;string, function()&gt;</code>
**Kind**: global typedef  
