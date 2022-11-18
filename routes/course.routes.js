const { Router } = require('express')
const { check } = require('express-validator')

const { validateJWT, isRole } = require('../middlewares')
const { validateFields } = require('../middlewares/validate-fields')
const { create, findAll } = require('../controllers/course.controller.js')

const router = Router()

router.post(
  '/',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('duration ', 'La duración es requerida').not().isEmpty(),
    check('maxCapacity ', 'La capacidad máxima es requerida').not().isEmpty(),
    check('minRequired ', 'La capacidad mínima es requerida').not().isEmpty(),
    validateFields,
  ],
  create
)

router.get('/', findAll)

module.exports = router
