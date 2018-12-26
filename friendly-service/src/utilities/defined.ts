export function defined<T>(x: T | undefined): T {
    if (x === undefined) {
        throw new Error(`Expected defined value: ${x}`);
    }
    return x;
}