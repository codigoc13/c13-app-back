const { request, response } = require('express')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { User, Product } = require('../models')
const { uploadFile } = require('../helpers')

const upload = async (req = request, res = response) => {
  try {
    // const fileName = await uploadFile(req.files, ['txt', 'md'], 'texts')
    const fileName = await uploadFile(req.files, undefined, 'imgs')
    res.status(200).json({
      fileName,
    })
  } catch (msg) {
    res.status(400).json({
      msg,
    })
  }
}

const updateImg = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params

    let model
    let entity

    switch (collection) {
      case 'users':
        entity = 'user'
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          })
        }
        break

      case 'products':
        entity = 'products'
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`,
          })
        }
        break

      default:
        return res.status(500).json({
          msg: `Por validar la colección ${collection}`,
        })
    }

    if (model.img) {
      const pathImg = path.join(__dirname, '../uploads', collection, model.img)
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
      }
    }

    const name = await uploadFile(req.files, undefined, collection)
    model.img = name

    await model.save()

    res.json({ entity, model })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

const getImg = async (req = request, res = response) => {
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

      case 'products':
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`,
          })
        }
        break

      default:
        return res.status(500).json({
          msg: `Por validar la colección ${collection}`,
        })
    }

    if (model.img) {
      const pathImg = path.join(__dirname, '../uploads', collection, model.img)
      if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg)
      }
    }

    const pathImg = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathImg)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

const updateImgCloudinary = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params

    let model
    let entity

    switch (collection) {
      case 'users':
        entity = 'user'
        model = await User.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          })
        }
        break

      case 'products':
        entity = 'product'
        model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`,
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
    await model.save()

    res.json({ entity, model })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

module.exports = {
  upload,
  updateImg,
  getImg,
  updateImgCloudinary,
}
