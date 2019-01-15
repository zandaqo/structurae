## Classes

<dl>
<dt><a href="#Grid">Grid</a></dt>
<dd></dd>
<dt><a href="#PackedInt">PackedInt</a></dt>
<dd></dd>
<dt><a href="#SortedArray">SortedArray</a> ⇐ <code>Array</code></dt>
<dd><p>Extends built-in Array to efficiently handle sorted data.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#GridFactory">GridFactory(Base)</a> ⇒ <code><a href="#Grid">Grid</a></code></dt>
<dd><p>Creates a Grid class extending a given Array-like class.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GridOptions">GridOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#IndexedCollection">IndexedCollection</a> : <code>ArrayConstructor</code> | <code>Int8ArrayConstructor</code> | <code>Int8ArrayConstructor</code> | <code>Uint8ArrayConstructor</code> | <code>Uint8ClampedArrayConstructor</code> | <code>Int16ArrayConstructor</code> | <code>Uint16ArrayConstructor</code> | <code>Int32ArrayConstructor</code> | <code>Uint32ArrayConstructor</code> | <code>Float32ArrayConstructor</code> | <code>Float64ArrayConstructor</code></dt>
<dd></dd>
<dt><a href="#Matcher">Matcher</a> : <code>Array.&lt;number, number&gt;</code> | <code>Array.&lt;BigInt, BigInt&gt;</code></dt>
<dd></dd>
<dt><a href="#FieldDescription">FieldDescription</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Grid"></a>

## Grid
**Kind**: global class  

