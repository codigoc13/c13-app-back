const { Novelty } = require('../../models')
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
      console.log(date)
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

    const regex = new RegExp(searchTerm, 'i')

    if (regex.test('true') || regex.test('false')) {
      const novelties = await Novelty.find({
        status: regex.test('true'),
      }).populate('user')

      return res.status(200).json({
        queriedFields: ['available'],
        quantity: novelties.length,
        novelties,
      })
    }

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

module.exports = {
  searchNovelties,
}
