const {Router} = require('express')
const {check} = require('express-validator')
const {createCohort, getCohorts} = require('../controllers/cohort.controller')
const {validateFields, validateJWT, isRole} = require('../middlewares')

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
    validateFields,
  ],
  createCohort
)

module.exports = router
