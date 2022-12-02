const { check, body } = require('express-validator')
const { response, request } = require('express')

const { Career } = require('../models')
const { isObjectId, serverErrorHandler, message } = require('../helpers')
const {
  careerByIdExists,
  coursesByIdsExist,
  isValidNameCareer,
} = require('../helpers/validations')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const validateCareers = async (req = request, res = response, next) => {
  try {
    const { careers: careersIds } = req.body

    if (careersIds) {
      const invalidIds = careersIds.filter((careerId) => {
        if (!isObjectId(careerId)) {
          return careerId
        }
      })

      if (invalidIds.length > 0) {
        return res.status(400).json({
          msg: 'Debe ser id de mongo válidos',
          invalidIds,
        })
      }

      const careersDB = await Career.find({ _id: { $in: careersIds } })
      const careersIdsDB = careersDB.map((careerDB) => careerDB._id.valueOf())
      const careersIdsNotFound = careersIds.filter((careerId) => {
        if (!careersIdsDB.includes(careerId)) {
          return careerId
        }
      })

      if (careersIdsNotFound.length > 0) {
        return res.status(400).json({
          msg: 'Las siguiente carreras no existen en la BD',
          careersIdsNotFound,
        })
      }
      req.careersDB = careersDB
    }
    next()
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const createCareerCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('name')
      .notEmpty()
      .withMessage(message.requireMale('nombre'))
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidNameCareer),

    check('description')
      .notEmpty()
      .withMessage(message.requireFemale('descripción'))
      .if(body('description').exists())
      .isString()
      .withMessage(message.stringFemale('descripción')),

    check('duration')
      .notEmpty()
      .withMessage(message.requireFemale('duración'))
      .if(body('description').exists())
      .isNumeric()
      .withMessage('La duración debe ser numérica'),

    check('maxCapacity')
      .notEmpty()
      .withMessage(message.requireFemale('capacidad máxima'))
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad máxima debe ser numérica'),

    check('minRequired')
      .notEmpty()
      .withMessage(message.requireMale('valor mínimo'))
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('El valor mínimo debe ser numérico'),

    check('courses').if(body('courses').exists()).custom(coursesByIdsExist),

    validateFields,
  ]
}

const updateCareerCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(careerByIdExists),

    check('name')
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidNameCareer),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser numerica'),

    check('duration')
      .if(body('duration').exists())
      .isNumeric()
      .withMessage('La duración debe ser numérica'),

    check('maxCapacity')
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad máxima debe ser numérica'),

    check('minRequired')
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('La valor mínimo debe ser numérico'),

    check('courses').if(body('courses').exists()).custom(coursesByIdsExist),

    validateFields,
  ]
}

const deleteCareerCheck = () => {
  return [
    validateJWT,

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(careerByIdExists),

    isRole('admin'),
    validateFields,
  ]
}

module.exports = {
  validateCareers,
  createCareerCheck,
  updateCareerCheck,
  deleteCareerCheck,
}
