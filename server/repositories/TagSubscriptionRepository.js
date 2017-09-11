let models = require('../models')
let logger = require('bug-killer')

class TagSubscriptionRepository {

  async truncate () {
    try {
      await models.TagSubscription.destroy({ where: {}, truncate: true })
    } catch (error) {
      logger.error('SubscriptionRepository.truncate() error')
      throw (error)
    }
  }
}

exports.TagSubscriptionRepository = TagSubscriptionRepository
