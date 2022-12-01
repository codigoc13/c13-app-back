const { Router } = require('express')

const {
  createUserCheck,
  deleteUserCheck,
  getUsersCheck,
  searchUserByIdCheck,
  searchUsersCheck,
  updateUserCheck,
} = require('../middlewares')

const {
  create,
  deleteUser,
  findAll,
  findById,
  search,
  update,
} = require('../controllers/user.controller')

const router = Router()

router.post('/', createUserCheck(), create)

router.get('/', getUsersCheck(), findAll)

router.patch('/:id', updateUserCheck(), update)

router.delete('/:id', deleteUserCheck(), deleteUser)

router.get('/:id', searchUserByIdCheck(), findById)

router.get('/search/:term', searchUsersCheck(), search)

module.exports = router
