const { request, response } = require('express')
const { serverErrorHandler } = require('../helpers')
const { DateTime } = require('luxon')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { User } = require('../models')

const updateImg = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params

    let model

    switch (collection) {
      case 'users':
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          })
        }
        break

      default:
        return res.status(500).json({
          msg: `Por validar la colección ${collection}`,
        })
    }

    if (model.img) {
      const nameArr = model.img.split('/')
      const name = nameArr[nameArr.length - 1]
      const [public_id] = name.split('.')
      cloudinary.uploader.destroy(public_id)
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    model.img = secure_url
    model.updatedAt = DateTime.now()

    await model.save()

    res.json({ model })
  } catch (error) {
    serverErrorHandler(error, res)
  }
}

module.exports = {
  updateImg,
}
