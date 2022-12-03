const { DateTime } = require('luxon')

const { isObjectId } = require('../validate-object-id')
const { Novelty, User } = require('../../models')
const { serverErrorHandler } = require('../server-error-handler')

const searchNovelties = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const novelty = await Novelty.findById(searchTerm).populate('user')

      return res.status(200).json({
        queriedFields: ['id'],
        results: novelty ? [novelty] : [],
      })
    }

    //2022-10-23
    const date = DateTime.fromFormat(searchTerm, 'yyyy-MM-dd').toUTC()
    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const novelties = await Novelty.find({
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
      }).populate('user')

      return res.status(200).json({
        queriedFields: ['createdAt', 'updatedAt'],
        quantity: novelties.length,
        novelties,
      })
    }

    if (searchTerm === 'true' || searchTerm === 'false') {
      const novelties = await Novelty.find({
        status: searchTerm === 'true',
      }).populate('user')

      return res.status(200).json({
        queriedFields: [`status: ${searchTerm}`],
        quantity: novelties.length,
        novelties,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    const novelties = await Novelty.find({
      title: regex,
      status: true,
    }).populate('user')

    res.status(200).json({
      queriedFields: ['title'],
      quantity: novelties.length,
      novelties,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const searchNoveltiesByUser = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const article = await Novelty.find({ user: searchTerm }).populate('user')
      return res.status(200).json({
        queriedFields: ['user.id'],
        results: article ? [article] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
    })
    const usersIds = users.map((user) => user.id)

    const articles = await Novelty.find({
      user: {
        $in: usersIds,
      },
      status: true,
    }).populate('user')

    res.status(200).json({
      queriedFields: ['user.firstName', 'user.lastName', 'user.username'],
      quantity: articles.length,
      articles,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  searchNovelties,
  searchNoveltiesByUser,
}
