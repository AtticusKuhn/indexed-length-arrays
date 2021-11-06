type IntoTuple<T, V, M = T> = T extends [infer F, ...infer R]
    ? V extends F ? M : IntoTuple<R, V, M>
    : M extends any[] ? [...M, V] : never
type AppendTo<O, K extends string, V> = {
    [kk in keyof O | K]: kk extends K
    ? kk extends keyof O
    ? O[kk] extends any[]
    ? IntoTuple<O[kk], V>
    : V extends O[kk] ? O[kk] : [O[kk], V]
    : V
    : kk extends keyof O ? O[kk] : never
}
type ParseQueryString<Q extends string, P = {}> = Q extends `${infer K}=${infer V}&${infer R}`
    ? ParseQueryString<R, AppendTo<P, K, V>>
    : Q extends `${infer K}&${infer R}`
    ? ParseQueryString<R, AppendTo<P, K, true>>
    : Q extends `${infer K}=${infer V}`
    ? AppendTo<P, K, V>
    : Q extends ``
    ? P
    : AppendTo<P, Q, true>
type Compute<T> = Pick<T, keyof T>

type Merge<Acc extends object, K extends string, V extends string | true> =
    // remove any existing key because we're going to update it
    Omit<Acc, K> &
    Record<K,
        K extends keyof Acc
        ? Acc[K] extends (infer U)[] // existing key
        ? V extends U // existing value is an array
        ? Acc[K] // value already exists, just return existing array
        // the Extract is because TS is not smart enough to know Acc[K] is an array
        : [...Extract<Acc[K], unknown[]>, V] // add value to array
        : V extends Acc[K] // existing value is only one value
        ? V // already exists
        : [Acc[K], V] // create a new array with both values
        : V // new key
    >

type ParseQueryStringHelper<S extends string, Acc extends object> =
    // base case
    S extends '' ? Acc :
    // parse a 'key=value' and recurse
    S extends `${infer K}=${infer V}&${infer Rest}` ? ParseQueryStringHelper<Rest, Merge<Acc, K, V>> :
    // parse just a 'key' and recurse
    S extends `${infer K}&${infer Rest}` ? ParseQueryStringHelper<Rest, Merge<Acc, K, true>> :
    // parse a 'key=value'
    S extends `${infer K}=${infer V}` ? Merge<Acc, K, V> :
    // parse just a 'key'
    Merge<Acc, S, true>
// without this Compute<...>, the tests don't pass because of the Omit<Acc, K> & Record<K, ...>
// in Merge
// e.g. ParseQueryString<'k1&k2=v2'> == Omit<Merge<{}, 'k1', true>, 'k2'> & Record<'k2', 'v2'>
// type ParseQueryString<S extends string> = Compute<ParseQueryStringHelper<S, {}>>
type MapDict = {
    s: string
    d: number
}

type Format<T extends string> =
    T extends `${string}%${infer M}${infer Rest}`
    ? M extends keyof MapDict
    ? (x: MapDict[M]) => Format<Rest>
    : Format<Rest>
    : string
type printf = Format<"hi %d %s">
type Example = ParseQueryString<"hey=bye&hrub=werwerwer">
