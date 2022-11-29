const { check, body } = require('express-validator')

const { isValidTitle, message, noveltytByIdExists } = require('../helpers')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('title')
      .notEmpty()
      .withMessage('El título es requerido')
      .if(body('title').exists())
      .isString()
      .withMessage('El título debe ser una cadena de caracteres')
      .custom(isValidTitle),

    check('description')
      .notEmpty()
      .withMessage('La descripción es requerida')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser una cadena de caracteres'),

    validateFields,
  ]
}

const updateNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(noveltytByIdExists),

    check('title')
      .if(body('title').exists())
      .isString()
      .withMessage('El título debe ser una cadena de caracteres')
      .custom(isValidTitle),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser una cadena de caracteres'),

    validateFields,
  ]
}

const deleteNoveltyCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(noveltytByIdExists),

    validateFields,
  ]
}

module.exports = {
  createNoveltyCheck,
  updateNoveltyCheck,
  deleteNoveltyCheck,
}
