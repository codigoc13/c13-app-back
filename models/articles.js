const { Schema, model } = require('mongoose')
const { DateTime } = require('luxon')

const ArticleSchema = Schema({
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

ArticleSchema.methods.toJSON = function () {
  const { __v, _id, status, createdAt, ...article } = this.toObject()
  article.id = _id
  article.createdAt = DateTime.fromISO(createdAt.toISOString())

  const {
    __v: a__v,
    _id: a_id,
    password,
    status: uStatus,
    google,
    ...user
  } = article.user
  user.id = a_id
  article.user = user

  return article
}

module.exports = model('Article', ArticleSchema)
