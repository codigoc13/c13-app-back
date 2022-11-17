const { Schema, model } = require('mongoose')

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

module.exports = model('Course', CourseSchema)