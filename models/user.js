const { Schema, model } = require('mongoose')
const { DateTime } = require('luxon')

const UserSchema = Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
  },
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
  },
  typeDocument: {
    type: String,
    required: [true, 'El tipo de documento es requerido'],
  },
  numberDocument: {
    type: String,
    required: [true, 'El número de documento es requerido'],
    unique: true,
  },
  img: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumbers: {
    type: [String],
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
  },
  role: {
    type: String,
    required: [true, 'El rol es requerido'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
})

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, createdAt, updatedAt, ...user } = this.toObject()

  user.id = _id

  user.createdAt = DateTime.fromJSDate(createdAt, {
    zone: 'America/Bogota',
  })

  if (updatedAt)
    user.updatedAt = DateTime.fromJSDate(updatedAt, {
      zone: 'America/Bogota',
    })

  return user
}

module.exports = model('User', UserSchema)
