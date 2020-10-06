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

> PUT /todos/:id?key=[YOUR API KEY]

Updates a todo with id `:id` using body payload like:

```json
{
  "title": "A title for the todo",
  "done": false // whether the todos is completed or not.
}
```

> DELETE /todos/:id?key=[YOUR API KEY]

Deletes a todo with id `:id`.
