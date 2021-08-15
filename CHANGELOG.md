# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-pre.8] - 2021-08-15

### Changed

- BitField and BigBitField classes are refactored and simplified with common
  typings. `Big/BitField.initialize` methods are removed as redundant when
  mixins are used.

## [4.0.0-pre.7] - 2021-07-19

### Added

- `StringView#includes` method.
- `ArrayView#at` & `VectorView#at` methods.

### Changed

- `StringView#search` renamed into `StringView#indexof`.

## [4.0.0-pre.6] - 2021-06-26

### Added

- Support typing View schemas through ViewSchema interface.

## [4.0.0-pre.5] - 2021-06-24

### Added

- `View.create` accepts object constructor as optional second parameter.

## [4.0.0-pre.1] - 2021-06-16

### Changed

(breaking changes)

- The library is rewritten in TypeScript and distributed as ECMAScript modules
  targeting ES2020.
- Structures extending built-in interfaces (e.g. TypedArrays, Array) no longer
  overload their parent constructor instead using static factory method
  `create`, e.g. instead of `new Pool(30)` use `Pool.create(30)`.
- Adjacency structures are reworked: they no longer extend grid structures,
  directed and undirected matrices are split into different classes, unweighted
  list is removed, the names are changed accordingly.
- Binary structures are reworked and centralized with the addition of the `View`
  class that serves as the entry point for all views. Mixins related to binary
  structures are removed, use `View.create` to initialize view classes for all
  supported types, including objects, maps, arrays, etc.
- `BitFieldMixin` no longer automatically creates `BigBitField`, use
  `BigBitFieldMixin` explicitly if bigints are needed.

### Removed

- SortedCollection is removed in favor of SortedArray.
- BinaryProtocol is removed, part of its functionality is implemented in View.
- UnweightedList is removed.

## [3.3.0] - 2020-07-14

- Add VectorView

## [3.2.0] - 2020-07-09

- Support required fields and default values in MapView.
- Support nested MapViews.

## [3.1.1] - 2020-06-25

### Changed

- Optimize StringView encoding and decoding.

## [3.1.0] - 2020-05-28

### Added

- Support setting maximum size for strings and arrays in MapView.

## [3.0.6] - 2020-04-28

### Changed

- Use custom UTF8 encoding for StringView as a workaround to solve performance
  issues in V8.

## [3.0.5] - 2020-04-07

### Fixed

- TypeViewMixin caching custom TypeView classes.

### Changed

- Export TypedArrayView.
- Rename *View.Array into *View.ArrayClass.

## [3.0.4] - 2020-04-05

### Added

- Export TypeView class.
- Add *View.Array field to allow using custom ArrayView classes.

## [3.0.3] - 2020-04-03

### Added

- MapView can be used within a larger buffer.

## [3.0.2] - 2020-04-02

### Added

- MapView can use custom ObjectView classes to initialize nested objects.

## [3.0.1] - 2020-04-02

### Fixed

- `MapView.from` treats undefined and null fields as missing.

## [3.0.0] - 2020-03-30

### Changed

(breaking changes)

- ObjectView and all related *View classes use JSON Schema for schema
  definition.
- All *View classes use little endian encoding by default.
- `ObjectView#get`, `ArrayView#get`, `MapView#get` return JavaScript values, use
  `*View.getView` methods to get views.
- CollectionView is replaced by MapView
- TypedArrayView extends ArrayView, and TypedArrayViewMixin is replaced with
  ArrayViewMixin

## [2.3.0] - 2020-03-10

### Added

- Add static `toJSON` methods to View classes

### Changed

- 2x speed up View encoding/decoding by avoiding extra DataView instantiations.
- (potentially breaking) `TypeView.get` & `TypeView.set` are renames into
  `TypeView.toJSON` and `TypeView.from` respectively.

## [2.2.0] - 2020-02-26

### Added

- Support boolean type in ObjectView.
- Support type aliases in ObjectView.
- Cache ArrayView & TypedArrayView classes to avoid duplications.
- TypeView class to simplify creation of custom types for ObjectView.

### Changed

- (potentially breaking) Adding custom types to ObjectView is reworked. Custom
  types are now expected to be extensions of existing *View classes. A special
  TypeView class is added for types that extend number types.

## [2.1.0] - 2020-02-11

### Added

- BinaryProtocol class to simplify operating on tagged ObjectView.

## [2.0.1] - 2020-01-09

### Fixed

- TypeScript type declarations for ObjectView.

## [2.0.0] - 2019-11-21

### Removed

Deprecated classes and methods:

- Remove RecordArray (consider using ObjectView instead).
- Remove StringArrayView (use ArrayView instead).
- Remove `toObject` methods of *View classes (use `toJSON` methods instead).

### Changed

- Rename `BitField.fields` to `BitField.schema`, simplify the schema definition.
- BitField no longer implicitly switches to using BigInts.
- Add BigBitField that uses BigInts for bitfields longer than 31 bits.
- BitFieldMixin automatically switches to BigBitField if the size of the
  bitfield exceeds 31 bits.
- BitField no longer auto-initializes upon first call, use
  `BitField.initialize()` or BitFieldMixin to initialize the class after
  creation.

## [1.8.0] - 2019-09-27

### Added

- Support default field values in ObjectView.

### Changed

- (potentially breaking) `ObjectView.from` no longer initializes ObjectView upon
  the first call. Call `ObjectView.intialize()` upon setting the schema
  (`ObjectView.schema`) for the extending class, or use ObjectViewMixin

## [1.7.5] - 2019-09-22

### Added

- Add BitFieldMixin.

### Fixed

- Avoid BigInts in RecordArray if not supported.

## [1.7.4] - 2019-09-21

### Added

- Add ObjectViewMixin and expose ArrayView.
- Add ObjectView#getView.

## [1.7.3] - 2019-09-13

### Fixed

- Handle non-string values in StringView.from

## [1.7.2] - 2019-09-13

### Added

- Add StringView.from that uses TextEncoder#encodeInto

### Changed

- Support strings in ArrayView replacing StringArrayView

## [1.7.1] - 2019-09-11

### Added

- Support custom types in nested ObjectViews

## [1.7.0] - 2019-09-09

### Added

- Support custom types in ObjectView
- Add getValue methods to View classes
- Add toJSON methods and deprecate toObject in View classes

## [1.6.1] - 2019-08-20

### Fixed

- Add iterators in TypeScript definitions

## [1.6.0] - 2019-08-17

### Added

- Add CollectionView

## [1.5.0] - 2019-06-28

### Added

- Add StringArrayView class to support arrays of strings in ObjectView

## [1.4.0] - 2019-06-20

### Added

- Support setting endiannes for TypedArrayViews
- Make TypedArrayViews public

## [1.3.1] - 2019-06-19

### Added

- ArrayView.of & TypedArrayView.of methods

### Changed

- Reworked ObjectView and ArrayView for better performance

## [1.3.0] - 2019-06-15

### Added

- ObjectView, ArrayView, and TypedArrayView classes

## [1.2.1] - 2019-06-10

### Fix

- Correct byte offsets for strings in RecordArray

## [1.2.0] - 2019-06-10

### Added

- Support TypedArray fields in RecordArray

## [1.1.1] - 2019-06-09

### Added

- RecordArray#fromObject

## [1.1.0] - 2019-06-07

### Added

- BitArray
- RankedBitArray

### Changed

- Pool extends BitArray

## [1.0.1] - 2019-06-04

### Fixed

- Set correct size for Pool.
