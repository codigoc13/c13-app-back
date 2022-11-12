const { Schema, model } = require('mongoose')
const { DateTime } = require('luxon')

const NoveltySchema = Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
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

NoveltySchema.methods.toJSON = function () {
  const { __v, _id, status, createdAt, ...novelty } = this.toObject()
  novelty.id = _id
  novelty.createdAt = DateTime.fromISO(createdAt.toISOString())

  const {
    __v: u__v,
    _id: u_id,
    password,
    status: uStatus,
    google,
    ...user
  } = novelty.user
  user.id = u_id

  novelty.user = user

  return novelty
}

module.exports = model('Novelty', NoveltySchema)
