const { Category, Role, User, Product } = require('../models')

/**
 * Validación contra la BD de usuarios
 */
const isValidRole = async (role = '') => {
  const existsRole = await Role.findOne({ role })
  if (!existsRole) {
    throw new Error(`El rol ${role} no está registrado en la base de datos`)
  }
}

const emailExists = async (email = '') => {
  const user = await User.findOne({ email })
  if (user) {
    throw new Error(`El correo '${email}' ya está registrado`)
  }
}

const userByIdExists = async (id = '') => {
  const userExists = await User.findById(id)
  if (!userExists) {
    throw new Error(`Usuario con id '${id}' no existe en la base de datos`)
  }
}

/**
 * Validación contra la BD de categorías
 */
const categoryByIdExists = async (id = '') => {
  const categoryExists = await Category.findById(id)
  if (!categoryExists) {
    throw new Error(`Categoría con id '${id}' no existe en la base de datos`)
  }
}

/**
 * Validación contra la BD de productos
 */
const productByIdExists = async (id = '') => {
  const productExists = await Product.findById(id)
  if (!productExists) {
    throw new Error(`Producto con id '${id}' no existe en la base de datos`)
  }
}

/**
 *  Validar colecciones permitidas
 */
const allowedCollections = (collection = '', collections = []) => {
  const include = collections.includes(collection)
  if (!include)
    throw new Error(
      `La colección ${collection} no es permitida. Colecciones permitidas: ${collections.join(
        ', '
      )}`
    )
  return true
}

module.exports = {
  isValidRole,
  emailExists,
  userByIdExists,
  categoryByIdExists,
  productByIdExists,
  allowedCollections,
}
