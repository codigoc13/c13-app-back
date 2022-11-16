const { request, response } = require('express')
const { DateTime } = require('luxon')
const { serverErrorHandler } = require('../helpers')
const { Novelty } = require('../models')

const create = async (req = request, res = response) => {
  try {
    let { title, description } = req.body
    title = title.toLowerCase().trim()

    const noveltyDB = await Novelty.findOne({ title })
    if (noveltyDB) {
      return res.status(400).json({
        msg: `Ya existe una noticia con el título ${title}`,
      })
    }

    const data = {
      title,
      description,
      user: req.authenticatedUser.id,
      createdAt: DateTime.now(),
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
    let { title, description } = req.body

    const data = {
      updatedAt: DateTime.now(),
    }

    if (title) {
      title = title.toLowerCase().trim()
      const noveltyDB = await Novelty.findOne({ title })
      if (noveltyDB) {
        return res.status(400).json({
          msg: `Ya existe una noticia con el título ${title}`,
        })
      }
      data.title = title
    }

    if (description) data.description = description

    const novelty = await Novelty.findByIdAndUpdate(req.params.id, data, {
      new: true,
    })

    novelty.save()
    res.json({
      novelty,
    })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

const deleteById = async (req = request, res = response) => {
  try {
    const novelty = await Novelty.findByIdAndUpdate(
      req.params.id,
      {
        status: false,
        updatedAt: DateTime.now(),
      },
      { new: true }
    )
    res.json({
      novelty,
    })
  } catch (error) {
    handlerErrorServer(error)
  }
}

module.exports = {
  create,
  findAll,
  update,
  deleteById,
}
