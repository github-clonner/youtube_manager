let models = require('../models')
let logger = require('bug-killer')

class SubscriptionRepository {

  async deleteAll () {
    try {
      await models.Subscription.destroy({ where: {} })
    } catch (error) {
      logger.error('SubscriptionRepository.deleteAll() error')
      throw (error)
    }
  }

  async findOne (subId) {
    try {
      let subscription = await models.Subscription.findOne({ where: { id: subId } })
      return subscription
    } catch (error) {
      logger.error('SubscriptionRepository.findOne() error')
      throw (error)
    }
  }

  async create (sub) {
    try {
      let subscription = await models.Subscription.create({
        id: sub.id,
        title: sub.title,
        url: sub.url,
        thumbnail_url: sub.thumbnail_url
      })

      return subscription
    } catch (error) {
      logger.error('SubscriptionRepository.create() error')
      throw (error)
    }
  }
}

exports.SubscriptionRepository = SubscriptionRepository
