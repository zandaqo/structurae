## Classes

<dl>
<dt><a href="#BitField">BitField</a></dt>
<dd></dd>
<dt><a href="#Grid">Grid</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd></dd>
<dt><a href="#RecordArray">RecordArray</a> ⇐ <code>DataView</code></dt>
<dd><p>Extends DataView to use ArrayBuffer as an array of records or C-like structs.</p>
</dd>
<dt><a href="#SortedArray">SortedArray</a> ⇐ <code><a href="#SortedCollection">SortedCollection</a></code></dt>
<dd></dd>
<dt><a href="#SortedCollection">SortedCollection</a> ⇐ <code><a href="#CollectionConstructor">CollectionConstructor</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#GridMixin">GridMixin(Base)</a> ⇒ <code><a href="#Grid">Grid</a></code></dt>
<dd><p>Creates a Grid class extending a given Array-like class.</p>
</dd>
<dt><a href="#Comparator">Comparator(a, b)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#SortedMixin">SortedMixin(Base)</a> ⇒ <code><a href="#SortedCollection">SortedCollection</a></code></dt>
<dd><p>Creates a SortedCollection class extending a given Array-like class.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AnyNumber">AnyNumber</a> : <code>number</code> | <code>BigInt</code></dt>
<dd></dd>
<dt><a href="#FieldName">FieldName</a> : <code>number</code> | <code>string</code></dt>
<dd></dd>
<dt><a href="#UnpackedInt">UnpackedInt</a> : <code>Object.&lt;string, number&gt;</code></dt>
<dd></dd>
<dt><a href="#Field">Field</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Matcher">Matcher</a> : <code>Array</code></dt>
<dd></dd>
<dt><a href="#Masks">Masks</a> : <code>Object.&lt;string, AnyNumber&gt;</code></dt>
<dd></dd>
<dt><a href="#CollectionConstructor">CollectionConstructor</a> : <code>ArrayConstructor</code> | <code>Int8ArrayConstructor</code> | <code>Int8ArrayConstructor</code> | <code>Uint8ArrayConstructor</code> | <code>Uint8ClampedArrayConstructor</code> | <code>Int16ArrayConstructor</code> | <code>Uint16ArrayConstructor</code> | <code>Int32ArrayConstructor</code> | <code>Uint32ArrayConstructor</code> | <code>Float32ArrayConstructor</code> | <code>Float64ArrayConstructor</code></dt>
<dd></dd>
<dt><a href="#Collection">Collection</a> : <code>Array</code> | <code>Int8Array</code> | <code>Uint8Array</code> | <code>Uint8ClampedArray</code> | <code>Int16Array</code> | <code>Uint16Array</code> | <code>Int32Array</code> | <code>Uint32Array</code> | <code>Float32Array</code> | <code>Float64Array</code></dt>
<dd></dd>
<dt><a href="#Coordinates">Coordinates</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#RecordField">RecordField</a></dt>
<dd></dd>
</dl>

<a name="BitField"></a>

## BitField
**Kind**: global class  

