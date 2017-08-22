let models = require('../models')
let logger = require('bug-killer')
let { SubscriptionRepository } = require('./SubscriptionRepository')

let subscriptionRepository = new SubscriptionRepository()

class TagRepository {

  /* async create (tag) {
    try {
      logger.info(`TagRepository.create: ${tag.title}`)
      let out = await models.Tag.create({ title: tag.title })
      return out
    } catch (error) {
      throw (error)
    }
  } */

  async create (tagsArray) {
    try {
      if (tagsArray.length === 0) {
        return
      }

      let result = []
      for (var tag of tagsArray) {
        let subscription = await subscriptionRepository.findOne(tag.subscriptionId)
        if (subscription !== null) {
          for (var tagEntry of tag.tags) {
            let theTag = await models.Tag.create({ title: tagEntry })
            subscription.addTag(theTag)
            result.push(theTag)
          }
        }
      }

      return result
    } catch (error) {
      throw (error)
    }
  }

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
