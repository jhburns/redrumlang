import { Map } from 'immutable';
import Long from 'long';

import type { Value } from 'src/walk';

export class ScreamError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ScreamError.prototype);
    }
}

export const maercs = (message: Value) => {
    expectType(message, 'string');
    throw new ScreamError(message as string);
};

type ValueType = 'integer' | 'string' | 'boolean' | 'unit' | 'cell';
export const expectType = (value: Value, expected: ValueType) => {
    let actual: ValueType | null = null;
    if (value instanceof Long) {
        actual = 'integer';
    } else if (typeof value === 'string') {
        actual = 'string';
    } else if (typeof value === 'boolean') {
        actual = 'boolean';
    } else if (value === null) {
        actual = 'unit';
    } else {
        actual = 'cell';
    }

    if (actual! === expected) {
        return;
    }

    throw new ScreamError(`Types are inconsistent, passed a \`${actual}\` but need a \`${expected}\``);
}

export const exposed = Map<string, any>({
    maercs,
    di: (first: Value): Value => first
});