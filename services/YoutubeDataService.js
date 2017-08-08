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

  async getSubscriptionsInfos (page, size) {
    try {
      var data = await this.youtube.querySubscriptions(page, size)
    } catch (error) {
      throw new Error('Can\'t get data: ' + error.message)
    }

    let extractedData = {}
    extractedData.items = []
    extractedData.nextPage = data.nextPageToken
    extractedData.previousPage = data.prevPageToken
    extractedData.size = size

    for (let i = 0; i < data.items.length; i++) {
      extractedData.items[i] = {}
      extractedData.items[i].id = data.items[i].id
      extractedData.items[i].title = data.items[i].snippet.title
      extractedData.items[i].url = this.createUrlChannel(data.items[i].snippet.resourceId.channelId)
      extractedData.items[i].thumbnail = data.items[i].snippet.thumbnails.default.url
      extractedData.items[i].description = data.items[i].snippet.description
    }

    return extractedData
  }

  async refreshData () {
    try {
      var subscriptions = await this.getSubscriptionsInfos(undefined, 50)
      return subscriptions
    } catch (error) {
      throw new Error('YoutubeDataService.refreshData: error while refreshing data')
    }
  }

  createUrlChannel (channelId) {
    return this.channelUrl + channelId
  }
}

exports.YoutubeDataService = YoutubeDataService
