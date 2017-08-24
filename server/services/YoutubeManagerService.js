let models = require('../models')
let logger = require('bug-killer')
let { SubscriptionRepository } = require('../repositories/SubscriptionRepository')
let { TagRepository } = require('../repositories/TagRepository')

let instance = null
let subscriptionRepository = new SubscriptionRepository()
let tagRepository = new TagRepository()

class YoutubeManagerService {
  constructor (youtubeService) {
    if (!instance) {
      this.youtube = youtubeService
      this.channelUrl = 'https://www.youtube.com/channel/'
      instance = this
    }

    return instance
  }

  async createTagsBySubscription (data) {
    if (data.length === 0) {
      logger.info('No tags to create. Aborting')
      throw new Error('No tags to create. Aborting')
    }

    let result = []
    for (var tag of data) {
      let subscription = await subscriptionRepository.findOne(tag.subscriptionId)
      if (subscription !== null) {
        for (var tagEntry of tag.tags) {
          let theTag = await tagRepository.create({ title: tagEntry })
          await subscription.addTag(theTag)
          result.push(theTag)
        }
      }
    }

    return result
  }

  getExtractedData (data) {
    let extractedData = {}
    extractedData.items = []
    extractedData.nextPage = data.nextPageToken
    extractedData.previousPage = data.prevPageToken

    for (let i = 0; i < data.items.length; i++) {
      extractedData.items[i] = {}
      extractedData.items[i].id = data.items[i].id
      extractedData.items[i].title = data.items[i].snippet.title
      extractedData.items[i].url = this.createUrlChannel(data.items[i].snippet.resourceId.channelId)
      extractedData.items[i].thumbnail_url = data.items[i].snippet.thumbnails.default.url
    }

    return extractedData
  }

  async refreshData () {
    try {
      let page
      await subscriptionRepository.truncate()
      do {
        let data = await this.youtube.querySubscriptions(page)
        let extracted = this.getExtractedData(data)
        page = extracted.nextPage
        await models.Subscription.bulkCreate(extracted.items, { ignoreDuplicates: true, updateOnDuplicates: ['title', 'url', 'thumbnail_url', 'createdAt', 'updatedAt'] })
      } while (page !== undefined)
    } catch (error) {
      throw new Error('Can\'t get data: ' + error.message)
    }
  }

  createUrlChannel (channelId) {
    return this.channelUrl + channelId
  }
}

exports.YoutubeManagerService = YoutubeManagerService
