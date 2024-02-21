const http = require('http')
require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

const Person = require('./models/person')

app.use(express.static('dist'))

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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
  // const id = Number(request.params.id)
  // // console.log(id)
  // const person = persons.find(person => person.id === id)
  // // console.log(person)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  .catch(error => next(error))
})

const generateId = () => {

  const id = getRandomInt(999999)
  return id
}

app.post('/api/persons', (request, response, next) => {
  // console.log(request.body) 
  const body = request.body
  if ((!body.name) || (!body.number)){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
//   for ( peep of persons) {
//     if (body.name == peep.name) {
//       return response.status(400).json({ 
//         error: 'name allready in phonebook' 
//     })
//   }
// }

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson =>{
    response.json(person)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    response.json(persons)
  })  
  
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
  Person.find({}).then(persons=>{
    var count = Object.keys(persons).length;
    const nro_of_persons = count
    const date = get_date_str()
    response.send(
      getInfoHtml(nro_of_persons, date)
    )
  }) 
 
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})