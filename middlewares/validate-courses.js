const { response, request } = require('express')
const { serverErrorHandler, isObjectId } = require('../helpers')
const { Course } = require('../models')

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
}
