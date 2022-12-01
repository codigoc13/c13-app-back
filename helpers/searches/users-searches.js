const { User } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')

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
    serverErrorHandler(error, res)
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
    serverErrorHandler(error, res)
  }
}

module.exports = {
  searchCategories,
  searchUsers,
}
