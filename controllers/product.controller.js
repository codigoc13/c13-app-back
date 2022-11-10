const { request, response } = require('express')
const { DateTime } = require('luxon')

const { Product } = require('../models')

const getProducts = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 5 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1

    const query = { status: true }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('user')
        .populate('category')
        .skip(from)
        .limit(lot),
      Product.countDocuments(query),
    ])

    const quantity = products.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const getProductById = async (req = request, res = response) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
      .populate('user')
      .populate('category')

    res.status(200).json({
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const createProduct = async (req = request, res = response) => {
  try {
    let { name, status, ...body } = req.body

    name = req.body.name.trim().toUpperCase()
    const productDB = await Product.findOne({ name })

    if (productDB) {
      return res.status(400).json({
        msg: `El producto ${productDB.name} ya existe`,
      })
    }

    const data = {
      ...body,
      name,
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
      modifiedAt: DateTime.now(),
    }

    const product = new Product(data)
    const { _id } = await product.save()
    const newProduct = await Product.findOne({ _id })

    res.status(201).json({
      newProduct,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const updateProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params
    const { status, createdAt, ...body } = req.body
    const name = req.body.name.trim().toUpperCase()

    const productDB = await Product.findOne({ name })
    if (productDB) {
      return res.status(400).json({
        msg: `El producto ${productDB.name} ya existe`,
      })
    }

    const data = {
      ...body,
      name,
      user: req.authenticatedUser.id,
      modifiedAt: DateTime.now(),
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true })

    res.status(200).json({
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const deleteProdut = async (req = request, res = response) => {
  try {
    const { id } = req.params

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      {
        status: false,
      },
      {
        new: true,
      }
    )

    res.status(200).json({
      deletedProduct,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProdut,
}
