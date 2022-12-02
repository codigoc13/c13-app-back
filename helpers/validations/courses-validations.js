const { Course } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidNameCourse = async (name = '') => {
  if (typeof name === 'string') {
    const course = await Course.findOne({ name: name.toLowerCase() })
    if (course) throw new Error(`Ya existe un artículo con título '${name}'`)
  }
}

const courseByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const courseExists = await Course.findById(id)
    if (!courseExists) {
      throw new Error(`Curso con id '${id}' no existe en la base de datos`)
    }
  }
}

const coursesByIdsExist = async (coursesIds = []) => {
  const invalidIds = coursesIds.filter((id) => {
    if (!isObjectId(id)) {
      return id
    }
  })

  if (invalidIds.length > 0) {
    if (invalidIds.length === 1)
      throw new Error(`Se envío un id no válido de Mongo: ${invalidIds}`)
    else
      throw new Error(
        `Se enviaron ids no válidos de Mongo: ${invalidIds.join(', ')}`
      )
  }

  const coursesDB = await Course.find({ _id: { $in: coursesIds } })
  const coursesIdsDB = coursesDB.map((courseDB) => courseDB._id.valueOf())

  const coursesIdsNotFound = coursesIds.filter((courseId) => {
    if (!coursesIdsDB.includes(courseId)) {
      return courseId
    }
  })

  if (coursesIdsNotFound.length > 0) {
    if (coursesIdsNotFound.length === 1)
      throw new Error(
        `El siguiente curso no existe en la BD: ${coursesIdsNotFound}`
      )
    else
      throw new Error(
        `Los siguientes cursos no existen en la BD: ${coursesIdsNotFound.join(
          ', '
        )}`
      )
  }
}

module.exports = {
  isValidNameCourse,
  courseByIdExists,
  coursesByIdsExist,
}
