const youtube = require("youtube-api");

class YoutubeQuery
{
    querySubscriptions() {
        return new Promise((resolve, reject) => {
            var req = youtube.subscriptions.list({
                    part: "snippet",
                    mine: "true"
                }, (err, data) => {
                    if (err) {
                        var error = new Error(err);
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });     
        });
    }
}

exports.YoutubeQuery = YoutubeQuery;