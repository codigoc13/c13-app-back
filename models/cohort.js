const { Schema, model } = require('mongoose')

const CohortSchema = Schema({
  code: {
    type: String,
    required: true,
    // Combinación automática de año, carrera, etc. Por afinar.
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    // medida de tiempo: semanas
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
  },
  imgUrl: {
    type: String,
  },
  careers: {
    type: [Schema.Types.ObjectId],
    ref: 'Career',
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
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

<<<<<<< HEAD
// CohortSchema.methods.toJSON = function () {}
=======
CohortSchema.methods.toJSON = function () {
  const { __v, _id, status, ...cohort } = this.toObject()

  return cohort
}
>>>>>>> e366dde (Se evita el null en modelo y se modifica el controller)

module.exports = model('Cohort', CohortSchema)
