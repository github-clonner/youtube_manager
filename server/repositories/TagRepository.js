let models = require('../models')
let logger = require('bug-killer')

class TagRepository {

  async create (tag) {
    try {
      return await models.Tag.create(tag)
    } catch (error) {
      logger.error('TagRepository.create() error')
      throw (error)
    }
  }

  async deleteTagsBySubscription (subscriptionId) {
    try {

    } catch (error) {
      logger.error(`TagRepository.deleteTagsBySubscription(${subscriptionId})`)
      throw (error)
    }
  }

  async findTagsBySubscription (subscriptions) {
    try {

    } catch (error) {
      logger.error('TagRepository.findTagsBySubscription() error')
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
}

exports.TagRepository = TagRepository
