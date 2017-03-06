const youtube = require('youtube-api')

class YoutubeQuery {
  querySubscriptions () {
    return new Promise((resolve, reject) => {
      youtube.subscriptions.list({
        part: 'snippet',
        mine: 'true',
        maxResults: 50
      }, (err, data) => {
        if (err) {
          let error = new Error(err)
          reject(error)
          return
        }
        resolve(data)
      })
    })
  }
}

exports.YoutubeQuery = YoutubeQuery
