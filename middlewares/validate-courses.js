const { response, request } = require('express')
const { check, body } = require('express-validator')

const { Course } = require('../models')
const { isRole } = require('./validate-roles')
const {
  serverErrorHandler,
  isObjectId,
  isValidName,
  courseByIdExists,
  message,
} = require('../helpers')
const { validateFields } = require('./validate-fields')
const { validateJWT } = require('./validate-jwt')

const createCourseCheck = () => {
  return [
    validateJWT,
    isRole('admin'),
    check('name')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .if(body('name').exists())
      .isString()
      .withMessage('El nombre debe ser una cadena de caracteres')
      .custom(isValidName),

    check('description')
      .notEmpty()
      .withMessage('La descripción es requerida')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser numerica'),

    check('maxCapacity')
      .notEmpty()
      .withMessage('La capacidad maxima de estudiantes  es requerida')
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad debe ser numérica'),

    check('minRequired')
      .notEmpty()
      .withMessage(
        'La capacidad mínima de estudiantes  es requerida es requerida'
      )
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('La capacidad debe ser numérica'),
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
      .withMessage('El nombre debe ser una cadena de caracteres')
      .custom(isValidName),

    check('description')
      .if(body('description').exists())
      .isString()
      .withMessage('La descripción debe ser numerica'),

    check('maxCapacity')
      .if(body('maxCapacity').exists())
      .isNumeric()
      .withMessage('La capacidad debe ser numérica'),

    check('minRequired')
      .if(body('minRequired').exists())
      .isNumeric()
      .withMessage('La capacidad debe ser numérica'),
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

module.exports = {
  validateCourses,
  createCourseCheck,
  updateCourseCheck,
  deleteCourseCheck,
}
