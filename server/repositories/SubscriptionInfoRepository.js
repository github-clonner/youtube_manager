let models = require('../models')
let logger = require('bug-killer')

class SubscriptionInfoRepository {

  async create (tagId, subscriptionId) {
    try {
      return await models.Tag.create({
        tag_id: tagId,
        subscription_id: subscriptionId
      })
    } catch (error) {
      logger.error('SubscriptionInfoRepository.create() error')
      throw (error)
    }
  }

  async findBySubscriptionId (subscriptionId) {
    try {
      return await models.SubscriptionInfoRepository.findOne({
        where: { subscription_id: subscriptionId }})
    } catch (error) {
      logger.error(`SubscriptionInfoRepository.findOne(${subscriptionId}) error`)
      throw (error)
    }
  }

  async findByTagId (tagId) {
    try {
      return await models.SubscriptionInfoRepository.findOne({
        where: { tag_id: tagId }})
    } catch (error) {
      logger.error(`SubscriptionInfoRepository.findOne(${tagId}) error`)
      throw (error)
    }
  }

  async deleteAll () {
    try {
      await models.SubscriptionInfo.destroy({ where: {} })
    } catch (error) {
      logger.error('SubscriptionInfoRepository.deleteAll() error')
      throw (error)
    }
  }
}

exports.SubscriptionInfoRepository = SubscriptionInfoRepository
