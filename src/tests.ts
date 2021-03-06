import { add, And, isGreaterThan, subtract, validIndex } from "./utils";
export const test1: validIndex<0, 100> = true;
export const test2: validIndex<-100, 100> = false;
export const test3: validIndex<100, 100> = true;
export const test35: validIndex<30, 100> = true;
export const test4: validIndex<101, 100> = false;
export const test5: isGreaterThan<101, 100> = true;
export const test6: isGreaterThan<30, 30> = false;
export const test7: isGreaterThan<29, 30> = false;
export const test9: And<true, true> = true;
export const test10: And<true, false> = false
export const test11: And<false, false> = false;
export const test11x: add<10, -1> = 9;
export const test12: subtract<20, 12> = 8;
export const test13: subtract<3, 1> = 2;


