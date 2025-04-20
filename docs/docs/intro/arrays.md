# Array pointers

When a pointer targets an array, it provides convenient methods for immutable updates and iteration.

## Adding elements

Use `.push()` to add an item to the end, or `.unshift()` to add to the beginning:

```ts
itemsPtr.push(newItem);
itemsPtr.unshift(newItem);
```

## Removing elements

You can remove items by index with `.removeAt()` or based on condition with `.remove()`:

```ts
itemsPtr.removeAt(1);
itemsPtr.remove((item, i) => item.id === targetId);
```

## Mapping and filtering

The `.map()` method returns pointers to each element in the array:

```ts
itemsPtr.map((itemPtr, i) => (
    <Input key={i} valuePtr={itemPtr} />
));
```

You can also filter the array and get element pointers:

```ts
const visible = itemsPtr.filter((item, i) => item.visible);
```

## Finding and updating

Use `.find()` to get a pointer to a specific item:

```ts
const itemPtr = itemsPtr.find((item, i) => item.id === 'abc');
itemPtr?.set(updatedValue);
```

## Splicing

You can splice the array immutably:

```ts
itemsPtr.splice(1, 2); // removes two elements starting from index 1
```

## Accessing a specific element

Use `.at(index)` to access a pointer to an element:

```ts
const third = itemsPtr.at(2);
third.set('updated');
```
