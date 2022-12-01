const { check, body } = require('express-validator')
const { response, request } = require('express')

const { Course } = require('../models')
const { courseByIdExists, isValidName } = require('../helpers/validations')
const { isObjectId, message, serverErrorHandler } = require('../helpers')
const { isRole } = require('./validate-roles')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const validateCourses = async (req = request, res = response, next) => {
  try {
    const { courses: coursesIds } = req.body

    if (coursesIds) {
      const invalidIds = coursesIds.filter((id) => {
        if (!isObjectId(id)) {
          return id
        }
      })

      if (invalidIds.length > 0) {
        return res.status(400).json({
          msg: 'Debe ser id de mongo válidos',
          invalidIds,
        })
      }

      console.log('llega')

      const coursesDB = await Course.find({ _id: { $in: coursesIds } })
      const coursesIdsDB = coursesDB.map((courseDB) => courseDB._id.valueOf())

      const coursesIdsNotFound = coursesIds.filter((courseId) => {
        if (!coursesIdsDB.includes(courseId)) {
          return courseId
        }
      })

      if (coursesIdsNotFound.length > 0) {
        return res.status(400).json({
          msg: 'Los siguientes cursos no existen en la BD',
          coursesIdsNotFound,
        })
      }

      req.coursesDB = coursesDB
    }
    next()
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const createCourseCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('name')
      .notEmpty()
      .withMessage(message.requireMale('nombre'))
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidName),

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
    validateFields,
  ]
}

const updateCourseCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(courseByIdExists),

    check('name')
      .if(body('name').exists())
      .isString()
      .withMessage(message.stringMale('nombre'))
      .custom(isValidName),

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
    validateFields,
  ]
}

const deleteCourseCheck = () => {
  return [
    validateJWT,

    isRole('admin'),

    check('id')
      .isMongoId()
      .withMessage(message.idIsNotValid)
      .custom(courseByIdExists),

    validateFields,
  ]
}

module.exports = {
  validateCourses,
  createCourseCheck,
  updateCourseCheck,
  deleteCourseCheck,
}
