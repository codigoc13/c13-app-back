const { DateTime } = require('luxon')
const { Schema, model } = require('mongoose')

const InvoiceSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
    require: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
})

InvoiceSchema.methods.toJSON = function () {
  const { __v, _id, createdAt, ...invoice } = this.toObject()
  invoice.id = _id
  invoice.createdAt = DateTime.fromISO(createdAt.toISOString())

  const { _id: _uId, password, __v: __uV, ...user } = invoice.user
  user.id = _uId
  invoice.user = user

  invoice.products = invoice.products.map((product) => {
    const { _id: p_id, __v: p__v, ...rest } = product
    rest.id = p_id
    return rest
  })

  return invoice
}

module.exports = model('Invoice', InvoiceSchema)
