const { Career } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidNameCareer = async (name = '') => {
  if (typeof name === 'string') {
    name = name.toLowerCase()
    const career = await Career.findOne({ name })
    if (career) throw new Error(`Ya existe una carrera con nombre '${name}'`)
  }
}

const careerByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const career = await Career.findById(id)
    if (!career) {
      throw new Error(`Carrera con id '${id}' no existe en la base de datos`)
    }
  }
}

module.exports = {
  isValidNameCareer,
  careerByIdExists,
}