* [BitField](#BitField)
    * [new BitField([data])](#new_BitField_new)
    * _instance_
        * [.value](#BitField+value) : <code>number</code> \| <code>BigInt</code>
        * [.get(field)](#BitField+get) ⇒ <code>number</code>
        * [.set(field, value)](#BitField+set) ⇒ [<code>BitField</code>](#BitField)
        * [.has(...fields)](#BitField+has) ⇒ <code>boolean</code>
        * [.match(matcher)](#BitField+match) ⇒ <code>boolean</code>
        * [.toObject()](#BitField+toObject) ⇒ [<code>UnpackedInt</code>](#UnpackedInt)
    * _static_
        * [.fields](#BitField.fields) : [<code>Array.&lt;FieldName&gt;</code>](#FieldName) \| [<code>Array.&lt;Field&gt;</code>](#Field)
        * [.size](#BitField.size) : <code>number</code>
        * [.zero](#BitField.zero) : [<code>AnyNumber</code>](#AnyNumber)
        * [.one](#BitField.one) : [<code>AnyNumber</code>](#AnyNumber)
        * [.two](#BitField.two) : [<code>AnyNumber</code>](#AnyNumber)
        * [.masks](#BitField.masks) : [<code>Masks</code>](#Masks)
        * [.mask](#BitField.mask) : [<code>AnyNumber</code>](#AnyNumber)
        * [.offsets](#BitField.offsets) : [<code>Masks</code>](#Masks)
        * [.isBigInt](#BitField.isBigInt) : <code>boolean</code>
        * [.isSafe](#BitField.isSafe) : <code>boolean</code>
        * [.isInitialized](#BitField.isInitialized) : <code>boolean</code>
        * [.encode(data)](#BitField.encode) ⇒ [<code>AnyNumber</code>](#AnyNumber)
        * [.decode(data)](#BitField.decode) ⇒ [<code>UnpackedInt</code>](#UnpackedInt)
        * [.isValid(data)](#BitField.isValid) ⇒ <code>boolean</code>
        * [.getMinSize(number)](#BitField.getMinSize) ⇒ <code>number</code>
        * [.initialize()](#BitField.initialize) ⇒ <code>void</code>
        * [.getMatcher(matcher)](#BitField.getMatcher) ⇒ [<code>Matcher</code>](#Matcher)
        * [.match(value, matcher)](#BitField.match) ⇒ <code>boolean</code>

<a name="new_BitField_new"></a>

### new BitField([data])

| Param | Type | Default |
| --- | --- | --- |
| [data] | [<code>AnyNumber</code>](#AnyNumber) \| <code>Array.&lt;number&gt;</code> | <code>0</code> | 

**Example**  
```js
class Person extends BitField {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
new Person([20, 1]).value
//=> 41
new Person(41).value
//=> 41
```
<a name="BitField+value"></a>

### bitField.value : <code>number</code> \| <code>BigInt</code>
**Kind**: instance property of [<code>BitField</code>](#BitField)  
<a name="BitField+get"></a>

### bitField.get(field) ⇒ <code>number</code>
Returns the value of a given field.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>number</code> - value value of the field  

| Param | Type | Description |
| --- | --- | --- |
| field | [<code>Field</code>](#Field) | name of the field |

**Example**  
```js
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
```
<a name="BitField+set"></a>

### bitField.set(field, value) ⇒ [<code>BitField</code>](#BitField)
Stores a given value in a field.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>BitField</code>](#BitField) - the instance  

| Param | Type | Description |
| --- | --- | --- |
| field | [<code>Field</code>](#Field) | name of the field |
| value | <code>number</code> | value of the field |

**Example**  
```js
class Person extends BitField {}
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
<a name="BitField+has"></a>

### bitField.has(...fields) ⇒ <code>boolean</code>
Checks if an instance has all the specified fields set to 1. Useful for bit flags.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether all the specified fields are set in the instance  

| Param | Type | Description |
| --- | --- | --- |
| ...fields | [<code>Field</code>](#Field) | names of the fields to check |

**Example**  
```js
const SettingsFlags = BinariusFactory(['notify', 'premium', 'moderator']);
const settings = SettingsFlags([1, 0, 1]);
settings.has('notify', 'moderator');
//=> true
settings.has('notify', 'premium');
//=> false
```
<a name="BitField+match"></a>

### bitField.match(matcher) ⇒ <code>boolean</code>
Checks if the instance contains all the key-value pairs listed in matcher.
Use `ParseInt.getMatcher` to get an array of precomputed values
that you can use to efficiently compare multiple instances
to the same key-value pairs as shown in the examples below.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether the instance matches with the provided fields  

| Param | Type | Description |
| --- | --- | --- |
| matcher | [<code>UnpackedInt</code>](#UnpackedInt) \| [<code>Matcher</code>](#Matcher) | an object with key-value pairs,                                                or an array of precomputed matcher values |

**Example**  
```js
class Person extends BitField {}
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
<a name="BitField+toObject"></a>

### bitField.toObject() ⇒ [<code>UnpackedInt</code>](#UnpackedInt)
Returns the object representation of the instance,
with field names as properties with corresponding values.

**Kind**: instance method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>UnpackedInt</code>](#UnpackedInt) - the object representation of the instance  
**Example**  
```js
class Person extends BitField {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.toObject();
//=> { age: 20, gender: 1 }
```
<a name="BitField.fields"></a>

### BitField.fields : [<code>Array.&lt;FieldName&gt;</code>](#FieldName) \| [<code>Array.&lt;Field&gt;</code>](#Field)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.size"></a>

### BitField.size : <code>number</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.zero"></a>

### BitField.zero : [<code>AnyNumber</code>](#AnyNumber)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.one"></a>

### BitField.one : [<code>AnyNumber</code>](#AnyNumber)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.two"></a>

### BitField.two : [<code>AnyNumber</code>](#AnyNumber)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.masks"></a>

### BitField.masks : [<code>Masks</code>](#Masks)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.mask"></a>

### BitField.mask : [<code>AnyNumber</code>](#AnyNumber)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.offsets"></a>

### BitField.offsets : [<code>Masks</code>](#Masks)
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.isBigInt"></a>

### BitField.isBigInt : <code>boolean</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.isSafe"></a>

### BitField.isSafe : <code>boolean</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.isInitialized"></a>

### BitField.isInitialized : <code>boolean</code>
**Kind**: static property of [<code>BitField</code>](#BitField)  
<a name="BitField.encode"></a>

### BitField.encode(data) ⇒ [<code>AnyNumber</code>](#AnyNumber)
Encodes a given list of numbers into a single number according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>AnyNumber</code>](#AnyNumber) - encoded number  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>Array.&lt;AnyNumber&gt;</code>](#AnyNumber) | the list of numbers to encode |

**Example**  
```js
class Person extends BitField {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
Person.encode([20, 1])
//=> 41
```
<a name="BitField.decode"></a>

### BitField.decode(data) ⇒ [<code>UnpackedInt</code>](#UnpackedInt)
Decodes an encoded number into it's object representation according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>UnpackedInt</code>](#UnpackedInt) - object representation  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>AnyNumber</code>](#AnyNumber) | encoded number |

**Example**  
```js
class Person extends BitField {}
Person.fields = [
 { name: 'age', size: 7 },
 { name: 'gender', size: 1 },
];
Person.decode(41);
//=> { age: 20, gender: 1 }
```
<a name="BitField.isValid"></a>

### BitField.isValid(data) ⇒ <code>boolean</code>
Checks if a given set of values or all given pairs of field name and value
are valid according to the schema.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: <code>boolean</code> - whether all pairs are valid  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>AnyNumber</code>](#AnyNumber) \| [<code>UnpackedInt</code>](#UnpackedInt) | pairs of field name and value to check |

**Example**  
```js
class Person extends BitField {}
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
Prepares the class to handle data according to it's schema provided in `BitField.fields`.
The method is called automatically the first time the constructor is used.

**Kind**: static method of [<code>BitField</code>](#BitField)  
<a name="BitField.getMatcher"></a>

### BitField.getMatcher(matcher) ⇒ [<code>Matcher</code>](#Matcher)
Creates an array of values to be used as a matcher
to efficiently match against multiple instances.

**Kind**: static method of [<code>BitField</code>](#BitField)  
**Returns**: [<code>Matcher</code>](#Matcher) - an array of precomputed values  

| Param | Type | Description |
| --- | --- | --- |
| matcher | [<code>UnpackedInt</code>](#UnpackedInt) | an object containing field names and their values |

<a name="BitField.match"></a>

### BitField.match(value, matcher) ⇒ <code>boolean</code>
The static version of `BitField#match`, matches a given value against a precomputed matcher.

**Kind**: static method of [<code>BitField</code>](#BitField)  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>AnyNumber</code>](#AnyNumber) | a value to check |
| matcher | [<code>Matcher</code>](#Matcher) | a precomputed set of values |

<a name="Grid"></a>

## Grid ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [Grid](#Grid) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * [new Grid([options], [data])](#new_Grid_new)
    * _instance_
        * [.columns](#Grid+columns) ⇒ <code>void</code>
        * [.columns](#Grid+columns) : <code>number</code>
        * [.rows](#Grid+rows) : <code>number</code>
        * [.getIndex(row, column)](#Grid+getIndex) ⇒ <code>\*</code>
        * [.get(row, column)](#Grid+get) ⇒ <code>\*</code>
        * [.set(row, column, value)](#Grid+set) ⇒ [<code>Grid</code>](#Grid)
        * [.getCoordinates(index)](#Grid+getCoordinates) ⇒ [<code>Coordinates</code>](#Coordinates)
        * [.toArrays([withPadding])](#Grid+toArrays) ⇒ <code>Array.&lt;Array.&lt;\*&gt;&gt;</code>
    * _static_
        * [.fromArrays(arrays, [pad])](#Grid.fromArrays) ⇒ [<code>Grid</code>](#Grid)

<a name="new_Grid_new"></a>

### new Grid([options], [data])
Passes all arguments to the Base class except if called with a special set of grid options,
in that case creates and empty grid of specified parameter.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.rows] | <code>number</code> | <code>1</code> | the number of rows |
| [options.columns] | <code>number</code> | <code>2</code> | the number of columns |
| [options.pad] | <code>\*</code> | <code>0</code> | the initial value of cells |
| [data] | [<code>Collection</code>](#Collection) |  |  |

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

### grid.set(row, column, value) ⇒ [<code>Grid</code>](#Grid)
Sets the element at given coordinates.

**Kind**: instance method of [<code>Grid</code>](#Grid)  
**Returns**: [<code>Grid</code>](#Grid) - the instance  

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

<a name="RecordArray"></a>

## RecordArray ⇐ <code>DataView</code>
Extends DataView to use ArrayBuffer as an array of records or C-like structs.

**Kind**: global class  
**Extends**: <code>DataView</code>  

* [RecordArray](#RecordArray) ⇐ <code>DataView</code>
    * [new RecordArray(fields, [size], [buffer], [byteOffset], [byteLength])](#new_RecordArray_new)
    * [.size](#RecordArray+size) : <code>number</code>
    * [.get(index, field)](#RecordArray+get) ⇒ <code>\*</code>
    * [.set(index, field, value)](#RecordArray+set) ⇒ <code>this</code>
    * [.getString(offset, littleEndian, size)](#RecordArray+getString) ⇒ <code>Uint8Array</code>
    * [.setString(offset, value)](#RecordArray+setString) ⇒ <code>Uint8Array</code>
    * [.getByteOffset(index, field)](#RecordArray+getByteOffset) ⇒ <code>number</code>
    * [.toObject(index)](#RecordArray+toObject) ⇒ <code>Object</code>

<a name="new_RecordArray_new"></a>

### new RecordArray(fields, [size], [buffer], [byteOffset], [byteLength])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fields | [<code>Array.&lt;RecordField&gt;</code>](#RecordField) |  | an array field descriptions |
| [size] | <code>number</code> | <code>1</code> | the amount of structs in the array,                        optional if an existing ArrayBuffer is used |
| [buffer] | <code>ArrayBuffer</code> |  | an existing ArrayBuffer to use for structs |
| [byteOffset] | <code>number</code> |  | the byteOffset in an existing ArrayBuffer |
| [byteLength] | <code>number</code> |  | the byteLength in an existing ArrayBuffer |

<a name="RecordArray+size"></a>

### recordArray.size : <code>number</code>
The amount of structs in the array.

**Kind**: instance property of [<code>RecordArray</code>](#RecordArray)  
**Example**  
```js
const people = new RecordArray([
  { name: 'age', type: 'Uint8' },
  { name: 'score', type: 'Float32' },
], 20);

people.size
//=> 20
```
<a name="RecordArray+get"></a>

### recordArray.get(index, field) ⇒ <code>\*</code>
Returns the value of a given field of a struct at the given index.

**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  
**Returns**: <code>\*</code> - value of the field  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of a struct |
| field | <code>string</code> | the name of the field |

**Example**  
```js
const people = new RecordArray([
  { name: 'age', type: 'Uint8' },
  { name: 'score', type: 'Float32' },
], 20);

person.get(0, 'age');
```
<a name="RecordArray+set"></a>

### recordArray.set(index, field, value) ⇒ <code>this</code>
Sets a value to a field of a struct at a given index.

**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of a struct |
| field | <code>string</code> | the name of the field |
| value | <code>\*</code> | the value to be set |

**Example**  
```js
const people = new RecordArray([
  { name: 'age', type: 'Uint8' },
  { name: 'score', type: 'Float32' },
], 20);

person.set(0, 'age', 10);
person.get(0, 'age');
//=> 10
```
<a name="RecordArray+getString"></a>

### recordArray.getString(offset, littleEndian, size) ⇒ <code>Uint8Array</code>
**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  

| Param | Type |
| --- | --- |
| offset | <code>number</code> | 
| littleEndian | <code>boolean</code> | 
| size | <code>number</code> | 

<a name="RecordArray+setString"></a>

### recordArray.setString(offset, value) ⇒ <code>Uint8Array</code>
**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  

| Param | Type |
| --- | --- |
| offset | <code>number</code> | 
| value | [<code>Collection</code>](#Collection) | 

<a name="RecordArray+getByteOffset"></a>

### recordArray.getByteOffset(index, field) ⇒ <code>number</code>
Returns the byte offset in the ArrayBuffer of a given field.

**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  
**Returns**: <code>number</code> - the byte offset  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the struct |
| field | <code>string</code> | the name of the field |

<a name="RecordArray+toObject"></a>

### recordArray.toObject(index) ⇒ <code>Object</code>
The object representation of a given struct.

**Kind**: instance method of [<code>RecordArray</code>](#RecordArray)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the struct |

**Example**  
```js
const people = new RecordArray([
  { name: 'age', type: 'Uint8' },
  { name: 'score', type: 'Float32' },
], 20);

person.set(0, 'age', 10).set(0, 'score', 5.0).toObject(0);
//=> { age: 10, score: 5.0 }
```
<a name="SortedArray"></a>

## SortedArray ⇐ [<code>SortedCollection</code>](#SortedCollection)
**Kind**: global class  
**Extends**: [<code>SortedCollection</code>](#SortedCollection)  

* [SortedArray](#SortedArray) ⇐ [<code>SortedCollection</code>](#SortedCollection)
    * [.set(arr)](#SortedArray+set) ⇒ [<code>SortedArray</code>](#SortedArray)
    * [.uniquify()](#SortedArray+uniquify) ⇒ [<code>SortedArray</code>](#SortedArray)
    * [.compare(a, b)](#SortedCollection+compare) ⇒ <code>number</code>
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
<a name="SortedCollection+compare"></a>

### sortedArray.compare(a, b) ⇒ <code>number</code>
The default comparator.

**Kind**: instance method of [<code>SortedArray</code>](#SortedArray)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>\*</code> | the first value |
| b | <code>\*</code> | the second value |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
sortedCollection.sort();
//=> [ 9, 5, 4, 3, 2 ]
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

| Param | Type | Description |
| --- | --- | --- |
| start | <code>\*</code> | the starting element |
| end | <code>\*</code> | the ending element |
| [subarray] | <code>boolean</code> | return a subarray instead of copying resulting value with slice |

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
**Kind**: global class  
**Extends**: [<code>CollectionConstructor</code>](#CollectionConstructor)  

* [SortedCollection](#SortedCollection) ⇐ [<code>CollectionConstructor</code>](#CollectionConstructor)
    * _instance_
        * [.compare(a, b)](#SortedCollection+compare) ⇒ <code>number</code>
        * [.isSorted()](#SortedCollection+isSorted) ⇒ <code>boolean</code>
        * [.isUnique()](#SortedCollection+isUnique) ⇒ <code>boolean</code>
        * [.range(start, end, [subarray])](#SortedCollection+range) ⇒ [<code>SortedCollection</code>](#SortedCollection)
        * [.rank(element)](#SortedCollection+rank) ⇒ <code>number</code>
    * _static_
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

<a name="SortedCollection+compare"></a>

### sortedCollection.compare(a, b) ⇒ <code>number</code>
The default comparator.

**Kind**: instance method of [<code>SortedCollection</code>](#SortedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>\*</code> | the first value |
| b | <code>\*</code> | the second value |

**Example**  
```js
//=> SortedCollection [ 2, 3, 4, 5, 9 ];
sortedCollection.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
sortedCollection.sort();
//=> [ 9, 5, 4, 3, 2 ]
```
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

| Param | Type | Description |
| --- | --- | --- |
| start | <code>\*</code> | the starting element |
| end | <code>\*</code> | the ending element |
| [subarray] | <code>boolean</code> | return a subarray instead of copying resulting value with slice |

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
<a name="SortedCollection.getDifference"></a>

### SortedCollection.getDifference(a, b, [symmetric], [comparator], [container]) ⇒ <code>Array</code>
Returns the difference of two sorted arrays, i.e. elements present in the first array but not
in the second array. If `symmetric=true` finds the symmetric difference of two arrays, that is,
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
<a name="AnyNumber"></a>

## AnyNumber : <code>number</code> \| <code>BigInt</code>
**Kind**: global typedef  
<a name="FieldName"></a>

## FieldName : <code>number</code> \| <code>string</code>
**Kind**: global typedef  
<a name="UnpackedInt"></a>

## UnpackedInt : <code>Object.&lt;string, number&gt;</code>
**Kind**: global typedef  
<a name="Field"></a>

## Field : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | [<code>FieldName</code>](#FieldName) | name of the field |
| [size] | <code>number</code> | size in bits |

<a name="Matcher"></a>

## Matcher : <code>Array</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| 0 | [<code>AnyNumber</code>](#AnyNumber) | value |
| 1 | [<code>AnyNumber</code>](#AnyNumber) | mask |

<a name="Masks"></a>

## Masks : <code>Object.&lt;string, AnyNumber&gt;</code>
**Kind**: global typedef  
<a name="CollectionConstructor"></a>

## CollectionConstructor : <code>ArrayConstructor</code> \| <code>Int8ArrayConstructor</code> \| <code>Int8ArrayConstructor</code> \| <code>Uint8ArrayConstructor</code> \| <code>Uint8ClampedArrayConstructor</code> \| <code>Int16ArrayConstructor</code> \| <code>Uint16ArrayConstructor</code> \| <code>Int32ArrayConstructor</code> \| <code>Uint32ArrayConstructor</code> \| <code>Float32ArrayConstructor</code> \| <code>Float64ArrayConstructor</code>
**Kind**: global typedef  
<a name="Collection"></a>

## Collection : <code>Array</code> \| <code>Int8Array</code> \| <code>Uint8Array</code> \| <code>Uint8ClampedArray</code> \| <code>Int16Array</code> \| <code>Uint16Array</code> \| <code>Int32Array</code> \| <code>Uint32Array</code> \| <code>Float32Array</code> \| <code>Float64Array</code>
**Kind**: global typedef  
<a name="Coordinates"></a>

## Coordinates : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| row | <code>number</code> | row index |
| column | <code>number</code> | column index |

<a name="RecordField"></a>

## RecordField
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| type | <code>string</code> |  |
| [size] | <code>number</code> | the maximum size in bytes for a string type |
| [littleEndian] | <code>boolean</code> |  |

