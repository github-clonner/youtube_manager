class SubscriptionsExtraction {
  constructor (data) {
    this.data = data
    this.channelUrl = 'https://www.youtube.com/channel/'
  }

  extractInfo () {
    let extractedData = {}
    extractedData.items = []

    for (let i = 0; i < this.data.items.length; i++) {
      extractedData.items[i] = {}
      extractedData.items[i].id = this.data.items[i].id
      extractedData.items[i].title = this.data.items[i].snippet.title
      extractedData.items[i].url = this.createUrlChannel(this.data.items[i].snippet.resourceId.channelId)
      extractedData.items[i].thumbnail = this.data.items[i].snippet.thumbnails.default.url
      extractedData.items[i].description = this.data.items[i].snippet.description
    }

    return extractedData
  }

  createUrlChannel (channelId) {
    return this.channelUrl + channelId
  }
}

exports.SubscriptionsExtraction = SubscriptionsExtraction
