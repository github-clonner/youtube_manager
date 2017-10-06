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

  async createTagCollection (data) {
    if (data.length === 0) {
      logger.info('No tags to create. Aborting')
      throw new Error('No tags to create. Aborting')
    }

    // let result = []
    let subscription = await subscriptionRepository.findOne(data.subscriptionId)
    let resJson = {}

    if (subscription !== null) {
      resJson.subscriptionId = data.subscriptionId
      resJson.tags = []

      // remove duplicates tags for this subscription
      let tags = Array.from(new Set(data.tags))

      for (var tag of tags) {
        let theTag = await tagRepository.findTagByLabel(tag)

        if (theTag == null) {
          let newTag = await tagRepository.create({ title: tag })
          await subscription.addTag(newTag)
          resJson.tags.push(newTag)
        } else {
          if (!await subscription.hasTag(theTag)) {
            subscription.addTag(theTag)
            resJson.tags.push(theTag)
            // result.push(resJson)
          }
        }
      }
      // result.push(resJson)
    }
    return resJson
  }

  async getExtractedData (page) {
    let extractedData = {}
    extractedData.items = []

    let itemIndex = 0
    let nextPage = page

    do {
      try {
        let data = await this.youtube.querySubscriptions(nextPage)
        nextPage = data.nextPageToken

        for (let i = 0; i < data.items.length; i++) {
          extractedData.items[itemIndex] = {}
          extractedData.items[itemIndex].id = data.items[i].id
          extractedData.items[itemIndex].title = data.items[i].snippet.title
          extractedData.items[itemIndex].url = this.createUrlChannel(data.items[i].snippet.resourceId.channelId)
          extractedData.items[itemIndex].thumbnail_url = data.items[i].snippet.thumbnails.default.url
          itemIndex++
        }
      } catch (error) {
        logger.error('Error while retrieving youtube data: ' + error.message)
        throw (error)
      }
    } while (nextPage !== undefined)

    return extractedData
  }

  async refreshData () {
    try {
      let extracted = this.getExtractedData(undefined)
      await subscriptionRepository.deleteAll()
      await models.Subscription.bulkCreate(extracted.items, { ignoreDuplicates: true, updateOnDuplicates: ['title', 'url', 'thumbnail_url', 'createdAt', 'updatedAt'] })
    } catch (error) {
      throw new Error('Can\'t refresh data: ' + error.message)
    }
  }

  createUrlChannel (channelId) {
    return this.channelUrl + channelId
  }
}

exports.YoutubeManagerService = YoutubeManagerService
