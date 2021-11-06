import { add, validIndex } from "./utils";

class IndexedArray<Length extends number, type> extends Array<type> {
    [n: number]: type;
    length!: Length;
    constructor(a: Length) {
        super(a)
    }
    toString(): string {
        return JSON.stringify(this)
    }
    get<idx extends number>(index: idx): validIndex<idx, Length> extends true ? type : undefined {
        //@ts-ignore
        return this[index];
    }
    static fromArray<type>(arr: type[]): IndexedArray<typeof arr["length"], type> {
        let a = new IndexedArray<typeof arr["length"], type>(arr.length)
        Object.assign(a, arr)
        return a;
    }
    //@ts-ignore
    push<inputArray extends type[], newLength extends inputArray["length"]>(...args: inputArray): IndexedArray<add<Length, newLength>, type> {
        //@ts-ignore
        return IndexedArray.fromArray([...this, ...args]);
    }


    shift(): type | undefined {
        throw new Error("Method not implemented.");
    }

}
//@ts-ignore
const test: IndexedArray<5, number> = IndexedArray.fromArray([1, 2, 3, 4, 5])

const test2 = test.push(1, 2, 3, 4)
const item = test2.get(10)
console.log("item is", item)