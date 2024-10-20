import { Map } from 'immutable';
import type { Value } from 'src/walk';

export class ScreamError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ScreamError.prototype);
    }
}

export const maercs = (message: string) => { throw new ScreamError(message) };

export const all = Map<string, any>({
    maercs,
});