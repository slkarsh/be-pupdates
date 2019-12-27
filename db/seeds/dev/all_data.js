const mockUsers = require('../../../sampleData/mockUsers')
const mockDogs = require('../../../sampleData/mockDogs')
const mockDogImages = require('../../../sampleData/mockDogImages')
const mockMessages = require('../../../sampleData/mockMessages')
const mockReports = require('../../../sampleData/mockReports')
const mockSwipes = require('../../../sampleData/mockSwipes')




exports.seed = async knex => {
  await knex('users').del()
  await knex('users').insert(mockUsers)
  await knex('messages').del()
  await knex('messages').insert(mockMessages)
  await knex('reports').del()
  await knex('reports').insert(mockReports)
  await knex('swipes').del()
  await knex('swipes').insert(mockSwipes)
  await knex('dogs').del()
  await knex('dogs').insert(mockDogs)
  await knex('dog_images').del()
  await knex('dog_images').insert(mockDogImages)
}

