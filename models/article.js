const { DateTime } = require('luxon')
const { Schema, model } = require('mongoose')

const ArticleSchema = Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
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

ArticleSchema.methods.toJSON = function () {
  const { __v, _id, status, createdAt, updatedAt, ...article } = this.toObject()

  article.id = _id

  article.createdAt = DateTime.fromJSDate(createdAt, {
    zone: 'America/Bogota',
  })

  if (updatedAt) {
    article.updatedAt = DateTime.fromJSDate(updatedAt, {
      zone: 'America/Bogota',
    })
  }

  const {
    __v: u__v,
    _id: u_id,
    password,
    status: uStatus,
    google,
    ...user
  } = article.user
  user.id = u_id

  article.user = user

  return article
}

module.exports = model('Article', ArticleSchema)
