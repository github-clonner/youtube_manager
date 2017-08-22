let models = require('../models')
let { SubscriptionRepository } = require('../repositories/SubscriptionRepository')

let instance = null
let subscriptionRepository = new SubscriptionRepository()

class YoutubeDataService {
  constructor (youtubeService) {
    if (!instance) {
      this.youtube = youtubeService
      this.channelUrl = 'https://www.youtube.com/channel/'
      instance = this
    }

    return instance
  }

  async getSubscriptionsInfos (page) {
   
  }

  createExtractedData (data) {
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
        let extracted = this.createExtractedData(data)
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

exports.YoutubeDataService = YoutubeDataService
