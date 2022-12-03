const { Schema, model } = require('mongoose')
const { DateTime } = require('luxon')

const CourseSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
  },
  maxCapacity: {
    type: Number,
    required: [true, 'La capacidad máxima es requerida'],
  },
  minRequired: {
    type: Number,
    required: [true, 'El mínimo es requerido '],
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
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

CourseSchema.methods.toJSON = function () {
  const { __v, _id, status, createdAt, updatedAt, ...course } = this.toObject()
  course.id = _id

  course.createdAt = DateTime.fromJSDate(createdAt, {
    zone: 'America/Bogota',
  })

  if (updatedAt)
    course.updatedAt = DateTime.fromJSDate(updatedAt, {
      zone: 'America/Bogota',
    })

  const {
    __v: u__v,
    _id: u_id,
    password,
    status: uStatus,
    google,
    ...user
  } = course.user
  user.id = u_id

  course.user = user

  return course
}

module.exports = model('Course', CourseSchema)
