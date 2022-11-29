const { Router } = require('express')

const {
  createUserCheck,
  deleteUserCheck,
  getUsersCheck,
  updateUserCheck,
} = require('../middlewares')

const {
  create,
  deleteUser,
  findAll,
  update,
} = require('../controllers/user.controller')

const router = Router()

router.post('/', createUserCheck(), create)

router.get('/', getUsersCheck(), findAll)

router.patch('/:id', updateUserCheck(), update)

router.delete('/:id', deleteUserCheck(), deleteUser)

module.exports = router
