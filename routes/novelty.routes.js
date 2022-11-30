const { Router } = require('express')

const {
  createNoveltyCheck,
  updateNoveltyCheck,
  deleteNoveltyCheck,
} = require('../middlewares')
const {
  create,
  deleteById,
  findAll,
  update,
} = require('../controllers/novelty.controller')

const router = Router()

router.post('/', createNoveltyCheck(), create)

router.get('/', findAll)

router.patch('/:id', updateNoveltyCheck(), update)

router.delete('/:id', deleteNoveltyCheck(), deleteById)

module.exports = router
