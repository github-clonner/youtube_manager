const youtube = require("youtube-api");
const opn = require("opn");
const id = "60959107201-3u5ku20qidl8nsh0qet9d59d5eljoasj.apps.googleusercontent.com";
const secret = "sXs-xww1TYOl_v7NufUs6xyz";
const redirect = "http://localhost:3000/oauthredirect";

let oauth = null;

exports.init = () => {
    console.log("authentication");
    oauth = youtube.authenticate({
                type: "oauth",
                client_id: id,
                client_secret: secret,
                redirect_url: redirect
            });

    console.log("generation");
    opn(oauth.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/youtube"]
        }));
}

exports.oauthredirect = (request, response) => {
    oauth.getToken(request.query.code, (err, tokens) => {
        
        if (err) {
            console.log("erreur");
            process.exit();
        }

        oauth.setCredentials(tokens);
        //response.end();

        var req = youtube.subscriptions.list({
            part: "snippet",
            mine: "true"
        }, (err, data) => {
            response.end(JSON.stringify(data));
            console.log(JSON.stringify(data));
            process.exit();
        });
    });
}