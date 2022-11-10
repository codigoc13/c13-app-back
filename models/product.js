const { DateTime } = require('luxon')
const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'El nombre es obligatorio'],
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
    required: [true, 'Si está disponible o no, es obligatorio'],
  },
  price: {
    type: Number,
    default: 0,
    required: [true, 'El precio es obligatorio'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    require: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
})

ProductSchema.methods.toJSON = function () {
  const { __v, _id, status, createdAt, modifiedAt, ...product } =
    this.toObject()
  product.id = _id

  product.createdAt = DateTime.fromISO(createdAt.toISOString())
  product.modifiedAt = DateTime.fromJSDate(modifiedAt, {
    zone: 'America/Bogota',
  })

  const { _id: _uId, password, __v: __uV, ...user } = product.user
  user.id = _uId
  product.user = user

  const { _id: _cId, __v: __cV, user: cUser, ...category } = product.category
  category.id = _cId
  product.category = category

  return product
}

module.exports = model('Product', ProductSchema)
