# Getting Started

Welcome to **PurePtr**, a lightweight pointer-based state management library for React.  
It lets you write declarative, composable, and expressive state logic — with full support for nested data structures, arrays, and forms — without breaking React's rendering model.

## Installation

```bash
npm install @pure-ptr/react
```

or

```bash
yarn add @pure-ptr/react
```

## What is PurePtr?

PurePtr introduces a concept of **pointers to state**.  
Instead of juggling multiple `useState()` calls, you work with object-like references (pointers) that expose:

- `value`: the current state
- `set(value)`: to assign a new value
- `update(fn)`: to apply an update function
- `.at('key')`: to focus on nested fields
- `.map()`, `.filter()`, `.find()` for arrays

This lets you write logic like this:

```tsx
const userPtr = useStatePtr({ name: '', email: '' });

<Input valuePtr={userPtr.at('name')} />
<Input valuePtr={userPtr.at('email')} />
```

## Key Features

- ✅ Easy two-way binding (`valuePtr.props`)
- ✅ Deeply nested updates via `.at()`
- ✅ Array operations via `.map()`, `.push()`, `.remove()`
- ✅ Validation with `.check()`
- ✅ Supports custom models via `PureObject`
- ✅ Full compatibility with React's rendering model

## A Simple Example

```tsx
const Counter = () => {
  const count = useStatePtr(0);

  return (
    <div>
      <h1>{count.value}</h1>
      <button onClick={() => count.update(n => n + 1)}>Increment</button>
      <button onClick={() => count.set(0)}>Reset</button>
    </div>
  );
};
```

## Next Steps

[Basics](./intro/basics): Learn how pointers work in simple forms and arrays.
