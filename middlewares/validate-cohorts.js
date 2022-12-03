const { check, body } = require('express-validator')
const { message } = require('../helpers')

const {
  careersByIdsExist,
  cohortByIdExists,
  isValidCode,
  participantsByIdsExist,
} = require('../helpers/validations')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')
const { isRole } = require('./validate-roles')

const createCohortCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('code')
      .notEmpty()
      .withMessage(message.lengthMale('código'))
      .if(body('code').exists())
      .isString()
      .withMessage(message.stringMale('código'))
      .custom(isValidCode),

    check('duration')
      .notEmpty()
      .withMessage(message.lengthFemale('duración'))
      .if(body('duration').exists())
      .isNumeric()
      .withMessage('La duración debe ser una cadena de numeros'),

    check('quantity')
      .notEmpty()
      .withMessage(message.requireFemale('cantidad'))
      .if(body('quantity').exists())
      .isNumeric()
      .withMessage('La cantidad debe ser una cadena de numeros'),

    check('careers').if(body('careers').exists()).custom(careersByIdsExist),

    check('participants')
      .if(body('participants').exists())
      .custom(participantsByIdsExist),

    validateFields,
  ]
}

const updateCohortCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(cohortByIdExists),

    check('code')
      .if(body('code').exists())
      .isString()
      .withMessage(message.stringMale('código'))
      .custom(isValidCode),

    check('duration')
      .if(body('duration').exists())
      .isNumeric()
      .withMessage('La duración debe ser una cadena de numeros'),

    check('quantity')
      .if(body('quantity').exists())
      .isNumeric()
      .withMessage('La cantidad debe ser una cadena de numeros'),

    check('careers').if(body('careers').exists()).custom(careersByIdsExist),

    check('participants')
      .if(body('participants').exists())
      .custom(participantsByIdsExist),

    validateFields,
  ]
}

const deleteCohortCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(cohortByIdExists),

    validateFields,
  ]
}

module.exports = {
  createCohortCheck,
  deleteCohortCheck,
  updateCohortCheck,
}
