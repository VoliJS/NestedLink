# PurePtr (formerly NestedLink / ValueLink)

PurePtr is a lightweight library for managing two-way data binding and immutable updates in React applications. It provides a consistent, functional-style way to manage state: you create pointers (PurePtr) to values (including deeply nested objects or arrays), and then update or bind them to UI controls without mutating the underlying data.

Key Features

- Immutable state updates: Safely update arrays or objects by returning new, shallow-copied versions.
- Nested “sub-pointers”: Access and update nested keys in a composable, type-safe way.
- Form-friendly: Easily bind pointers to standard form elements or custom React components.
- Validation: Integrate with or build simple chainable validation checks.
- TypeScript: Strong type inference and compile-time checks for nested structures.

## 1. Quick Start

Install via npm:

```bash
npm install @pure-ptr/core
```

Import it in your React code:

```typescript
import PurePtr from 'pureptr';
```

For convenience with React Hooks, you can wrap PurePtr.value (or mutable) in a custom hook to manage local state. Many developers also create custom pointers that integrate with Redux or other libraries.

## 2. Creating Pointers

### 2.1. PurePtr.value(value, nextValue => void) 

Creates a custom pointer to a value along with a function for persisting changes.

Example

const userPtr = PurePtr.value({}, newUser => userArrayPtr.push(newUser));

// Use in a child component:
<EditUser valuePtr={userPtr} />

EditUser will call userPtr.set(...) or userPtr.update(...), causing newUser to be passed to the parent’s push(...).

2.2. PurePtr.mutable(object) 

Builds a pointer that directly mutates the passed object/array—a quick approach for testing or bridging with non-React state, though it forfeits some immutability.

const state = { a: 1 };
const $state = PurePtr.mutable(state);

$state.at('a').set(2);
console.log(state.a); // 2

2.3. Bulk Utilities 
	•	PurePtr.getValues({ [key]: PurePtr })
Returns an object of pointer values, omitting the $ prefix from property names in the result.
	•	PurePtr.getErrors({ [key]: PurePtr })
Collects validation errors from multiple pointers into one object.
	•	PurePtr.setValues({ [key]: PurePtr }, valuesObject)
Assigns multiple pointer values at once using the valuesObject data. Useful for bulk form updates.

3. Pointers to Objects and Arrays

Pointers can shallow-copy nested data automatically, so you don’t have to manually clone structures.

3.1. Accessing Nested Keys 

// Suppose $object is a pointer to { array: [ { name: 'Alice' } ] }
const $name = $object.at('array').at(0).at('name');
$name.set('Joe'); 
// This triggers an immutable update to the top-level structure

3.2. Picking Multiple Keys 

const user$ = $user.pick('name', 'email');
const { name, email } = user$; // sub-pointers for each key

3.3. Mapping Arrays or Objects 

const list = $stringArray.map(($item, index) => {
  if ($item.value) {
    return (
      <div key={index}>
        <input {...$item.props} />
      </div>
    );
  }
});

This is helpful for rendering lists with controlled inputs and filtering out unwanted elements.

4. Binding to Controls

Each pointer has a .props getter returning an object { value, onChange }. This integrates seamlessly with standard form controls:

<input {...$ptr.props} />

Custom Data-Bound Controls

Build your own:

const Input = ({ $value, ...props }) => (
  <div className={`form-control ${$value.error ? 'error' : ''}`}>
    <input
      {...props}
      value={$value.value}
      onChange={e => $value.set(e.target.value)}
    />
    { $value.error && <div className="validation-error">{$value.error}</div> }
  </div>
);

5. Offhand Boolean Pointers 

5.1. $array.contains(element) 

Returns a pointer whose value is true if element is in the array, and false otherwise. Assign true to add element, or false to remove it.

const optionXBoolPtr = arrayPtr.contains('optionX');

5.2. ptrToAny.equals(whenTrue) 

Returns a pointer whose value is true if the parent pointer equals whenTrue, else false. Setting it to true updates the parent pointer to whenTrue, while false sets it to null.

