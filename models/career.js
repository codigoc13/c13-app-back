const { DateTime } = require('luxon')
const { Schema, model } = require('mongoose')

const CareerSchema = Schema({
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
    // medida de tiempo: semanas
  },
  maxCapacity: {
    type: Number,
    required: [true, 'La capacidad máxima es requerida'],
  },
  minRequired: {
    type: Number,
    required: [true, 'El mínimo es requerido '],
  },
  imgUrl: {
    type: String,
  },
  courses: {
    type: [Schema.Types.ObjectId],
    ref: 'Course',
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
  updateAt: {
    type: Date,
  },
})

CareerSchema.methods.toJSON = function () {
  const { __v, _id, createdAt, status, ...career } = this.toObject()
  career.id = _id
  career.createdAt = DateTime.fromISO(createdAt.toISOString())

  const { _id: _uId, password, __v: __uV, ...user } = career.user
  user.id = _uId
  career.user = user

  career.courses = career.courses.map((course) => {
    const { _id: c_id, __v: c__v, ...rest } = course
    rest.id = c_id
    return rest
  })

  return career
}

module.exports = model('Careers', CareerSchema)
