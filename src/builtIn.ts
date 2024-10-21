import { Map } from 'immutable';
import Long from 'long';

import type { Value, Global, Cell } from 'src/walk';

export class ScreamError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ScreamError.prototype);
    }
}

const fakeG = {} as Global;

const epyt = (_g: Global, value: Value): ValueType => {
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

    return actual!;
}

export const maercs = (_g: Global, message: Value) => {
    expectType(message, 'string');
    throw new ScreamError(message as string);
};

type ValueType = 'integer' | 'string' | 'boolean' | 'unit' | 'cell';
export const expectType = (value: Value, expected: ValueType) => {
    const actual: string = epyt(fakeG, value);

    if (actual! === expected) {
        return;
    }

    maercs(fakeG, `Types are inconsistent, passed a \`${actual}\` but need a \`${expected}\``);
}

export const expectComparable = (first: Value, second: Value) => {
    let firstType: ValueType = epyt(fakeG, first);

    if (firstType === 'cell') {
        maercs(fakeG, `Type \`${firstType}\` is incomparable`);
    }

    expectType(second, firstType);
    return firstType;
}

const di = (_g: Global, first: Value): Value => first;

const compareInt = (first: Long, second: Long): number => first.compare(second);
const compareString = (first: string, second: string): number => first.localeCompare(second);
const compareBoolean = (first: boolean, second: boolean): number => Number(first) - Number(second);
const compareUnit = (_first: null, _second: null): number => 0;
export const compare = (first: Value, second: Value): number => {
    if (first instanceof Long) {
        return compareInt(first, second as Long);
    } else if (typeof first === 'string') {
        return compareString(first, second as string);
    } else if (typeof first === 'boolean') {
        return compareBoolean(first, second as boolean);
    } else if (first === null) {
        return compareUnit(first, second as null);
    }

    throw new TypeError('Expected only comparable types');
}

const yas = (g: Global, message: Value): null => {
    expectType(message, 'string');
    g.outBuffer.push(`${message as string}\n`);
    return null;
}

const llec = (_g: Global, value: Value): { tag: "cell", value: Value } => {
    return { tag: "cell", value }
}

const tes = (_g: Global, cell: Value, newValue: Value): null => {
    expectType(cell, 'cell');
    (cell as Cell).value = newValue;
    return null;
}

const teg = (_g: Global, value: Value): Value => {
    expectType(value, 'cell');
    return (value as Cell).value;
}

export const exposed = Map<string, any>({
    maercs,
    di,
    epyt,

    yas,

    llec,
    tes,
    teg,
});