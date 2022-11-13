const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, isRole } = require('../middlewares')
const { createArticle } = require('../controllers/article.controller')


const router = Router() 

router.post('/', 
[   
    isRole('ADMIN_ROLE'),
    check('title', 'El titulo es requerido para poder crear el articulo').not().isEmpty,
    check('description', 'La descripción es necesaria').not().isEmpty(),
    validateFields,
],
createArticle)

// router.get('/', findAllArticle)

// router.put('/:id', [], updateArticle)

// router.delete('/:id', [], deleteArticle)

module.exports = router