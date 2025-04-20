# Fetching Data

This guide demonstrates how to fetch data using the `useData` hook. You'll see examples for fetching on mount, polling periodically, reacting to filter changes, and safely canceling pending I/O operations. These patterns cover the most common data-fetching scenarios in modern React applications.

## Fetch data on mount

This example shows how to fetch data when the component first mounts. The `useData` hook runs the fetch function once, handles loading and error states, and provides the parsed response.

```javascript
const { data, isPending, error } = useData(async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}, [])

return isPending ?
        <CircularProgress />
    : error ?
        <h1>{ error.message }</h1>
    :
        <Stack direction="column">
            { data.map( user =>
                <User key={ user.id } value={ user } />
            )}
        </Stack>
```

## Poll data periodically

Here, data is fetched on mount and then re-fetched every 10 seconds using the `useInterval` hook. This pattern is useful for real-time dashboards or periodically updating views.

```javascript
const { data, isPending, refresh } = useData(async () => {
    const response = await fetch('/api/users');
    return await response.json();
}, [])

useInterval( refresh, 10000 );
```

## Fetch data on filter change

This pattern demonstrates fetching data in response to a dependency—in this case, a `filter` value. The data will re-fetch every time the `filter` changes.

```javascript
const { data, isPending } = useData(async () => {
    const response = await fetch('/api/users?filter=' + filter);
    return await response.json();
}, [ filter ])
```

## Abort pending I/O operations

This example extends dynamic fetching by supporting request cancellation. The `abortSignal` argument allows in-flight requests to be aborted if the dependency (`filter`) changes mid-request. Returned `abort` function can be used to abort the request from the outside.

```javascript
const { data, isPending, abort } = useData(async abortSignal => {
    const response = await fetch('/api/users?filter=' + filter, {
        abortSignal
    });
    return await response.json();
}, [ filter ])
```
