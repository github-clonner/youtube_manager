const youtube = require('youtube-api')

class YoutubeService {

  querySubscriptions (page, size) {
    return new Promise((resolve, reject) => {
      youtube.subscriptions.list({
        part: 'snippet',
        mine: 'true',
        maxResults: size,
        pageToken: page
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

exports.YoutubeService = YoutubeService
