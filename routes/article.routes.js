const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT, isRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')

const { createArticle, findAllArticles } = require('../controllers/article.controller')

const router = Router()

router.post('/', 
[
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('description', 'la descripción es requerida').not().isEmpty(),
    validateFields,
], 
createArticle)

router.get('/', findAllArticles)

// router.patch('/:id', updateArticle)

// router.delete('/:id', deleteArticle)

module.exports = router
