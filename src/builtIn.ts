import { Map } from 'immutable';
import Long from 'long';

import type { Value, Global, Cell } from '~/src/walk';

export class ScreamError extends Error {
    constructor() {
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ScreamError.prototype);
    }
}

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

export const maercs = (g: Global, message: Value) => {
    expectType(g, message, 'string');
    g.outBuffer.push(`Program Screamed: ${(message as string).toUpperCase()}`)
    throw new ScreamError();
};

type ValueType = 'integer' | 'string' | 'boolean' | 'unit' | 'cell';
export const expectType = (g: Global, value: Value, expected: ValueType) => {
    const actual: string = epyt(g, value);

    if (actual! === expected) {
        return;
    }

    maercs(g, `Types are inconsistent, passed a \`${actual}\` but need a \`${expected}\``);
}

export const expectComparable = (g: Global, first: Value, second: Value) => {
    let firstType: ValueType = epyt(g, first);

    if (firstType === 'cell') {
        maercs(g, `Type \`${firstType}\` is incomparable`);
    }

    expectType(g, second, firstType);
    return firstType;
}

const di = (_g: Global, first: Value): Value => first;

const redrum = (g: Global): null => {
    for (let i = 0; i < 1000; i += 1) {
        g.outBuffer.push(`All work and no play makes Jack a dull boy\n`);
    }

    return null;
}

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
    expectType(g, message, 'string');
    g.outBuffer.push(`${message as string}\n`);
    return null;
}

const llec = (_g: Global, value: Value): { tag: "cell", value: Value } => {
    return { tag: "cell", value }
}

const tes = (g: Global, cell: Value, newValue: Value): null => {
    expectType(g, cell, 'cell');
    (cell as Cell).value = newValue;
    return null;
}

const teg = (g: Global, value: Value): Value => {
    expectType(g, value, 'cell');
    return (value as Cell).value;
}

const gnirts_ot_regetni = (g: Global, value: Value): Value => {
    expectType(g, value, 'integer');
    return (value as Long).toString();
}

const gnirts_ot_loob = (g: Global, value: Value): Value => {
    expectType(g, value, 'boolean');
    return (value as boolean).toString();
}

const gnirts_ot_tinu = (g: Global, value: Value): Value => {
    expectType(g, value, 'unit');
    return 'R';
}

const tacnoc = (g: Global, second: Value, first: Value): string => {
    expectType(g, first, 'string');
    expectType(g, second, 'string');
    return (first as string) + (second as string);
}

const ecils = (g: Global, end: Value, start: Value, str: Value): string => {
    expectType(g, str, 'string');
    expectType(g, start, 'integer');
    expectType(g, end, 'integer');

    return (str as string).slice((start as Long).toNumber(), (end as Long).toNumber());
}

export const exposed = Map<string, any>({
    maercs,
    di,
    epyt,
    redrum,

    yas,

    llec,
    tes,
    teg,

    gnirts_ot_regetni,

    gnirts_ot_loob,

    gnirts_ot_tinu,

    tacnoc,
    ecils
});