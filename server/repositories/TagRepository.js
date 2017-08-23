let models = require('../models')
let logger = require('bug-killer')
let { SubscriptionRepository } = require('./SubscriptionRepository')

let subscriptionRepository = new SubscriptionRepository()

class TagRepository {

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
            await subscription.addTag(theTag)
            result.push(theTag)
          }
        }
      }

      return result
    } catch (error) {
      logger.error('TagRepository.create() error')
      throw (error)
    }
  }

  async truncate () {
    try {
      await models.Tag.destroy({ where: {}, truncate: true })
    } catch (error) {
      logger.error('TagRepository.truncate() error')
      throw (error)
    }
  }

  async find (tagId) {
    try {
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
