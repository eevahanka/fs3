const mongoose = require('mongoose')



if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://eevahanka:${password}@cluster0.fol4mxc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'pekka testeri',
  number: '0100100',
})

// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close()
// })
if (process.argv.length<4){
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(person)
        })
        mongoose.connection.close()
    })}

if (process.argv.length>4) {
    const nimi = process.argv[3]
    const number = process.argv[4]
    const newperson = new Person({
        name: nimi,
        number: number,
    })
    newperson.save().then(result =>{
        console.log(`added ${nimi} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}