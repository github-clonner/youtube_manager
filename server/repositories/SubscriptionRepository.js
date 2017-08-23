let models = require('../models')
let logger = require('bug-killer')
let moment = require('moment')

class SubscriptionRepository {

  async truncate () {
    try {
      await models.Subscription.destroy({ where: {}, truncate: true })
    } catch (error) {
      logger.error('SubscriptionRepository.truncate() error')
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
      let currentDatetime = moment()
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
      logger.error('SubscriptionRepository.create() error')
      throw (error)
    }
  }
}

exports.SubscriptionRepository = SubscriptionRepository
