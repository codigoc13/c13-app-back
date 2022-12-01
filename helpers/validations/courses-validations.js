const { Course } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidName = async (name = '') => {
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

module.exports = {
  isValidName,
  courseByIdExists,
}
