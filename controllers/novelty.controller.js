const { DateTime } = require('luxon')
const { request, response } = require('express')

const { Novelty } = require('../models')
const { serverErrorHandler } = require('../helpers')

const create = async (req = request, res = response) => {
  try {
    const { description, title } = req.body

    const data = {
      createdAt: DateTime.now(),
      description: description.toLowerCase().trim(),
      title: title.toLowerCase().trim(),
      user: req.authenticatedUser.id,
    }

    const novelty = new Novelty(data)
    novelty.save()

    res.json({
      novelty,
    })
  } catch (error) {
    console.log(error)
    handlerErrorServer(error)
  }
}

const findAll = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1
    lot = lot <= 0 || isNaN(lot) ? 10 : lot

    const query = { status: true }

    const [novelties, total] = await Promise.all([
      Novelty.find(query).populate('user').skip(from).limit(lot),
      Novelty.countDocuments(query),
    ])

    const quantity = novelties.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      novelties,
    })
  } catch (error) {
    handlerErrorServer(error)
  }
}

const update = async (req = request, res = response) => {
  try {
    const { title, description } = req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (title) data.title = title.toLowerCase().trim()
    if (description) data.description = description.toLowerCase().trim()

    const novelty = await Novelty.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    res.json({
      novelty,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteById = async (req = request, res = response) => {
  try {
    const deletedNovelty = await Novelty.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
        updatedAt: DateTime.now(),
      },
      { new: true }
    )
    res.json({
      deletedNovelty,
    })
  } catch (error) {
    handlerErrorServer(error)
  }
}

module.exports = {
  create,
  deleteById,
  findAll,
  update,
}
