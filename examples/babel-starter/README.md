# Babel NestedLink project starter

Dummy project with NestedLink, Babel, and webpack.
Use this code as a starter for your great project.
NestedLink adds about 3kb when minified, nothing to worry about.

## Coding conventions

When you're writing components taking links as props (which you should do, you won't believe how
it will transform the way you're working with React for the better),
you're _strongly adviced_ to use the leading $ in the corresponding props names. Think of `$value` as a reference to the `value` which can be updated from within the component. That's what it is.

Also, it helps to undesrtand what's going on and prevent mistakes:

```javascript
/* Wrong! */
<CustomInput $y={x} />

/* Here we go! */
<CustomInput $y={$x} />

/* Wrong! */
<CustomInput y={$x} />

/* That's okay! */
<CustomInput y={$x.value} />
```

When using links withing JS, it's also helpful to start link variable names
with `$` symbol.

```javascript
// With React hooks
const $counter = useLink('');

// With a stateful Component
const $counter = this.$at('counter');
```

If you're using stateful Component, you may link the whole state in the render method with `this.state$()`. It returns the object of the same shape as state with links to the state members.

```javascript
render(){
  const state$ = this.state$();

  return <input {...state$.counter.props} />
}
```

The methods working with an object of links can handle both $names and plain names, the leading $ is being stripped. You shoudn't worry about that.

```javascript
// It's fine.
const values = Link.getValues( state$ );

// And this is fine too.
const { counter, something } = Link.getValues({ $counter, $something });
```

## linked-controls vs standard inputs

NestedLink doesn't require any special controls for a data binding to work. You may use `{...$value.props}` expression to bind to an any control accepting the standard props like `value`, `checked`, and `onChange`.

You'll need custom controls if you want to use the validation.
The `linked-controls` package is an example of how can it be done, and it may be used instead of standard controls. They are designed to be fully compatible but also accept links.

```javascript
import { Input } from 'linked-controls'
...
/* As easy as that. And it will add 'error' class if there's an error within a link */
<Input $value={$name} />
```

## React Hooks vs Component

That's simple. Use functional components with React Hooks when you can. Fall back to the 
`React.Component` when you have any difficulties. NestedLinks give you some helpers to reduce these difficulties to a 1% of cases.

```javascript
const Page = () => {
  const $users = useLink([]);

  // Fetch data on mount.
  const isReady = useIO( async () => {
    const data = await fetchDataSomehow();
    $users.set( data );
  });

  return (
    isReady ? (
      <UsersView $users={ $users } />
    ) : (
      <div>Loading...</div>
    )
  )
}
```

Good luck!