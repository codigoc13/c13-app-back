const { Router } = require('express')

const {
  create,
  deleteById,
  findAll,
  update,
} = require('../controllers/article.controller')
const {
  createArticleCheck,
  deleteArticleCheck,
  updateArticleCheck,
} = require('../middlewares')

const router = Router()

router.post('/', createArticleCheck(), create)

router.get('/', findAll)

router.patch('/:id', updateArticleCheck(), update)

router.delete('/:id', deleteArticleCheck(), deleteById)

module.exports = router