const optionXPtr = stringPtr.equals('optionX');

5.3. ptrToAny.enabled(defaultValue = '') 

Returns a pointer whose value is false if the parent pointer is null or undefined, otherwise true. Setting it to true uses defaultValue, and false resets the parent pointer to null.

const textPtr = this.ptrAt('text');
<Checkbox checkedPtr={textPtr.enabled()} />
<Input valuePtr={textPtr} />

6. Custom Pointers 

6.1. ptr.onChange(callback: (newValue) => void) 

Wraps the pointer so that whenever it’s updated, callback(newValue) is called. The pointer then proceeds to update the underlying data.

6.2. ptr.pipe(transform: (nextValue, prevValue) => any) 

Intercepts nextValue before setting it, letting you transform or validate the value. If transform returns undefined, the update is canceled.

<Input valuePtr={ strPtr.pipe(x => x && x.toUpperCase()) } />

7. TypeScript Support 

PurePtr<T> is parameterized by T, the type of the enclosed value. This ensures:
	•	Accurate autocompletion for nested structures.
	•	Compile-time errors if you try to access invalid properties or pass incorrect types.

interface MyState {
  name: string;
}

const namePtr = this.ptrAt('name'); // PurePtr<string>
const invalidPtr = this.ptrAt('age'); // Error: no 'age' in 'MyState'

8. Updating Pointers 

8.1. ptr.set(x) and ptr.requestChange(x) 

Replaces the pointer’s value with x:

<button onClick={() => boolPtr.set(!boolPtr.value)}>
  Toggle
</button>

8.2. ptr.update(oldValue => newValue) 

Calls the provided function with the current value, then sets the result:

<button onClick={() => boolPtr.update(x => !x)}>
  Toggle
</button>

8.3. ptr.action((oldValue, event) => newValue) : (event) => void 

Generates an event handler for UI. The returned function gets event, calls your transform, and updates the pointer accordingly.

<input 
  value={ptr.value} 
  onChange={ptr.action((oldValue, e) => e.target.value)} 
/>

8.4. Immutable Updates for Objects/Arrays 

When you call ptr.update(...) on an object or array pointer, the library shallow-copies the structure, letting you mutate the copy:

$object.update(obj => {
  obj.a = 1; // safe to do
  return obj;
});

8.5. Array Helpers 
	•	$array.splice(...)
	•	$array.push(...)
	•	$array.unshift(...)

Each mimics the corresponding native method but returns void, since they produce new structures internally.

9. Validation 

9.1. ptr.check(value => boolean, error = 'Invalid value') : PurePtr

Chains a validation check. If it fails, sets ptr.error to the given message (or object). You can chain multiple check calls; the first failure sets the error.

const $num = this.ptrAt('num')
  .check(x => x >= 0, 'Cannot be negative')
  .check(x => x <= 5, 'Too large');

9.2. ptr.error 

Holds the current validation error, if any. Use it in custom controls to display messages.

10. What’s New / Refined 

10.1. Enhanced Immutable Patterns 
	•	Better TypeScript: The library more robustly infers types for deep updates.
	•	Refined object/array pointers: Shallow cloning makes functional updates straightforward without boilerplate.

10.2. withChanges 

For certain extended classes (e.g., PureObject or advanced usage), a withChanges(...) method:
	•	Clones the object.
	•	Accepts either an object to merge or a mutation callback.
	•	Freezes the new object to prevent accidental mutations.

const updated = userPtr.withChanges({ age: 26, isActive: true });
// or:
const updated2 = userPtr.withChanges(u => {
  u.age = 26;
  u.isActive = true;
});

11. Conclusion 

PurePtr simplifies two-way binding, deep updates, and validation in React by focusing on immutability and functional patterns. Whether you’re handling simple form inputs or complex nested data, PurePtr gives you fine-grained control over your state without sacrificing clarity.

Explore advanced usage patterns, demos, or open an issue on our repository if you have feature requests or questions. Happy pointing!