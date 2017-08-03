const youtube = require('youtube-api')

class YoutubeService {

  querySubscriptions () {
    return new Promise((resolve, reject) => {
      youtube.subscriptions.list({
        part: 'snippet',
        mine: 'true',
        maxResults: 50
      }, (err, data) => {
        if (err) {
          reject(new Error(err))
          return
        }
        resolve(data)
      })
    })
  }
}

exports.YoutubeQuery = YoutubeService