const { ObjectId } = require('mongoose').Types

const isObjectId = (searchTerm) =>
  ObjectId.isValid(searchTerm) &&
  new ObjectId(searchTerm).toString() === searchTerm

module.exports = { isObjectId }
