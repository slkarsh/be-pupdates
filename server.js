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
        const { first_name, last_name, email, photo, description, id } = user[0]
        return response.status(200).json({ first_name, last_name, email, photo, description, id})
      } else if (user.length && password !== user.password) {
        return response.status(404).json({ error: 'Password incorrect, please try again'})
      } else {
        return response.status(422).json({ error: 'User not found'})
      }
    })
    .catch(error => response.status(500).json({ error }))
})

app.post('/api/v1/users/:id/dogs', async (request, response) => {
  const newDog = request.body

  for (const requiredParam of ['user_id', 'name', 'sex', 'breed', 'size', 'age', 'fixed', 'vaccinated', 'good_with_kids']) {
    if (!newDog[requiredParam]) {
      return response.status(422).json({
        error: `Expected { user_id: <int>, name: <string>, sex: <string>, breed: <string>, size: <string>, age: <int>, fixed: <boolean>, vaccinated: <boolean>, good_with_kids: <boolean> },
        Missing ${requiredParam}`
      })
    }
  }

  try {
    const dogs = await database('dogs').insert(newDog, 'id')
    if (dogs.length) {
      return response.status(201).json({ id: dogs[0]})
    } else {
      return response.status(404).send({ error: 'Could not add dog'})
    }
  } catch(error) {
    return response.status(500).json({ error })
  }
})

app.post('/api/v1/reports', async (request, response) => {
  const newReport = request.body

  for (const requiredParam of ['user_id', 'description']) {
    if (!newReport[requiredParam]) {
      return response.status(422).json({ error: `Expected { user_id: <int>, description: <string>, missing ${requiredParam} }`})
    }

    try {
      const reports = await database('reports').insert(newReport, 'id')
      if (reports.length) {
        return response.status(201).json({ id: reports[0] })
      } else {
        return response.status(404).json({ error: 'Could not add report' })
      }
    } catch(error) {
      return response.status(500).json({ error })
    }
  }
})

app.patch('/api/v1/users/:id', (request, response) => {
  const { id } = request.params;
  const { photo } = request.body;
  database('users')
    .where({ id: id })
    .update({ photo: photo })
    .then(user => {
      if (!user) {
        response.status(404).json({ error: `No user found with id ${id}`})
      } else {
        response.status(202).json({ message: 'User photo updated!'})
      }
    });
});