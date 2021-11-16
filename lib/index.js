const express = require('express')
const cors = require('cors')
const { v4: uuid } = require('uuid')
const app = express()
app.use(cors())
const port = 3000

const docs = `
<h1>Todo API</h1>
<p>These are the end points for this API.<p>
<p>A todo has the following format:
<pre>{
  "id": "ca3084de-4424-4421-98af-0ae9e2cb3ee5",
  "title": "Must pack bags",
  "done": false
}</pre>
When creating a Todo you should not submit the id.</p>
<h2>API key</h2>
<p>All requests requires an API key. An API key uniquely identifies your Todo list. You can get an API key by using the /register endpoint.</p>

<h1>GET /register</h1>
<p>Get your API key</p>

<h1>GET /todos?key=[YOUR API KEY]</h1>
<p>List todos.</p>
<p>Will return an array of todos.</p>

<h1>POST /todos?key=[YOUR API KEY]</h1>
<p>Add todo.</p>
<p>Takes a Todo as payload (body). Remember to set the Content-Type header to application/json.</p>
<p>Will return the entire list of todos, including the added Todo, when successful.</p>

<h1>PUT /todos/:id?key=[YOUR API KEY]</h1>
<p>Update todo with :id</p>
<p>Takes a Todo as payload (body), and updates title and done for the already existing Todo with id in URL.</p>

<h1>DELETE /todos/:id?key=[YOUR API KEY]</h1>
<p>Deletes a Todo with id in URL</p>
`

const todos = {}

const requireTodos = (req, res, next) => {
  if (!req.todos) {
    res.send('Must supply key')
  } else {
    next()
  }
}

app.use(express.json())
app.use((req, res, next) => {
  if (req.query && req.query.key) {
    req.todos = todos[req.query.key]
  }
  next()
})

app.get('/', (req, res) => res.send(docs))

app.get('/register', (req, res) => {
  const key = uuid()
  todos[key] = []
  res.send(key)
})

app.get('/todos', requireTodos, (req, res) => {
  res.json(req.todos)
})

app.get('/todos/:id', requireTodos, (req, res) => {
  res.json(req.todos.find(({ id }) => id === req.params.id))
})

app.post('/todos/', requireTodos, (req, res) => {
  const todo = {
    title: '',
    done: false,
    ...req.body,
    id: uuid(),
  }

  const clean = ({ id, title, done }) => ({ id, title, done })

  req.todos.push(clean(todo))

  res.json(req.todos)
})

app.put('/todos/:id', requireTodos, (req, res) => {
  req.todos.forEach(todo => {
    if (todo.id === req.params.id) {
      todo.title = req.body.title
      todo.done = req.body.done
    }
  })

  res.json(req.todos)
})

app.delete('/todos/:id', requireTodos, (req, res) => {
  const index = req.todos.findIndex(({ id }) => id === req.params.id)

  if (index >= 0) {
    req.todos.splice(index, 1)
  }

  res.json(req.todos)
})

app.listen(port, () => {
  console.log(`listening to port ${port}`)
})
