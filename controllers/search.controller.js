const { request, response } = require('express')
const { User, Category, Product } = require('../models')
const { isObjectId } = require('../helpers')
const { DateTime } = require('luxon')
const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles',
  'productsByCategory',
]

const searchUsers = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const user = await User.findById(searchTerm)
      return res.status(200).json({
        results: user ? [user] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ status: true }],
    })
    res.status(200).json({
      quantity: users.length,
      results: users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchCategories = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const category = await Category.findById(searchTerm)
      return res.status(200).json({
        results: category ? [category] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const categories = await Category.find({
      name: regex,
      status: true,
    }).populate('user', ['name'])

    res.status(200).json({
      quantity: categories.length,
      results: categories,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchProducts = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const product = await Product.findById(searchTerm)
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      return res.status(200).json({
        queriedFields: ['id'],
        results: product ? [product] : [],
      })
    }

    if (!isNaN(Number(searchTerm))) {
      const products = await Product.find({ price: searchTerm, status: true })
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      return res.status(200).json({
        queriedFields: ['price'],
        quantity: products.length,
        products,
      })
    }

    //2022-10-23T12:50:30.210Z
    const date = DateTime.fromFormat(
      searchTerm,
      "yyyy-MM-dd'T'hh:mm:ss.SSS'Z'"
    ).toUTC()

    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$modifiedAt', timezone: 'America/Bogota' }
      const products = await Product.find({
        $or: [
          {
            $expr: {
              $and: [{ $eq: [{ $year: UTCCreatedAt }, { $year: date }] }],
              $and: [{ $eq: [{ $month: UTCCreatedAt }, { $month: date }] }],
              $and: [
                { $eq: [{ $dayOfMonth: UTCCreatedAt }, { $dayOfMonth: date }] },
              ],
            },
          },
          {
            $expr: {
              $and: [{ $eq: [{ $year: UTCUpdatedAt }, { $year: date }] }],
              $and: [{ $eq: [{ $month: UTCUpdatedAt }, { $month: date }] }],
              $and: [
                { $eq: [{ $dayOfMonth: UTCUpdatedAt }, { $dayOfMonth: date }] },
              ],
            },
          },
        ],
        $and: [{ status: true }],
      })
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      return res.status(200).json({
        queriedFields: ['createdAt', 'modifiedAt'],
        quantity: products.length,
        products,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    if (regex.test('true') || regex.test('false')) {
      const products = await Product.find({
        available: regex.test('true'),
        status: true,
      })
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      return res.status(200).json({
        queriedFields: ['available'],
        quantity: products.length,
        products,
      })
    }

    const products = await Product.find({ name: regex, status: true })
      .populate('user', ['name', 'email'])
      .populate('category', 'name')

    res.status(200).json({
      queriedFields: ['name'],
      quantity: products.length,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchProductsByCategory = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const product = await Product.findById({ category: searchTerm })
        .populate('user', ['name', 'email'])
        .populate('category', 'name')
      return res.status(200).json({
        results: product ? [product] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const categories = await Category.find({ name: regex, status: true })
    const categoriesIds = categories.map((category) => category.id)

    const products = await Product.find({
      category: {
        $in: categoriesIds,
      },
      status: true,
    })
      .populate('user', ['name', 'email'])
      .populate('category', 'name')

    res.status(200).json({
      quantity: products.length,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const search = (req = request, res = response) => {
  try {
    const { collection, searchTerm } = req.params

    if (!allowedCollections.includes(collection)) {
      return res.status(400).json({
        msg: 'Colección de búsqueda no existe',
        allowedCollections,
      })
    }

    switch (collection) {
      case 'users':
        searchUsers(searchTerm, res)
        break
      case 'categories':
        searchCategories(searchTerm, res)
        break
      case 'products':
        searchProducts(searchTerm, res)
        break
      case 'productsByCategory':
        searchProductsByCategory(searchTerm, res)
        break
      default:
        res.status(500).json({
          msg: 'Búsqueda por hacer',
        })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  search,
}
