const { Router } = require('express')

const {
  createUserCheck,
  updateUserCheck,
  deleteUserCheck,
} = require('../middlewares')

const { create, deleteUser, findAll, update } = require('../controllers')

const router = Router()

router.post('/', createUserCheck(), create)

router.get('/', findAll)

router.patch('/:id', updateUserCheck(), update)

router.delete('/:id', deleteUserCheck(), deleteUser)

module.exports = router
