const { check } = require('express-validator')

const { message } = require('../helpers')
const { validateCollection } = require('../helpers/validations')
const { validateFields } = require('./validate-fields')
const { validateFile } = require('./validate-file')
const { validateJWT } = require('./validate-jwt')
const { isRole } = require('./validate-roles')

const updateImgcheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    validateFile,

    check('id').isMongoId().withMessage(message.idIsNotValid),

    check('collection').custom(validateCollection),

    validateFields,
  ]
}

module.exports = {
  updateImgcheck,
}
