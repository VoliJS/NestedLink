# Immutable Structures

This guide introduces immutable object and collection provided by `PureObject` and `PureCollection`. These classes enable you to define deeply immutable data models while offering convenient update, mapping, and indexing methods. All modifications return new frozen instances, preserving React-friendly immutability and referential stability. These helpers also work seamlessly with pointer-based state hooks like `useClassPtr`, enabling clean, immutable state management in React components.

## Using in React components

You can use `PureObject` with the `useClassPtr` hook to manage state in React components. This gives you immutable state updates with pointer-based access and derived fields.

```ts
class Person extends PureObject {
    name = '';
    age = 0;
    email = '';
    dob = null;
    dod = null;

    get isTeen() {
        return this.age >= 13 && this.age <= 19;
    }

    markDeceased() {
        return this.withChanges({
            dod: new Date()
        });
    }
}

const personPtr = useClassPtr(Person);

function died() {
    personPtr.update(x => x.markDeceased());
}
```

You can also modify properties directly using field pointers:

```ts
personPtr.at('dod').set(new Date());
```

This model lets you combine the benefits of immutable data structures and pointer-based local updates, ideal for robust component state.

## Creating an object

Extend `PureObject` to create your own immutable class. Use the `PureObject.object()` factory to create instances:

```ts
class Person extends PureObject {
    name = '';
    age = 0;

    initialize() {
        if (this.age < 0) {
            throw new Error('Age cannot be negative');
        }
    }
}

const person = Person.object({ name: 'Alice', age: 30 });
```

You can also pass a `parse` function to transform raw input values—for example, converting date strings into `Date` objects when initializing from backend data:

```ts
class Person extends PureObject {
    ...
    static parse( raw ){
        return {
            ...raw,
            age: Number(raw.age),
            dob: new Date(raw.dob)
        }
    }
}

// dataFromApi = { name: 'Alice', age: '30', dob: '2000-01-01' }
const person = Person.object(dataFromApi, Person.parse);
```

## Updating an object

To update an immutable object, use `.withChanges()`:

```ts
const updated = person.withChanges({ age: 31 });
```

You can also pass a mutation function:

```ts
const updated = person.withChanges(p => {
    p.age++;
});
```

## Creating an array of objects

You can use `PureObject.array()` to create an array of immutable objects:

```ts
const people = Person.array([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
]);
```

Similarly to `PureObject.object()`, you can use a `parse` function when initializing an array. The function will be called for each member of the array:

```ts
const people = Person.array(dataFromApi, Person.parse);
```

## Using PureCollection

Extend `PureCollection<T>` to manage immutable indexed collections:

```ts
class People extends PureCollection<Person> {
    getId(p: Person) {
        return p.name;
    }
}
```

Create instances using `.from()`:

```ts
const group = People.from([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
```

## Updating a collection

Collections are also immutable. Use `.add()`, `.remove()`, `.sort()`, or `.map()` to create new instances:

```ts
const next = group.add(Person.object({ name: 'Carol', age: 40 }));
const removed = next.remove('Bob');
```

## Fast lookup by ID

`PureCollection` supports indexed access using `.get()`:

```ts
const bob = group.get('Bob');
```

Index is lazily built on first access for performance.

## Notes

- All created instances are deeply frozen.
- The `.initialize()` hook can be used to compute or validate properties.
- These helpers are fully compatible with pointer-based state management.