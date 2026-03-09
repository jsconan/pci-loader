[**pci-loader**](../../README.md)

***

# Function: timedPromise()

> **timedPromise**\<`T`\>(`promise`, `options?`): `Promise`\<`T`\>

Defined in: [src/lib/timeout.ts:17](https://github.com/jsconan/pci-loader/blob/634585163ed784ea002528d26d7ecf06bef7e8d2/src/lib/timeout.ts#L17)

Manage a promise with a timeout.
A race condition is created between the original promise and a timeout promise.

## Type Parameters

### T

`T`

## Parameters

### promise

`Promise`\<`T`\>

The promise to manage.

### options?

[`PromiseTimeoutOptions`](../../types/type-aliases/PromiseTimeoutOptions.md) = `{}`

The timeout options.

## Returns

`Promise`\<`T`\>

A promise that either resolves or rejects based on the original promise or the timeout.
