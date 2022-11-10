const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

const getUsers = async (req = request, res = response) => {
  let { from = 0, lot = 5 } = req.query
  from = from <= 0 || isNaN(from) ? 0 : from - 1

  const query = { status: true }

  const [users, total] = await Promise.all([
    User.find(query).skip(from).limit(lot),
    User.countDocuments(query),
  ])

  const quantity = users.length
  const pagination = {
    from: Number(from + 1),
    lot: Number(lot),
  }

  res.json({
    total,
    quantity,
    pagination,
    users,
  })
}

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body
  const user = new User({ name, email, password, role })

  user.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
  await user.save()

  res.status(201).json({
    user,
  })
}

const updateUser = async (req = request, res = response) => {
  const { id } = req.params
  const { _id, password, google, ...remainder } = req.body

  if (password) {
    remainder.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
  }
  const user = await User.findByIdAndUpdate(id, remainder, { new: true })

  res.status(200).json({
    user,
  })
}

const deleteUser = async (req = request, res = reponse) => {
  const { id } = req.params

  const deletedUser = await User.findByIdAndUpdate(id, { status: false })
  res.json({
    deletedUser,
  })
}

module.exports = { getUsers, createUser, updateUser, deleteUser }
