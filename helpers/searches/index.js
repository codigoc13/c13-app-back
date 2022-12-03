const articlesSearches = require('./articles-searches')
const careersSearches = require('./careers-searches')
const coursesSearches = require('./courses-searches')
const noveltiesSearches = require('./novelties-searches')

module.exports = {
  ...articlesSearches,
  ...careersSearches,
  ...coursesSearches,
  ...noveltiesSearches,
}
