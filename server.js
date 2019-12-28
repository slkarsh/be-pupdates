const express = require('express')
const app = express()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const cors = require('cors')


app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.locals.title = "PupDates Backend"
app.use(cors());

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')} `)
})

app.get('/', (request, response) => {
  response.send("Welcome to the NodeJS PupDates Backend")
})

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then((users) => {
      response.status(200).json(users)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/dogs', (request, response) => {
  database('dogs').select()
    .then(dogs => {
      response.status(200).json(dogs)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/users/:id/dogs', (request, response) => {
  database('dogs').where('user_id', request.params.id)
    .then((dogs) => {
      if (dogs.length) {
        response.status(200).json(dogs)
      } else {
        response.status(404).json({ error: `Could not finding matching user and dogs`})
      }
    })
    .catch((error) => response.status(500).json({ error }))
})


app.get('/api/v1/users/:id', (request, response) => {
  const { id } = request.params
  database('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        response.status(200).json(user)
      } else {
        response.status(404).json({ error: `Could not find matching user`})
      }
    })
    .catch(error => response.status(500).json({ error }))
})



