const { Career } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')
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

const careersByIdsExist = async (careersIds = []) => {
  const invalidIds = careersIds.filter((careerId) => {
    if (!isObjectId(careerId)) {
      return careerId
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

  const careersDB = await Career.find({ _id: { $in: careersIds } })
  const careersIdsDB = careersDB.map((careerDB) => careerDB._id.valueOf())

  const careersIdsNotFound = careersIds.filter((careerId) => {
    if (!careersIdsDB.includes(careerId)) {
      return careerId
    }
  })

  if (careersIdsNotFound.length > 0) {
    if (careersIdsNotFound.length === 1)
      throw new Error(
        `La siguiente carrera no existe en la BD: ${careersIdsNotFound}`
      )
    else
      throw new Error(
        `Las siguientes carreras no existen en la BD: ${careersIdsNotFound.join(
          ', '
        )}`
      )
  }
}

module.exports = {
  careerByIdExists,
  careersByIdsExist,
  isValidNameCareer,
}
