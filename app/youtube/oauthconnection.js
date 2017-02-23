const youtube = require("youtube-api");
const opn = require("opn");

const id = "60959107201-3u5ku20qidl8nsh0qet9d59d5eljoasj.apps.googleusercontent.com";
const secret = "sXs-xww1TYOl_v7NufUs6xyz";
const redirect = "http://localhost:3000/oauthredirect";

class OAuthConnection
{
    constructor() {
        this._oauth = null;
    }

    authenticate() {
        console.log("authentication");
        this._oauth = youtube.authenticate({
                type: "oauth",
                client_id: id,
                client_secret: secret,
                redirect_url: redirect
            });
    }

    generateUrl() {
        console.log("generation");
        opn(this._oauth.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/youtube"]
        }));
    }
        
    redirect(request, response) {
        this._oauth.getToken(request.query.code/*"toto"*/, (err, tokens) => {
            if (err) {
                console.log(err);
                process.exit();
            }

            this._oauth.setCredentials(tokens);
        
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
}

exports.OAuthConnection = OAuthConnection;