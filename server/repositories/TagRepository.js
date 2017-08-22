let models = require('../models')
let logger = require('bug-killer')

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

  /*async create (tagsArray) {
    try {
      if (tagsArray.length === 0) {
        return
      }

      let result = []
      for (var tag of tagsArray) {
        let data = await models.Tag.create({ title: tag })
        result.push(data)
      }

      return result
    } catch (error) {
      throw (error)
    }
  }*/

  async truncate () {
    try {
      logger.info('Truncating table Tags')
      let affectedRows = await models.Tag.destroy({ where: {}, truncate: true })
      logger.info(`Done. ${affectedRows} rows deleted.`)
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
