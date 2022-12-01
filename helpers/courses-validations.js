const { Course } = require('../models')

const isValidName = async (name = '') => {
  const course = await Course.findOne({ name: name.toLowerCase().trim() })
  if (course) {
    throw new Error(`Ya existe un curso con el nombre '${name}'`)
  }
}

module.exports = {
  isValidName,
}
