[**pci-loader**](../../../../README.md)

***

# Interface: Config

Defined in: [src/lib/types.d.ts:262](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L262)

## Properties

### boundTo?

> `optional` **boundTo**: `object`

Defined in: [src/lib/types.d.ts:265](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L265)

#### Index Signature

\[`key`: `string`\]: [`Response`](../type-aliases/Response.md)

***

### ondone()?

> `optional` **ondone**: (`interaction`, `response`, `state`, `status`) => `void`

Defined in: [src/lib/types.d.ts:267](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L267)

#### Parameters

##### interaction

[`Interaction`](Interaction.md)

##### response

[`Response`](../type-aliases/Response.md)

##### state

[`State`](State.md)

##### status

`string`

#### Returns

`void`

***

### onready()

> **onready**: (`interaction`, `state`) => `void`

Defined in: [src/lib/types.d.ts:266](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L266)

#### Parameters

##### interaction

[`Interaction`](Interaction.md)

##### state

[`State`](State.md)

#### Returns

`void`

***

### properties

> **properties**: `Record`\<`string`, `unknown`\>

Defined in: [src/lib/types.d.ts:263](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L263)

***

### status?

> `optional` **status**: `string`

Defined in: [src/lib/types.d.ts:268](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L268)

***

### templateVariables?

> `optional` **templateVariables**: `Record`\<`string`, [`Response`](../type-aliases/Response.md)\>

Defined in: [src/lib/types.d.ts:264](https://github.com/jsconan/pci-loader/blob/af96c6e74f902d53b7813b22e08c81504096d239/src/lib/types.d.ts#L264)
