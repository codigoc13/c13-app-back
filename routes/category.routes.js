const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateJWT, isRole } = require('../middlewares')
const { categoryByIdExists } = require('../helpers')
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers')

const router = Router()

// Obtener todas las categorías - público
router.get('/', getCategories)

// Obtener una categoría por id - público
router.get(
  '/:id',
  [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    validateFields,
  ],
  getCategoryById
)

// Crear categoría - privado - cualquier persona con un token válido
router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields,
  ],
  createCategory
)

// Actualizar una categoría por id - privado - cualquier persona con un token válido
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields,
  ],
  updateCategory
)

// Eliminar una categorpia por id - privado - Admin
router.delete(
  '/:id',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    validateFields,
  ],
  deleteCategory
)

module.exports = router
