// TODO get secondary sort to work properly with ascending logic
export function dynamicSort<T>(array: T[] | undefined, field: keyof T, asc: boolean, compareFunc?: (((a: T, b: T) => number) | undefined), secondaryField?: keyof T): undefined | T[] {
    if (array === undefined) {
        return undefined;
    } else if (array?.length < 1) {
        return undefined;
    }

    // secondary field sorts are always ascending
    if (secondaryField)
        array = array.sort((a, b) => a[secondaryField] < b[secondaryField] ? -1 : 1);

    let cFunc: any;
    if (!compareFunc) {
        cFunc = (a: T, b: T) => {
            return a[field] < b[field] ? -1 : 1;
        };
    } else {
        cFunc = compareFunc;
    }
    return asc ? array.sort(cFunc) : array.sort(cFunc).reverse();
}
