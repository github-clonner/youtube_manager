const youtube = require("youtube-api");

class YoutubeQuery
{
    querySubscriptions() {
        return new Promise(
            function(resolve, reject) {
                var req = youtube.subscriptions.list({
                        part: "snippet2",
                        mine: "true"
                    }, (err, data) => {
                        if (err) {
                            var error = new Error("Error while getting subscriptions");
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });     
            }
        )
    }
}

exports.YoutubeQuery = YoutubeQuery;