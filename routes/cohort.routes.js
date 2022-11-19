const { Router } = require('express')
const { check } = require('express-validator')
const { createCohort, getCohorts, updateCohort } = require('../controllers/cohort.controller')
const { cohortByIdExists } = require('../helpers/db-validators')
const { validateParticipants } = require('../middlewares/validate-participants')
const { validateFields, validateJWT, isRole } = require('../middlewares')
const { validateCareers } = require('../middlewares/validate-careers')

const router = Router()

router.get('/', getCohorts)

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('code', 'El código es obligatorio').not().isEmpty(),
    check('duration', 'La duración es obligatoria').not().isEmpty(),
    check('quantity', 'La cantidad es obligatoria').not().isEmpty(),
    validateCareers,
    validateParticipants,
    validateFields,
  ],
  createCohort
)

router.patch('/:id', [
  validateJWT,
  isRole('ADMIN_ROLE'),
  check('id', 'El ID no es válido').isMongoId(),
  check('id').custom(cohortByIdExists),
  validateCareers,
  validateParticipants,
  validateFields,
], updateCohort)

module.exports = router
