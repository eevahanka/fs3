const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

var morgan = require('morgan')

morgan.token('post', function(req, res){
  return JSON.stringify(req["body"])
})

app.use(morgan(function (tokens, req, res) {
  if (req["method"] == "POST"){
    return  [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.post(req, res)
    ].join(' ')

  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

let persons = [
{ 
  "id": 1,
  "name": "Arto Hellas", 
  "number": "040-123456"
},
{ 
  "id": 2,
  "name": "Ada Lovelace", 
  "number": "39-44-5323523"
},
{ 
  "id": 3,
  "name": "Dan Abramov", 
  "number": "12-43-234345"
},
{ 
  "id": 4,
  "name": "Mary Poppendieck", 
  "number": "39-23-6423122"
}
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {

  const id = getRandomInt(999999)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((!body.name) || (!body.number)){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  for ( peep of persons) {
    if (body.name == peep.name) {
      return response.status(400).json({ 
        error: 'name allready in phonebook' 
    })
  }
}

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const get_date_str = () =>{
  const date = new Date()
  return(date)
}

const getInfoHtml = (nro_of_persons, date) => {
  return(`
<!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div>
          <p>phonebook has info for ${nro_of_persons} people</p>
          <p> ${date}</p>

        </div>
      </body>
    </html>
`)
} 

app.get('/info', (request, response)=> {
  const nro_of_persons = persons.length
  const date = get_date_str()
  response.send(
    getInfoHtml(nro_of_persons, date)
  )
})

var morgan = require('morgan')


app.use(morgan('tiny'))

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})