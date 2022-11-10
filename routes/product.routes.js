const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateJWT, isRole } = require('../middlewares')
const { productByIdExists, categoryByIdExists } = require('../helpers')
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProdut,
} = require('../controllers')

const router = Router()

router.get('/', getProducts)

router.get(
  '/:id',
  [
    check('id', 'El ID del producto no es válido').isMongoId(),
    check('id').custom(productByIdExists),
    validateFields,
  ],
  getProductById
)

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'El ID de la categoría es requerido').not().isEmpty(),
    check('category', 'El ID de la categoría no es válido').isMongoId(),
    check('category').custom(categoryByIdExists),
    validateFields,
  ],
  createProduct
)

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(productByIdExists),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es requerida').not().isEmpty(),
    check('category', 'El ID de categoría no es válido').isMongoId(),
    check('category').custom(categoryByIdExists),
    validateFields,
  ],
  updateProduct
)

router.delete(
  '/:id',
  [
    validateJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(productByIdExists),
    validateFields,
  ],
  deleteProdut
)

module.exports = router
