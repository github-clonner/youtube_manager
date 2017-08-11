var models = require('../models')
let instance = null

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
    try {
      let data = await this.youtube.querySubscriptions(page)
      let extracted = this.createExtractedData(data)
      await models.Subscription.bulkCreate(extracted.items)

      return extracted
    } catch (error) {
      throw new Error('Can\'t get data: ' + error.message)
    }
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
    do {
      try {
        var subscriptions = await this.getSubscriptionsInfos(undefined, 50)
        return subscriptions
      } catch (error) {
        throw new Error('YoutubeDataService.refreshData: error while refreshing data')
      }
    } while (subscriptions.nextPage)
  }

  createUrlChannel (channelId) {
    return this.channelUrl + channelId
  }
}

exports.YoutubeDataService = YoutubeDataService
