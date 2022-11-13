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

module.exports = model('Article', ArticleSchema)