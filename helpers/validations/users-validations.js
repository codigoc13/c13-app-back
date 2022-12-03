const { User } = require('../../models')
const { Role } = require('../../models')
const { isObjectId } = require('../validate-object-id')

const isValidUsername = async (username = '') => {
  const user = await User.findOne({ username })
  if (user) {
    throw new Error(`El username '${username}' ya está registrado`)
  }
  return true
}

const isValidEmail = async (email = '') => {
  const user = await User.findOne({ email })
  if (user) {
    throw new Error(`El correo '${email}' ya está registrado`)
  }
  return true
}

const isValidRole = async (role = '') => {
  const existsRole = await Role.findOne({ role })
  if (!existsRole) {
    throw new Error(`El rol ${role} no está registrado en la base de datos`)
  }
  return true
}

const userByIdExists = async (id = '') => {
  if (isObjectId(id)) {
    const userExists = await User.findById(id)
    if (!userExists) {
      throw new Error(`Usuario con id '${id}' no existe en la base de datos`)
    }
  }
}

const participantsByIdsExist = async (usersIds = []) => {
  const invalidIds = usersIds.filter((userId) => {
    if (!isObjectId(userId)) {
      return userId
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

  const usersDB = await User.find({ _id: { $in: usersIds } })
  const usersIdsDB = usersDB.map((userDB) => userDB._id.valueOf())

  const usersIdsNotFound = usersIds.filter((userId) => {
    if (!usersIdsDB.includes(userId)) {
      return userId
    }
  })

  if (usersIdsNotFound.length > 0) {
    if (usersIdsNotFound.length === 1)
      throw new Error(
        `El siguiente participante no existe en la BD: ${usersIdsNotFound}`
      )
    else
      throw new Error(
        `Los siguientes participantes no existen en la BD: ${usersIdsNotFound.join(
          ', '
        )}`
      )
  }

  const usersWrongRole = usersDB.filter((userDB) => {
    return userDB.role !== 'student'
  })

  if (usersWrongRole.length > 0) {
    throw new Error(
      `Los siguiente usuarios no tienen rol de estudiante: ${usersWrongRole}`
    )
  }
}

module.exports = {
  isValidEmail,
  isValidRole,
  isValidUsername,
  participantsByIdsExist,
  userByIdExists,
}
