const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT, isRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')
const {
  create,
  findAll,
  update,
  deleteById,
} = require('../controllers/course.controller.js')
const { courseByIdExists } = require('../helpers/db-validators')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('duration', 'La duración (semanas) es requerida').not().isEmpty(),
    check('maxCapacity', 'La capacidad de estudiantes máxima es requerida')
      .not()
      .isEmpty(),
    check('minRequired', 'La capacidad mínima de estudiantes  es requerida')
      .not()
      .isEmpty(),
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
    check('id', 'El id debe ser válido de Mongo').isMongoId(),
    check('id').custom(courseByIdExists),
    validateFields,
  ],
  update
)

router.delete(
  '/:id',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'El id debe ser válido de Mongo').isMongoId(),
    check('id').custom(courseByIdExists),
    validateFields,
  ],
  deleteById
)

module.exports = router
