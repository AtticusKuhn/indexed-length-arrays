import { add, subtract, validIndex } from "./utils";


// type LengthOf<Arr extends any[]> = Arr extends [infer _head, ...(infer tail)] ? add<1, LengthOf<tail>> : unknown;
type repeat = any;
class IndexedArray<Length extends number, type> extends Array<type> {
    [n: number]: type;
    length!: Length;
    constructor(...args: type[]) {
        super()
        return IndexedArray.fromArray([...this, ...args]);
    }
    toString(): string {
        return JSON.stringify(this)
    }
    get<idx extends number>(index: idx): validIndex<idx, Length> extends true ? type : undefined {
        //@ts-ignore
        return this[index];
    }
    set<idx extends number>(index: idx, item: type): validIndex<idx, Length> extends true ? type : never {
        this[index] = item;
        //@ts-ignore
        return this;
    }
    static fromArray<type, arrLength extends number>(arr: type[]): IndexedArray<arrLength, type> {
        let a = new IndexedArray<typeof arr["length"], type>(...arr)
        Object.assign(a, arr)
        //@ts-ignore
        return a;

    }

    //@ts-ignore
    push<inputArray extends type[], newLength extends inputArray["length"]>(...args: inputArray): IndexedArray<add<Length, newLength>, type> {
        //@ts-ignore
        return IndexedArray.fromArray([...this, ...args]);
    }
    fromArray<inputArray extends type[], newLength extends inputArray["length"]>(args: inputArray): IndexedArray<add<Length, newLength>, type> {
        //@ts-ignore
        return IndexedArray.fromArray([...this, ...args]);
    }
    //@ts-ignore
    slice<num extends number>(index: num): IndexedArray<subtract<Length, num>, type> {
        return this.slice(index);
    }

}
const test = new IndexedArray(4)

const test2 = test.push(1, 2, 3, 4)
const item = test2.get(5)
console.log("item is", item)
