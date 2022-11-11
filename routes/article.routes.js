const { Router } = require('express')
const { check } = require('express-validator')

const router = Router()

router.get('/', getArticles)

router.post('/', createArticle)

router.patch('/:id', updateArticle)

router.delete('/:id', deleteArticle)

module.exports = router
