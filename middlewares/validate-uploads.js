const { check } = require('express-validator')

const { validateCollection, message } = require('../helpers')
const { validateFields } = require('./validate-fields')
const { validateFile } = require('./validate-file')

const updateImgcheck = () => {
  return [
    validateFile,

    check('id').isMongoId().withMessage(message.idIsNotValid),

    check('collection').custom(validateCollection),

    validateFields,
  ]
}

module.exports = {
  updateImgcheck,
}
