var models = require('../models')
var logger = require('bug-killer')

class TagRepository {

  async create (tagTitle) {
    try {
      logger.info(`TagRepository.create: ${tagTitle}`)
      let tag = await models.Tag.create({ title: tagTitle })
      return tag
    } catch (error) {
      throw (error)
    }
  }

  async find (tagId) {
    try {
      logger.info(`Finding tag: ${tagId}`)
      let tag = await models.Tag.findOne({
        where: { id: tagId }
      })
      return tag
    } catch (error) {
      throw (error)
    }
  }
}

exports.TagRepository = TagRepository
