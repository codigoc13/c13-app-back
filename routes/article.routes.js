const { Router } = require('express')
const { check } = require('express-validator')

const { isRole, validateJWT } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')
const { articleByIdExists } = require('../helpers/db-validators')

const {
  create,
  findAll,
  update,
  deleteById,
} = require('../controllers/article.controller')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
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
