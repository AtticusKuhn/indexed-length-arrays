type NumberLike = string | number | bigint

type NumericString = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

// #region Rightmost string extraction helpers
type SplitRightMost<Type> = Type extends NumberLike
    ? `${Type}` extends `${infer Rest}${NumericString}`
    ? `${Type}` extends `${Rest}${infer Right}`
    ? [Rest, Right]
    : never
    : ['', '']
    : never

type SplitRest = 0

type SplitRight = 1

type SplitGet<
    Splitted,
    Key extends SplitRest | SplitRight
    > = Splitted[Key & keyof Splitted]

type SplitGetRest<Splitted> = SplitGet<Splitted, SplitRest>

type SplitGetRight<Splitted> = SplitGet<Splitted, SplitRight>
// #endregion

// #region Digit to tuple helpers
type DigitToTupleMap<V = unknown> = {
    '': [],
    '0': [],
    '1': [V],
    '2': [V, V],
    '3': [V, V, V],
    '4': [V, V, V, V],
    '5': [V, V, V, V, V],
    '6': [V, V, V, V, V, V],
    '7': [V, V, V, V, V, V, V],
    '8': [V, V, V, V, V, V, V, V],
    '9': [V, V, V, V, V, V, V, V, V],
}

type CreateTuple<Length> = DigitToTupleMap[Length & keyof DigitToTupleMap]
// #endregion

type IsFalsy<Type> = Type extends '' | 0 | false | null | undefined
    ? true
    : false

type SumDigits<First, Second, Third = '0'> = [
    ...CreateTuple<First>,
    ...CreateTuple<Second>,
    ...CreateTuple<Third>
]['length']

type Sum<
    First,
    Second,
    CarryOver = '0',
    SplitFirst = SplitRightMost<First>,
    FirstRight = SplitGetRight<SplitFirst>,
    FirstRest = SplitGetRest<SplitFirst>,
    SplitSecond = SplitRightMost<Second>,
    SecondRight = SplitGetRight<SplitSecond>,
    SecondRest = SplitGetRest<SplitSecond>,
    > = SplitRightMost<
        SumDigits<FirstRight, SecondRight, CarryOver>
    > extends [infer CurrentCarryOver, infer Current]
    ? IsFalsy<FirstRest> extends true
    ? IsFalsy<SecondRest> extends true
    // FirstRest = 0, SecondRest = 0
    ? `${CurrentCarryOver & string}${Current & string}`
    // FirstRest = 0, SecondRest = x
    : `${Sum<SecondRest, CurrentCarryOver>}${Current & string}`
    : IsFalsy<SecondRest> extends true
    // FirstRest = x, SecondRest = 0
    ? `${Sum<FirstRest, CurrentCarryOver>}${Current & string}`
    // FirstRest = x, SecondRest = x
    : `${Sum<FirstRest, SecondRest, CurrentCarryOver>}${Current & string}`
    : never
type LengthToTuple<
    Length extends number | string,
    Expansion extends ReadonlyArray<unknown> = []
    > = `${Expansion['length']}` extends `${Length}`
    ? Expansion
    : LengthToTuple<Length, [...Expansion, unknown]>
type Split<
    Type extends string,
    Separator extends string = ''
    > = Type extends `${infer Current}${Separator}${infer Rest}`
    ? [Current, ...Split<Rest>]
    : []
type TenFold<Type extends ReadonlyArray<unknown>> = [
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
    ...Type,
]
type ToTuple<Count extends string | number> = Count extends '' | 0
    ? []
    : Split<`${Count}`> extends [...any, infer Current]
    ? `${Count}` extends `${infer Rest}${Current & string}`
    ? [...TenFold<ToTuple<Rest>>, ...LengthToTuple<Current & string>]
    : never
    : LengthToTuple<Count>
type ToNumber<Type extends string> = Type extends ''
    ? never
    : ToTuple<Type> extends { length: infer Length }
    ? Length
    : never
export type add<A, B> = ToNumber<Sum<A, B>>;


type ParseNegativeNumber<N extends number> = `${N}` extends `-${infer PN}` ? PN : N;

type CompareShort<A extends number | string, B extends number | string, Arr extends any[] = []> =
    `${Arr['length']}` extends `${A}`
    ? false
    : `${Arr['length']}` extends `${B}`
    ? true
    : CompareShort<A, B, [any, ...Arr]>

type LengthOfString<S extends string, R extends any[] = []> = S extends `${infer First}${infer Rest}` ? LengthOfString<Rest, [...R, First]> : R["length"]

type Compare<A extends number | string, B extends number | string> = LengthOfString<`${A}`> extends LengthOfString<`${B}`> ?
    (
        `${A}` extends `${infer C}${infer RestA}` ? (
            `${B}` extends `${infer D}${infer RestB}` ? (
                C extends D ? Compare<RestA, RestB> : CompareShort<C, D>
            ) : never
        ) : never
    ) : Compare<LengthOfString<`${A}`>, LengthOfString<`${B}`>>

type ComparatorI<A extends number | string, B extends number | string> =
    A extends string
    ? B extends string
    ? Compare<B, A>
    : false
    : B extends string
    ? true
    : Compare<A, B>

export type isGreaterThan<A extends number, B extends number> =
    A extends B
    ? false
    : ComparatorI<ParseNegativeNumber<A>, ParseNegativeNumber<B>>;

export type And<A extends boolean, B extends Boolean> = A extends true ? B extends true ? true : false : false;

export type validIndex<idx extends number, length extends number> = And<isGreaterThan<add<length, 1>, idx>, isGreaterThan<idx, -1>>;

