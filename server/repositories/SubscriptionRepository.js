let models = require('../models')
let logger = require('bug-killer')

class SubscriptionRepository {

  async truncate () {
    try {
      logger.info('Truncating table Subscriptions')
      let affectedRows = await models.Subscription.destroy({ where: {}, truncate: true })
      logger.info(`Done. ${affectedRows} rows deleted.`)
    } catch (error) {
      throw (error)
    }
  }

  async create (sub) {
    try {
      logger.info('Creating subscription')
      let currentDatetime = new Date().toLocaleString()
      let subscription = await models.Subscription.create({
        id: sub.id,
        title: sub.title,
        url: sub.url,
        thumbnail_url: sub.thumbnail_url,
        createdAt: currentDatetime,
        updatedAt: currentDatetime
      })

      return subscription
    } catch (error) {
      throw (error)
    }
  }
}

exports.SubscriptionRepository = SubscriptionRepository