* [Grid](#Grid)
    * [new Grid(...args)](#new_Grid_new)
    * _instance_
        * [.setColumns(columns)](#Grid+setColumns) ⇒ <code>void</code>
        * [.get(row, column)](#Grid+get) ⇒ <code>\*</code>
        * [.set(row, column, value)](#Grid+set) ⇒ <code>\*</code>
        * [.getCoordinates(index)](#Grid+getCoordinates) ⇒ <code>Array.&lt;number&gt;</code>
        * [.toArrays([withPadding])](#Grid+toArrays) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
    * _static_
        * [.fromArrays(arrays, [pad])](#Grid.fromArrays) ⇒ [<code>Grid</code>](#Grid)

<a name="new_Grid_new"></a>

### new Grid(...args)
Passes all arguments to the Base class except if called with a special set of grid options,
in that case creates and empty grid of specified parameter.


| Param | Type |
| --- | --- |
| ...args | <code>\*</code> \| [<code>GridOptions</code>](#GridOptions) | 

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
<a name="Grid+setColumns"></a>

### grid.setColumns(columns) ⇒ <code>void</code>
Specifies the number of columns of the grid.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| columns | <code>number</code> | 

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

### grid.set(row, column, value) ⇒ <code>\*</code>
Sets the element at given coordinates.

**Kind**: instance method of [<code>Grid</code>](#Grid)  

| Param | Type |
| --- | --- |
| row | <code>number</code> | 
| column | <code>number</code> | 
| value | <code>\*</code> | 

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.set(0, 1, 5);
a.get(0, 1);
//=> 5
```
<a name="Grid+getCoordinates"></a>

### grid.getCoordinates(index) ⇒ <code>Array.&lt;number&gt;</code>
Gets coordinates of an element at specified index.

**Kind**: instance method of [<code>Grid</code>](#Grid)  
**Returns**: <code>Array.&lt;number&gt;</code> - coordinates  

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

| Param | Type | Description |
| --- | --- | --- |
| [withPadding] | <code>boolean</code> | whether to remove padding from the end of the rows |

**Example**  
```js
const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
a.toArrays();
//=> [[3, 3], [3, 3], [3, 3]]
```
<a name="Grid.fromArrays"></a>

### Grid.fromArrays(arrays, [pad]) ⇒ [<code>Grid</code>](#Grid)
Creates a grid from an array of arrays.

**Kind**: static method of [<code>Grid</code>](#Grid)  
**Returns**: [<code>Grid</code>](#Grid) - const a = ArrayGrid([[1, 2], [3], [4, 5, 6]])
//=> ArrayGrid [1, 2, 0, 0, 3, 0, 0, 0, 4, 5, 6, 0]
a.get(1, 0);
//=> 3
a.get(2, 1);
//=> 5  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrays | <code>Array.&lt;Array.&lt;\*&gt;&gt;</code> |  |  |
| [pad] | <code>\*</code> | <code>0</code> | the value to pad the arrays to create equal sized rows |

<a name="PackedInt"></a>

## PackedInt
**Kind**: global class  

* [PackedInt](#PackedInt)
    * [new PackedInt(data)](#new_PackedInt_new)
    * _instance_
        * [.value](#PackedInt+value) : <code>number</code> \| <code>BigInt</code>
        * [.get(field)](#PackedInt+get) ⇒ <code>number</code>
        * [.set(field, value)](#PackedInt+set) ⇒ [<code>PackedInt</code>](#PackedInt)
        * [.has(...fields)](#PackedInt+has) ⇒ <code>boolean</code>
        * [.match(matcher)](#PackedInt+match) ⇒ <code>boolean</code>
        * [.toObject()](#PackedInt+toObject) ⇒ <code>Object.&lt;string, number&gt;</code>
    * _static_
        * [.fields](#PackedInt.fields) : <code>Array.&lt;number&gt;</code> \| [<code>Array.&lt;FieldDescription&gt;</code>](#FieldDescription)
        * [.size](#PackedInt.size) : <code>number</code>
        * [.zero](#PackedInt.zero) : <code>number</code> \| <code>BigInt</code>
        * [.one](#PackedInt.one) : <code>number</code> \| <code>BigInt</code>
        * [.two](#PackedInt.two) : <code>number</code> \| <code>BigInt</code>
        * [.masks](#PackedInt.masks) : <code>Object.&lt;string, number&gt;</code>
        * [.mask](#PackedInt.mask) : <code>number</code> \| <code>BigInt</code>
        * [.offsets](#PackedInt.offsets) : <code>Object.&lt;string, number&gt;</code>
        * [.isBigInt](#PackedInt.isBigInt) : <code>boolean</code>
        * [.isSafe](#PackedInt.isSafe) : <code>boolean</code>
        * [.isInitialized](#PackedInt.isInitialized) : <code>boolean</code>
        * [.encode(data)](#PackedInt.encode) ⇒ <code>number</code>
        * [.decode(data)](#PackedInt.decode) ⇒ <code>Object.&lt;string, number&gt;</code>
        * [.isValid(data)](#PackedInt.isValid) ⇒ <code>boolean</code>
        * [.getMinSize(number)](#PackedInt.getMinSize) ⇒ <code>number</code>
        * [.initialize()](#PackedInt.initialize) ⇒ <code>void</code>
        * [.getMatcher(matcher)](#PackedInt.getMatcher) ⇒ [<code>Matcher</code>](#Matcher)
        * [.match(value, matcher)](#PackedInt.match) ⇒ <code>boolean</code>

<a name="new_PackedInt_new"></a>

### new PackedInt(data)

| Param | Type |
| --- | --- |
| data | <code>number</code> \| <code>BigInt</code> \| <code>Array.&lt;number&gt;</code> | 

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
new Person([20, 1]).value
//=> 41
new Person(41).value
//=> 41
```
<a name="PackedInt+value"></a>

### packedInt.value : <code>number</code> \| <code>BigInt</code>
**Kind**: instance property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt+get"></a>

### packedInt.get(field) ⇒ <code>number</code>
Returns the value of a given field.

**Kind**: instance method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>number</code> - value value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> \| <code>number</code> | name of the field |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.get('age');
//=> 20
person.get('gender');
//=> 1
```
<a name="PackedInt+set"></a>

### packedInt.set(field, value) ⇒ [<code>PackedInt</code>](#PackedInt)
Stores a given value in a field.

**Kind**: instance method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: [<code>PackedInt</code>](#PackedInt) - the instance  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | name of the field |
| value | <code>number</code> | value of the field |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.get('age');
//=> 20
person.set('age', 30).get('age');
//=> 30
```
<a name="PackedInt+has"></a>

### packedInt.has(...fields) ⇒ <code>boolean</code>
Checks if an instance has all the specified fields set to 1. Useful for bit flags.

**Kind**: instance method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>boolean</code> - whether all the specified fields are set in the instance  

| Param | Type | Description |
| --- | --- | --- |
| ...fields | <code>string</code> \| <code>number</code> | names of the fields to check |

**Example**  
```js
const SettingsFlags = BinariusFactory(['notify', 'premium', 'moderator']);
const settings = SettingsFlags([1, 0, 1]);
settings.has('notify', 'moderator');
//=> true
settings.has('notify', 'premium');
//=> false
```
<a name="PackedInt+match"></a>

### packedInt.match(matcher) ⇒ <code>boolean</code>
Checks if the instance contains all the key-value pairs listed in matcher.
Use `ParseInt.getMatcher` to get an array of precomputed values
that you can use to efficiently compare multiple instances
to the same key-value pairs as shown in the examples below.

**Kind**: instance method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>boolean</code> - whether the instance matches with the provided fields  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> \| [<code>Matcher</code>](#Matcher) | an object with key-value pairs,                                                or an array of precomputed matcher values |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.match({ age: 20 });
//=> true
person.match({ gender: 1 });
//=> true
person.match({ gender: 1, age: 20 });
//=> true
person.match({ gender: 1, age: 19 });
//=> false

// use precomputed matcher
const matcher = Person.getMatcher({ age: 20});
new Person([20, 0]).match(matcher);
//=> true
new Person([19, 0]).match(matcher);
//=> false
```
<a name="PackedInt+toObject"></a>

### packedInt.toObject() ⇒ <code>Object.&lt;string, number&gt;</code>
Returns the object representation of the instance,
with field names as properties with corresponding values.

**Kind**: instance method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - the object representation of the instance  
**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.toObject();
//=> { age: 20, gender: 1 }
```
<a name="PackedInt.fields"></a>

### PackedInt.fields : <code>Array.&lt;number&gt;</code> \| [<code>Array.&lt;FieldDescription&gt;</code>](#FieldDescription)
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.size"></a>

### PackedInt.size : <code>number</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.zero"></a>

### PackedInt.zero : <code>number</code> \| <code>BigInt</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.one"></a>

### PackedInt.one : <code>number</code> \| <code>BigInt</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.two"></a>

### PackedInt.two : <code>number</code> \| <code>BigInt</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.masks"></a>

### PackedInt.masks : <code>Object.&lt;string, number&gt;</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.mask"></a>

### PackedInt.mask : <code>number</code> \| <code>BigInt</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.offsets"></a>

### PackedInt.offsets : <code>Object.&lt;string, number&gt;</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.isBigInt"></a>

### PackedInt.isBigInt : <code>boolean</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.isSafe"></a>

### PackedInt.isSafe : <code>boolean</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.isInitialized"></a>

### PackedInt.isInitialized : <code>boolean</code>
**Kind**: static property of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.encode"></a>

### PackedInt.encode(data) ⇒ <code>number</code>
Encodes a given list of numbers into a single number according to the schema.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>number</code> - encoded number  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> | the list of numbers to encode |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
Person.encode([20, 1])
//=> 41
```
<a name="PackedInt.decode"></a>

### PackedInt.decode(data) ⇒ <code>Object.&lt;string, number&gt;</code>
Decodes an encoded number into it's object representation according to the schema.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>Object.&lt;string, number&gt;</code> - object representation  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>number</code> | encoded number |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
Person.decode(41);
//=> { age: 20, gender: 1 }
```
<a name="PackedInt.isValid"></a>

### PackedInt.isValid(data) ⇒ <code>boolean</code>
Checks if a given set of values or all given pairs of field name and value
are valid according to the schema.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>boolean</code> - whether all pairs are valid  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;number&gt;</code> \| <code>Object.&lt;string, number&gt;</code> | pairs of field name and value to check |

**Example**  
```js
class Person extends PackedInt {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
Person.isValid({age: 100})
//=> true
Person.isValid({age: 100, gender: 3})
//=> false
Person.isValid([100, 1])
//=> true
Person.isValid([100, 3])
//=> false
```
<a name="PackedInt.getMinSize"></a>

### PackedInt.getMinSize(number) ⇒ <code>number</code>
Returns the minimum amount of bits necessary to hold a given number.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: <code>number</code> - the amount of bits  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

**Example**  
```js
PackedInt.getMinSize(100)
//=> 7

PackedInt.getMinSize(2000)
//=> 11

PackedInt.getMinSize(Number.MAX_SAFE_INTEGER)
//=> 53
```
<a name="PackedInt.initialize"></a>

### PackedInt.initialize() ⇒ <code>void</code>
Prepares the class to handle data according to it's schema provided in `PackedInt.fields`.
The method is called automatically the first time the constructor is used.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
<a name="PackedInt.getMatcher"></a>

### PackedInt.getMatcher(matcher) ⇒ [<code>Matcher</code>](#Matcher)
Creates an array of values to be used as a matcher
to efficiently match against multiple instances.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  
**Returns**: [<code>Matcher</code>](#Matcher) - an array of precomputed values  

| Param | Type | Description |
| --- | --- | --- |
| matcher | <code>Object.&lt;string, number&gt;</code> | an object containing field names and their values |

<a name="PackedInt.match"></a>

### PackedInt.match(value, matcher) ⇒ <code>boolean</code>
The static version of `PackedInt#match`, matches a given value against a precomputed matcher.

**Kind**: static method of [<code>PackedInt</code>](#PackedInt)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> \| <code>BigInt</code> | a value to check |
| matcher | [<code>Matcher</code>](#Matcher) | a precomputed set of values |

<a name="SortedArray"></a>

## SortedArray ⇐ <code>Array</code>
Extends built-in Array to efficiently handle sorted data.

**Kind**: global class  
**Extends**: <code>Array</code>  

* [SortedArray](#SortedArray) ⇐ <code>Array</code>
    * _instance_
        * [.compare(a, b)](#SortedArray+compare) ⇒ <code>number</code>
        * [.isSorted()](#SortedArray+isSorted) ⇒ <code>boolean</code>
        * [.isUnique()](#SortedArray+isUnique) ⇒ <code>boolean</code>
        * [.reset(arr)](#SortedArray+reset) ⇒ [<code>SortedArray</code>](#SortedArray)
        * [.range(start, end)](#SortedArray+range) ⇒ [<code>SortedArray</code>](#SortedArray)
        * [.rank(element)](#SortedArray+rank) ⇒ <code>number</code>
        * [.uniquify()](#SortedArray+uniquify) ⇒ [<code>SortedArray</code>](#SortedArray)
    * _static_
        * [.getDifference(a, b, [symmetric], [comparator])](#SortedArray.getDifference) ⇒ <code>Array</code>
        * [.getDifferenceScore(a, b, [symmetric], [comparator])](#SortedArray.getDifferenceScore) ⇒ <code>number</code>
        * [.getIndex(arr, target, [comparator], [rank], [start], [end])](#SortedArray.getIndex) ⇒ <code>number</code>
        * [.getIntersection(a, b, [comparator])](#SortedArray.getIntersection) ⇒ <code>Array</code>
        * [.getIntersectionScore(a, b, [comparator])](#SortedArray.getIntersectionScore) ⇒ <code>number</code>
        * [.getRange(arr, [start], [end], [comparator])](#SortedArray.getRange) ⇒ <code>Array</code>
        * ~~[.getRank(arr, target, [comparator])](#SortedArray.getRank) ⇒ <code>number</code>~~
        * [.getUnion(a, b, [unique], [comparator])](#SortedArray.getUnion) ⇒ <code>Array</code>
        * [.getUnique(arr, [comparator])](#SortedArray.getUnique) ⇒ <code>Array</code>
        * [.isSorted(arr, [comparator])](#SortedArray.isSorted) ⇒ <code>boolean</code>
        * [.isUnique(arr, [comparator])](#SortedArray.isUnique) ⇒ <code>boolean</code>

<a name="SortedArray+compare"></a>

### sortedArray.compare(a, b) ⇒ <code>number</code>
The default comparator.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>\*</code> | the first value |
| b | <code>\*</code> | the second value |

**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
sortedArray.sort();
//=> [ 9, 5, 4, 3, 2 ]
```
<a name="SortedArray+isSorted"></a>

### sortedArray.isSorted() ⇒ <code>boolean</code>
Checks if the array is sorted.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array is sorted  
**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.isSorted();
//=> true
sortedArray.reverse();
sortedArray.isSorted();
//=> false;
```
<a name="SortedArray+isUnique"></a>

### sortedArray.isUnique() ⇒ <code>boolean</code>
Checks if the array has duplicating elements.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array has duplicating elements  
**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.isUnique();
//=> true
sortedArray.push(2);
sortedArray.isUnique();
//=> false;
```
<a name="SortedArray+reset"></a>

### sortedArray.reset(arr) ⇒ [<code>SortedArray</code>](#SortedArray)
Implements in-place replacement of the array elements.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | an array of new elements to use |

**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.reset([1, 2, 3]);
//=> SortedArray [ 1, 2, 3 ]
```
<a name="SortedArray+range"></a>

### sortedArray.range(start, end) ⇒ [<code>SortedArray</code>](#SortedArray)
Returns a range of elements of the array that are greater or equal to the provided
starting element and less or equal to the provided ending element.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: [<code>SortedArray</code>](#SortedArray) - the resulting range of elements  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>\*</code> | the starting element |
| end | <code>\*</code> | the ending element |

**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.range(3, 5);
// => [ 3, 4, 5 ]
sortedArray.range(undefined, 4);
// => [ 2, 3, 4 ]
sortedArray.range(4);
// => [ 4, 5, 8 ]
```
<a name="SortedArray+rank"></a>

### sortedArray.rank(element) ⇒ <code>number</code>
Returns the rank of an element in the array.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the rank in the array  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | the element to look for |

**Example**  
```js
//=> SortedArray [ 2, 3, 4, 5, 9 ];
sortedArray.rank(1);
// => 0
sortedArray.rank(6);
// => 4
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
<a name="SortedArray.getDifference"></a>

### SortedArray.getDifference(a, b, [symmetric], [comparator]) ⇒ <code>Array</code>
Returns the difference of two sorted arrays, i.e. elements present in the first array but not
in the second array. If `symmetric=true` finds the symmetric difference of two arrays, that is,
the elements that are absent in one or another array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>Array</code> - the difference of the arrays  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>Array</code> |  | the first array |
| b | <code>Array</code> |  | the second array |
| [symmetric] | <code>boolean</code> | <code>false</code> | whether to get symmetric difference. |
| [comparator] | <code>function</code> |  | the comparator static used to sort the arrays |

**Example**  
```js
SortedArray.getDifference([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 1, 3, 8 ]

// symmetric difference of sorted arrays:
SortedArray.getDifference(first, second, true);
//=> [ 1, 3, 6, 7, 8, 9 ]
// difference using a custom comparator:
const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedArray.getDifference([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], false, customComparator);
//=> [ 8, 3, 1 ]
```
<a name="SortedArray.getDifferenceScore"></a>

### SortedArray.getDifferenceScore(a, b, [symmetric], [comparator]) ⇒ <code>number</code>
Returns the amount of differing elements in the first array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the amount of differing elements  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>Array</code> |  | the first array |
| b | <code>Array</code> |  | the second array |
| [symmetric] | <code>boolean</code> | <code>false</code> | whether to use symmetric difference |
| [comparator] | <code>function</code> |  | the comparator static used to sort the arrays |

**Example**  
```js
SortedArray.getDifferenceScore([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> 3
```
<a name="SortedArray.getIndex"></a>

### SortedArray.getIndex(arr, target, [comparator], [rank], [start], [end]) ⇒ <code>number</code>
Uses binary search to find the index of an element inside a sorted array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the index of the searched element or it's rank  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array</code> |  | the array to search |
| target | <code>\*</code> |  | the target value to search for |
| [comparator] | <code>function</code> |  | a custom comparator |
| [rank] | <code>boolean</code> | <code>false</code> | whether to return the element's rank if the element isn't found |
| [start] | <code>number</code> | <code>0</code> | the start position of the search |
| [end] | <code>number</code> |  | the end position of the search |

**Example**  
```js
SortedArray.getIndex([1, 2, 3, 4, 8], 4);
//=> 3
```
<a name="SortedArray.getIntersection"></a>

### SortedArray.getIntersection(a, b, [comparator]) ⇒ <code>Array</code>
Returns the intersection of two sorted arrays.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>Array</code> - the intersection of the arrays  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> | the first array |
| b | <code>Array</code> | the second array |
| [comparator] | <code>function</code> | the comparator static used to sort the arrays |

**Example**  
```js
SortedArray.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 2, 4 ]

// intersection using a custom comparator:
const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedArray.getIntersection([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], customComparator);
//=> [ 4, 2 ]
```
<a name="SortedArray.getIntersectionScore"></a>

### SortedArray.getIntersectionScore(a, b, [comparator]) ⇒ <code>number</code>
Returns the amount of common elements in two sorted arrays.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the amount of different elements  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> | the first array |
| b | <code>Array</code> | the second array |
| [comparator] | <code>function</code> | the comparator static used to sort the arrays |

**Example**  
```js
SortedArray.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> 2
```
<a name="SortedArray.getRange"></a>

### SortedArray.getRange(arr, [start], [end], [comparator]) ⇒ <code>Array</code>
Returns a range of elements of a sorted array from the start through the end inclusively.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>Array</code> - the range of items  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array |
| [start] | <code>number</code> | the starting item |
| [end] | <code>number</code> | the ending item |
| [comparator] | <code>function</code> | a custom comparator |

**Example**  
```js
SortedArray.getRange([1, 2, 3, 4, 8], 2, 4);
//=> [ 2, 3, 4 ]

const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedArray.getRange([8, 4, 3, 2, 1], 8, 3, customComparator);
//=> [ 8, 4, 3 ]
```
<a name="SortedArray.getRank"></a>

### ~~SortedArray.getRank(arr, target, [comparator]) ⇒ <code>number</code>~~
***Deprecated***

Uses binary search to find the rank of an item inside a sorted array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>number</code> - the rank of the searched item  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array to search |
| target | <code>\*</code> | the target value to search for |
| [comparator] | <code>function</code> | a custom comparator |

**Example**  
```js
SortedArray.getRank([1, 2, 3, 4, 8], 5);
//=> 4

const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
SortedArray.getRank([8, 4, 3, 2, 1], 5, customComparator);
//=> 3
```
<a name="SortedArray.getUnion"></a>

### SortedArray.getUnion(a, b, [unique], [comparator]) ⇒ <code>Array</code>
Returns the union of two sorted arrays as a sorted array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>Array</code> - the union of the arrays  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>Array</code> |  | the first array |
| b | <code>Array</code> |  | the second array |
| [unique] | <code>boolean</code> | <code>false</code> | whether to avoid duplicating items when merging unique arrays |
| [comparator] | <code>function</code> |  | the comparator static used to sort the arrays |

**Example**  
```js
SortedArray.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
//=> [ 1, 2, 2, 3, 4, 4, 6, 7, 8, 9 ]

// union of sorted arrays without duplicates:
SortedArray.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9], true);
//=> [ 1, 2, 3, 4, 6, 7, 8, 9 ]

//union using a custom comparator:
SortedArray.getUnion([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], true, customComparator);
//=> [ 9, 8, 7, 6, 4, 3, 2, 1 ]
```
<a name="SortedArray.getUnique"></a>

### SortedArray.getUnique(arr, [comparator]) ⇒ <code>Array</code>
Returns an array of unique elements from a sorted array.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>Array</code> - the sorted array without duplicates  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the sorted array |
| [comparator] | <code>function</code> | a custom comparator |

**Example**  
```js
SortedArray.getUnique([1, 1, 2, 2, 3, 4]);
//=> [ 1, 2, 3, 4 ]
```
<a name="SortedArray.isSorted"></a>

### SortedArray.isSorted(arr, [comparator]) ⇒ <code>boolean</code>
Checks whether an array is sorted according to a provided comparator.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array is sorted  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array to check |
| [comparator] | <code>function</code> | a custom comparator |

**Example**  
```js
SortedArray.isSorted([1, 2, 3, 4, 8]);
//=> true
```
<a name="SortedArray.isUnique"></a>

### SortedArray.isUnique(arr, [comparator]) ⇒ <code>boolean</code>
Checks whether an array has any duplicating elements.

**Kind**: static method of [<code>SortedArray</code>](#SortedArray)  
**Returns**: <code>boolean</code> - whether the array has duplicating elements  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | the array to check |
| [comparator] | <code>function</code> | a custom comparator |

**Example**  
```js
SortedArray.isUnique([1, 2, 2, 3, 4]);
//=> false
```
<a name="GridFactory"></a>

## GridFactory(Base) ⇒ [<code>Grid</code>](#Grid)
Creates a Grid class extending a given Array-like class.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Base | [<code>IndexedCollection</code>](#IndexedCollection) | 

**Example**  
```js
const ArrayGrid = Grid(Array);
```
<a name="GridOptions"></a>

## GridOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| rows | <code>number</code> | the number of rows |
| columns | <code>number</code> | the number of columns |
| pad | <code>\*</code> | the initial value of cells |

<a name="IndexedCollection"></a>

## IndexedCollection : <code>ArrayConstructor</code> \| <code>Int8ArrayConstructor</code> \| <code>Int8ArrayConstructor</code> \| <code>Uint8ArrayConstructor</code> \| <code>Uint8ClampedArrayConstructor</code> \| <code>Int16ArrayConstructor</code> \| <code>Uint16ArrayConstructor</code> \| <code>Int32ArrayConstructor</code> \| <code>Uint32ArrayConstructor</code> \| <code>Float32ArrayConstructor</code> \| <code>Float64ArrayConstructor</code>
**Kind**: global typedef  
<a name="Matcher"></a>

## Matcher : <code>Array.&lt;number, number&gt;</code> \| <code>Array.&lt;BigInt, BigInt&gt;</code>
**Kind**: global typedef  
<a name="FieldDescription"></a>

## FieldDescription : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | field name |
| size | <code>number</code> | size of the field in bits |

