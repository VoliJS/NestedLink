# Validation

This guide explains how to validate form fields using pointer-based checks. The `check()` method attaches a validation rule to a pointer and automatically tracks validation errors. Validation errors can then be read via the `.error` property, and shown in custom input components.

## Basic validation rule

Use the `check()` method to attach a condition to a pointer. If the condition fails, an error will be recorded on the pointer.

```javascript
const agePtr = personPtr
                .at('age')
                .check(x => x > 0 && x < 130);

console.log(agePtr.error); // 'Invalid value'
```

## Providing custom error message

You can pass a custom error message as the second argument to `check()`. The error can be any object.

```javascript
const agePtr = personPtr
                .at('age')
                .check(
                    x => x > 0 && x <= 130,
                    'The age must be between 1 and 130'
                );

console.log(agePtr.error); // 'The age must be between 1 and 130'
```

## Displaying errors in inputs

Errors are stored in the `.error` field of the pointer and can be accessed from custom components:

```javascript
const Input = ({ valuePtr }) => (
    <div>
        <input {...valuePtr.props} />
        {valuePtr.error && <div className="error">{valuePtr.error}</div>}
    </div>
);
```

This makes it easy to create reusable, self-validating input components.

## Chaining multiple checks

You can chain multiple `check()` calls on the same pointer. The first failing check will assign its error:

```javascript
const agePtr = personPtr
                .at('age')
                .check(x => x >= 0, 'Negative age is not allowed')
                .check(x => x <= 130, 'Age should be not greater than 130');
```

## Using reusable validators

You can define reusable validation functions and assign default error messages to them:

```javascript
export const isRequired = x => x != null && x !== '';
isRequired.error = 'Required';

const namePtr = personPtr
                .at('name')
                .check(isRequired);

console.log(namePtr.error); // 'Required' if empty or null
```

