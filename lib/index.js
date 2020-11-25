const express = require('express')
const { v4: uuid } = require('uuid')
const app = express()
const port = 3000

const docs = `
<h1>Julkort API</h1>
<p>These are the end points for this API.<p>
<p>An item has the following format:
<pre>{
  "id": "ca3084de-4424-4421-98af-0ae9e2cb3ee5",
  "message": "Must pack bags",
  "color": "green",
  "alignment": "center"
}</pre>
</p>

<h2>API key</h2>
<p>All requests requires an API key. An API key uniquely identifies your list. You can get an API key by using the /register endpoint.</p>

<h1>GET /register</h1>
<p>Get your API key</p>

<h1>GET /julkort?key=[YOUR API KEY]</h1>
<p>List julkort.</p>
<p>Will return an array of julkort.</p>

<h1>POST /julkort?key=[YOUR API KEY]</h1>
<p>Add item.</p>
<p>Takes an item as payload (body). Remember to set the Content-Type header to application/json.</p>
<p>Will return the entire list of julkort, including the added Todo, when successful.</p>

<h1>PUT /julkort/:id?key=[YOUR API KEY]</h1>
<p>Update item with :id</p>
<p>Takes a Item as payload (body), and updates title and done for the already existing Item with id in URL.</p>

<h1>DELETE /julkort/:id?key=[YOUR API KEY]</h1>
<p>Deletes a Item with id in URL</p>
`

const items = {}

const requireItems = (req, res, next) => {
  if (!req.items) {
    res.send('Must supply key')
  } else {
    next()
  }
}

app.use(express.json())
app.use((req, res, next) => {
  console.log(req.url)
  if (req.query && req.query.key) {
    req.items = items[req.query.key]
  }
  next()
})

app.get('/', (req, res) => res.send(docs))

app.get('/register', (req, res) => {
  const key = uuid()
  items[key] = []
  res.send(key)
})

app.get('/julkort', requireItems, (req, res) => {
  res.json(req.items)
})

app.get('/julkort/:id', requireItems, (req, res) => {
  res.json(req.items.find(({ id }) => id === req.params.id))
})

app.post('/julkort/', requireItems, (req, res) => {
  const todo = {
    message: '',
    done: false,
    ...req.body,
    id: uuid(),
  }

  const clean = ({ id, message, color, alignment }) => ({ id, message, color, alignment })

  req.items.push(clean(todo))

  res.json(req.items)
})

app.put('/julkort/:id', requireItems, (req, res) => {
  req.items.forEach(todo => {
    if (todo.id === req.params.id) {
      todo.title = req.body.title
      todo.done = req.body.done
    }
  })

  res.json(req.items)
})

app.delete('/julkort/:id', requireItems, (req, res) => {
  const index = req.items.findIndex(({ id }) => id === req.params.id)

  if (index >= 0) {
    req.items.splice(index, 1)
  }

  res.json(req.items)
})

app.listen(port, () => {
  console.log(`listening to port ${port}`)
})
