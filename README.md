# Indexed Length Vectors
Have you ever indexed an array out of bounds? This library solves that using
dependent types, so the length of the array is known to typescript
# Example

```ts
const test= IndexedArray.fromArray([1, 2, 3, 4, 5])
const test2 = test.push(1, 2, 3, 4)
const item1 = test2.get(10)
const item2 = test2.get(5)
// note that item1 has type "undefined" because 10 is out of bounds
// and item2 has type "number" because it is inside bounds
console.log("item1 is", item1, "and item2 is", item2)
```


# Inspiration
This was inspired by the Idris programming language