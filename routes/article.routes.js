const { Router } = require('express')
const { check } = require('express-validator')

const { isRole, validateJWT, validateFields } = require('../middlewares')
const { articleByIdExists, articleTitleExists } = require('../helpers')

const {
  create,
  deleteById,
  findAll,
  update,
} = require('../controllers/article.controller')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('title', 'El título es requerido').not().isEmpty(),
    check('title', 'El título debe ser caracteres').isString(),
    check('title').custom(articleTitleExists),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('description', 'La descripcíon debe ser careacteres').isString(),
    validateFields,
  ],
  create
)

router.get('/', findAll)

router.patch(
  '/:id',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'El id debe ser valido de Mongo').isMongoId(),
    check('id').custom(articleByIdExists),
    validateFields,
  ],
  update
)

router.delete(
  '/:id',
  [validateJWT, isRole('ADMIN_ROLE'), validateFields],
  deleteById
)

module.exports = router
