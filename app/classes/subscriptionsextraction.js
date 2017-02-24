class SubscriptionsExtraction {
  constructor (data) {
    this.data = data
  }

  extractInfo () {
    let extractedData = {}
    extractedData.labels = []
    for (let i = 0; i < this.data.items.length; i++) {
      extractedData.labels.push(this.data.items[i].snippet.title)
    }
    return extractedData
  }
}

exports.SubscriptionsExtraction = SubscriptionsExtraction
