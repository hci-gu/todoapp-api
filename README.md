# Todo APP API

## Routes

> GET /register

Returns new API key, to be used as a query parameter for each other API call.

> GET /todos/?key=[YOUR API KEY]

Returns a json array of todos

> POST /todos?key=[YOUR API KEY]

Adds new todo to your todos. Todos should look like:

```json
{
  "title": "A title for the todo",
  "done": false // whether the todos is completed or not.
}
```

> PUT 