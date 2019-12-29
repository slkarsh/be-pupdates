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


app.get('/api/v1/dog_images', (request, response) => {
  database('dog_images').select()
  .then((images) => {
    response.status(200).json(images)
  })
  .catch((error) => {
    response.status(500).json({ error })
  })
})

app.get('/api/v1/dog_images/:id', (request, response) => {
  database('dog_images')
    .where('dog_id', request.params.id)
    .then((images) => {
      if (images.length) {
        response.status(200).json(images)
      } else {
        response.status(404).json({ error: `Could not find photos`})
      }
    })
    .catch(error => response.status(500).json({ error }))
})


app.post('/api/v1/login', (request, response) => {
  const { email, password } = request.body
  database('users')
    .where('email', email)
    .select()
    .then(user => {
      if (user.length && password === user[0].password) {
        const { first_name, id } = user[0]
        return response.status(200).send({ first_name, id})
      } else if (user.length && password !== user.password) {
        console.log('user pw', user[0].password)
        return response.status(404).send({ error: 'Password incorrect, please try again'})
      } else {
        return response.status(404).send({ error: 'User not found'})
      }
    })
    .catch(error => response.status(500).json({ error }))
})

