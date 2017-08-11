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
      let data = await this.youtube.querySubscriptions(page, size)
      return this.createExtractedData(data, size)
    } catch (error) {
      throw new Error('Can\'t get data: ' + error.message)
    }
  }

  createExtractedData (data, size) {
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
