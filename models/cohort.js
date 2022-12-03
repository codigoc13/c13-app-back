const {Schema, model} = require('mongoose')
const {DateTime} = require('luxon')

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
  updatedAt: {
    type: Date,
  },
})

CohortSchema.methods.toJSON = function () {
  const {__v, _id, status, createdAt, updatedAt, ...cohort} = this.toObject()

  cohort.createdAt = DateTime.fromJSDate(createdAt, {zone: 'America/Bogota'})
  if (updatedAt)
    cohort.updatedAt = DateTime.fromJSDate(updatedAt, {zone: 'America/Bogota'})

  cohort.careers = cohort.careers.map((career) => {
    const {_id: c_id, __v: c__v, status, ...rest} = career
    rest.id = c_id
    return rest
  })

  cohort.participants = cohort.participants.map((participant) => {
    const {
      _id: c_id,
      __v: c__v,
      password,
      status,
      google,
      ...rest
    } = participant
    rest.id = c_id
    return rest
  })

  const {
    __v: u__v,
    password,
    _id: u_id,
    status: uStatus,
    google,
    ...user
  } = cohort.user
  user.id = u_id
  cohort.user = user

  cohort.id = _id
  return cohort
}

module.exports = model('Cohort', CohortSchema)
