const { check } = require('express-validator')

const { validateCollection } = require('../helpers')
const { validateFields } = require('./validate-fields')
const { validateFile } = require('./validate-file')

const updateImgcheck = () => {
  return [
    validateFile,
    check('id').isMongoId().withMessage('El ID no es válido'),
    check('collection').custom(validateCollection),
    validateFields,
  ]
}

module.exports = {
  updateImgcheck,
}
