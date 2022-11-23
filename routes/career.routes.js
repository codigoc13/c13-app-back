const { Router } = require('express')
const { check } = require('express-validator')
const {
  getCareers,
  createCareer,
  deleteCareer,
  updateCareer,
} = require('../controllers/career.controller')
const { userByIdExists, careerByIdExists } = require('../helpers/db-validators')

const { validateFields, validateJWT, isRole } = require('../middlewares')

const router = Router()

router.get('/', getCareers)

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es requerido ').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('duration', 'La duracion es requerida').not().isEmpty(),
    check('duration', 'La duracion debe de ser un numero').isNumeric(),
    check('maxCapacity', 'La cantidad maxima es requerida').not().isEmpty(),
    check(
      'maxCapacity',
      'La cantidad maxima debe de ser un numero'
    ).isNumeric(),
    check('minRequired', 'La cantidad minima requerida no puede ir vacia')
      .not()
      .isEmpty(),
    check('minRequired', 'La cantidad minima requerida debe de ser un numero'),
    check('courses', `El ID no es válido`).isMongoId(),
    check('user', `El ID no es válido`).isMongoId(),
    check('user').custom(userByIdExists),
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
