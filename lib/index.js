const express = require('express')
const { v4: uuid } = require('uuid')
const app = express()
const port = 3000

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
