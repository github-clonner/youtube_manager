let models = require('../models')
let logger = require('bug-killer')

class TagSubscriptionRepository {

  async deleteAll () {
    try {
      await models.TagSubscription.destroy({ where: {} })
    } catch (error) {
      logger.error('SubscriptionRepository.deleteAll() error')
      throw (error)
    }
  }
}

exports.TagSubscriptionRepository = TagSubscriptionRepository
