const { User } = require('../models')
const { Role } = require('../models')

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
  const userExists = await User.findById(id)
  if (!userExists) {
    throw new Error(`Usuario con id '${id}' no existe en la base de datos`)
  }
}

module.exports = { userByIdExists, isValidEmail, isValidRole, isValidUsername }
