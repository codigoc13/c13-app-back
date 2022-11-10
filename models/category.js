const { Schema, model } = require('mongoose')

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
})

CategorySchema.methods.toJSON = function () {
  const { __v, _id, status, ...category } = this.toObject()
  category.id = _id

  const { _id: _uId, password, __v: __uV, ...user } = category.user
  user.id = _uId
  category.user = user

  return category
}

module.exports = model('Category', CategorySchema)
