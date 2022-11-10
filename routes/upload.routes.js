const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateFile } = require('../middlewares')
const { allowedCollections } = require('../helpers')
const {
  upload,
  updateImg,
  getImg,
  updateImgCloudinary,
} = require('../controllers')

const router = Router()

router.post('/', validateFile, upload)

router.put(
  '/:collection/:id',
  [
    validateFile,
    check('id', `El ID no es válido`).isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
  ],
  // updateImg
  updateImgCloudinary
)

router.get(
  '/:collection/:id',
  [
    check('id', `El ID no es válido`).isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
  ],
  getImg
)

module.exports = router
