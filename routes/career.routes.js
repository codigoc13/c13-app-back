const { Router } = require('express')
const { check } = require('express-validator')
const {
  getCareers,
  createCareer,
  deleteCareer,
  updateCareer,
} = require('../controllers/career.controller')
const { careerByIdExists } = require('../helpers/db-validators')

const { validateFields, validateJWT, isRole } = require('../middlewares')
const { validateCourses } = require('../middlewares/validate-courses')

const router = Router()

router.get('/', getCareers)

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es requerido ').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('duration', 'La duración es requerida').not().isEmpty(),
    check('duration', 'La duración debe de ser un número').isNumeric(),
    check('maxCapacity', 'La cantidad máxima es requerida').not().isEmpty(),
    check(
      'maxCapacity',
      'La cantidad máxima debe de ser un número'
    ).isNumeric(),
    check('minRequired', 'La cantidad mínima es requerida').not().isEmpty(),
    check('minRequired', 'La cantidad mínima debe ser un número').isNumeric(),
    validateCourses,
    validateFields,
  ],
  createCareer
)

router.patch(
  '/:id',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'El id debe ser valido de Mongo').isMongoId(),
    check('id').custom(careerByIdExists),
    validateCourses,
    validateFields,
  ],
  updateCareer
)

router.delete(
  '/:id',
  [validateJWT, isRole('ADMIN_ROLE'), validateFields],
  deleteCareer
)

module.exports = router
