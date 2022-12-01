const { serverErrorHandler } = require('../server-error-handler')

const searchCareers = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const career = await Career.findById(searchTerm).populate('user')

      return res.status(200).json({
        queriedFields: ['id'],
        results: career ? [career] : [],
      })
    }

    //2022-10-23
    const date = DateTime.fromFormat(searchTerm, 'yyyy-MM-dd').toUTC()

    if (!date.invalid) {
      const UTCCreatedAt = { date: '$createdAt', timezone: 'America/Bogota' }
      const UTCUpdatedAt = { date: '$updatedAt', timezone: 'America/Bogota' }
      const careers = await Career.find({
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
        quantity: careers.length,
        careers,
      })
    }

    const regex = new RegExp(searchTerm, 'i')

    if (regex.test('true') || regex.test('false')) {
      const careers = await Career.find({
        status: regex.test('true'),
      }).populate('user')

      return res.status(200).json({
        queriedFields: ['available'],
        quantity: careers.length,
        careers,
      })
    }

    const careers = await Career.find({ name: regex, status: true }).populate(
      'user'
    )

    res.status(200).json({
      queriedFields: ['name'],
      quantity: careers.length,
      careers,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const searchCareersByUser = async (searchTerm = '', res = response) => {
  try {
    if (isObjectId(searchTerm)) {
      const career = await Career.find({ user: searchTerm })
        .populate('user')
        .populate('courses')
      return res.status(200).json({
        queriedFields: ['user_id'],
        results: career ? [career] : [],
      })
    }

    const regex = new RegExp(searchTerm, 'i')
    const users = await User.find({ name: regex })
    const usersIds = users.map((user) => user.id)

    const careers = await Career.find({
      user: {
        $in: usersIds,
      },
      status: true,
    }).populate('user')

    res.status(200).json({
      queriedFields: ['user_name'],
      quantity: careers.length,
      careers,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = { searchCareers, searchCareersByUser }
