var models = require('../models')
var logger = require('bug-killer')

class SubscriptionRepository {

  async truncate () {
    try {
      logger.info('Truncating table Subscriptions')
      let affectedRows = await models.Subscription.destroy({ truncate: true })
      logger.info(`Done. ${affectedRows} rows deleted.`)
    } catch (error) {
      throw (error)
    }
  }
}

exports.SubscriptionRepository = SubscriptionRepository
