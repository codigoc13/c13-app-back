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

module.exports = {
  create,
}
