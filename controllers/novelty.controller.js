const { request, response } = require('express')
const { DateTime } = require('luxon')
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
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const findAll = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 10 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1

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
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  create,
  findAll,
}
