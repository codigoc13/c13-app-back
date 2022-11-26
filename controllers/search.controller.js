const { request, response } = require('express')
const { User, Category, Product, Cohort, Career } = require('../models')
const { isObjectId, serverErrorHandler } = require('../helpers')
const { DateTime } = require('luxon')
const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles',
  'productsByCategory',
  'cohorts',
  'cohortsByUser',
  'cohortsByCareer',
  'cohortsByParticipant',
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

const searchCohorts = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.findById(searchTerm)
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['id'],
        results: cohort ? [cohort] : [],
      })
    }

    // if (!isNaN(Number(searchTerm))) {
    //   const products = await Product.find({ price: searchTerm, status: true })
    //     .populate('user', ['name', 'email'])
    //     .populate('category', 'name')

    //   return res.status(200).json({
    //     queriedFields: ['price'],
    //     quantity: products.length,
    //     products,
    //   })
    // }

    //2022-10-23T12:50:30.210Z
    const date = DateTime.fromFormat(
      searchTerm,
      'yyyy-MM-dd'
    ).toUTC()


    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const cohorts = await Cohort.find({
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
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['createdAt', 'updatedAt'],
        quantity: cohorts.length,
        cohorts,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    if (regex.test('true') || regex.test('false')) {
      const cohorts = await Cohort.find({
        status: regex.test('true'),
      })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['available'],
        quantity: cohorts.length,
        cohorts,
      })
    }

    const cohorts = await Cohort.find({ code: regex, status: true })
      .populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['code'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    serverErrorHandler(error, res)
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


const searchCohortsByUser = async (searchTerm = '', res = response) => {
  try {

    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ user: searchTerm })
        .populate('user')
        .populate('careers')
        .populate('participants')

      return res.status(200).json({
        queriedFields: ['user_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({ name: regex})
    const usersIds = users.map((user) => user.id)

    const cohorts = await Cohort.find({
      user: {
        $in: usersIds,
      },
      status: true,
    }).populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['user_name'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchCohortsByCareer = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ careers: { _id: searchTerm } })
        .populate('user')
        .populate('participants')
        .populate('careers')
      return res.status(200).json({
        queriedFields: ['career_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const careers = await Career.find({ name: regex })
    const careersIds = careers.map((career) => career.id)

    const cohorts = await Cohort.find({
      careers: {
        $in: careersIds,
      },
      status: true,
    }).populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['career_name'],
      quantity: cohorts.length,
      cohorts,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const searchCohortsByParticipant = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const cohort = await Cohort.find({ participants: { _id: searchTerm } })
        .populate('user')
        .populate('careers')
        .populate('participants')
      return res.status(200).json({
        queriedFields: ['user_id'],
        results: cohort ? [cohort] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const users = await User.find({ name: regex})
    const usersIds = users.map((user) => user.id)

    const cohort = await Cohort.find({
      participants: {
        $in: usersIds,
      },
      status: true,
    }).populate('user')
      .populate('careers')
      .populate('participants')

    res.status(200).json({
      queriedFields: ['user_name'],
      quantity: cohort.length,
      cohort,
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
      case 'cohorts':
        searchCohorts(searchTerm, res)
        break
      case 'productsByCategory':
        searchProductsByCategory(searchTerm, res)
        break
      case 'cohortsByUser':
        searchCohortsByUser(searchTerm, res)
        break
      case 'cohortsByCareer':
        searchCohortsByCareer(searchTerm, res)
        break
      case 'cohortsByParticipant':
        searchCohortsByParticipant(searchTerm, res)
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
