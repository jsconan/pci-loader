[**pci-loader**](../../../../README.md)

***

# Interface: Registry

Defined in: [src/lib/types.d.ts:289](https://github.com/jsconan/pci-loader/blob/634585163ed784ea002528d26d7ecf06bef7e8d2/src/lib/types.d.ts#L289)

## Extends

- [`RegistryContext`](RegistryContext.md).[`RegistryGetter`](RegistryGetter.md)

## Properties

### getInstance()

> **getInstance**: (`typeIdentifier`, `container`, `configuration`, `state`) => `void`

Defined in: [src/lib/types.d.ts:287](https://github.com/jsconan/pci-loader/blob/634585163ed784ea002528d26d7ecf06bef7e8d2/src/lib/types.d.ts#L287)

#### Parameters

##### typeIdentifier

`string`

##### container

`Element`

##### configuration

[`Config`](Config.md)

##### state

[`State`](State.md)

#### Returns

`void`

#### Inherited from

[`RegistryGetter`](RegistryGetter.md).[`getInstance`](RegistryGetter.md#getinstance)

***

### register()

> **register**: (`interaction`) => `void`

Defined in: [src/lib/types.d.ts:284](https://github.com/jsconan/pci-loader/blob/634585163ed784ea002528d26d7ecf06bef7e8d2/src/lib/types.d.ts#L284)

#### Parameters

##### interaction

[`Registration`](Registration.md)

#### Returns

`void`

#### Inherited from

[`RegistryContext`](RegistryContext.md).[`register`](RegistryContext.md#register)
