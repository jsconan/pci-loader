[**pci-loader**](../../../../README.md)

***

# Interface: Instance

Defined in: [src/lib/types.d.ts:62](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L62)

## Extended by

- [`Constructor`](Constructor.md)

## Properties

### constructor

> **constructor**: [`Constructor`](Constructor.md)

Defined in: [src/lib/types.d.ts:63](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L63)

***

### registerRegistry

> **registerRegistry**: `Record`\<`string`, [`ModuleRegistration`](../type-aliases/ModuleRegistration.md)\>

Defined in: [src/lib/types.d.ts:79](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L79)

## Methods

### addImportMap()

> **addImportMap**(`map`): `void`

Defined in: [src/lib/types.d.ts:78](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L78)

#### Parameters

##### map

[`ImportMap`](ImportMap.md)

#### Returns

`void`

***

### delete()

> **delete**(`name`): `object`

Defined in: [src/lib/types.d.ts:67](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L67)

#### Parameters

##### name

`string`

#### Returns

`object`

***

### entries()

> **entries**(): `IterableIterator`\<`string`\>

Defined in: [src/lib/types.d.ts:68](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L68)

#### Returns

`IterableIterator`\<`string`\>

***

### get()

> **get**(`name`): `object`

Defined in: [src/lib/types.d.ts:65](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L65)

#### Parameters

##### name

`string`

#### Returns

`object`

***

### getRegister()

> **getRegister**(): [`ModuleRegistration`](../type-aliases/ModuleRegistration.md) \| `undefined`

Defined in: [src/lib/types.d.ts:77](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L77)

#### Returns

[`ModuleRegistration`](../type-aliases/ModuleRegistration.md) \| `undefined`

***

### has()

> **has**(`name`): `boolean`

Defined in: [src/lib/types.d.ts:64](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L64)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### import()

> **import**(`name`, `parentUrl?`, `meta?`): `Promise`\<`unknown`\>

Defined in: [src/lib/types.d.ts:69](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L69)

#### Parameters

##### name

`string`

##### parentUrl?

`string`

##### meta?

`object`

#### Returns

`Promise`\<`unknown`\>

***

### instantiate()

> **instantiate**(`url`, `firstParentUrl`): `Promise`\<[`ModuleRegistration`](../type-aliases/ModuleRegistration.md) \| `undefined`\>

Defined in: [src/lib/types.d.ts:71](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L71)

#### Parameters

##### url

`string`

##### firstParentUrl

`string`

#### Returns

`Promise`\<[`ModuleRegistration`](../type-aliases/ModuleRegistration.md) \| `undefined`\>

***

### register()

> **register**(`nameOrDeps`, `depsOrExports`, `exports?`): `void`

Defined in: [src/lib/types.d.ts:72](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L72)

#### Parameters

##### nameOrDeps

`string` | `string`[]

##### depsOrExports

`string`[] | [`ModuleExportSignature`](../type-aliases/ModuleExportSignature.md)

##### exports?

[`ModuleExportSignature`](../type-aliases/ModuleExportSignature.md)

#### Returns

`void`

***

### resolve()

> **resolve**(`name`, `parentUrl`): `Promise`\<`string`\>

Defined in: [src/lib/types.d.ts:70](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L70)

#### Parameters

##### name

`string`

##### parentUrl

`string`

#### Returns

`Promise`\<`string`\>

***

### set()

> **set**(`name`, `module`): `void`

Defined in: [src/lib/types.d.ts:66](https://github.com/jsconan/pci-loader/blob/0bf555818137e3e2900f667be7325a3a028d0555/src/lib/types.d.ts#L66)

#### Parameters

##### name

`string`

##### module

`object`

#### Returns

`void`
