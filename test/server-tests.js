let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let readJson = require('r-json')
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let expect = chai.expect

process.env.NODE_ENV = 'test'

let { TagRepository } = require('../server/repositories/TagRepository')
let { SubscriptionRepository } = require('../server/repositories/SubscriptionRepository')
let { YoutubeService } = require('../server/services/YoutubeService') 
let { YoutubeManagerService } = require('../server/services/YoutubeManagerService')

let youtubeService = new YoutubeService()
let youtubeManagerService = new YoutubeManagerService(youtubeService)


let app = require('../server/app')

chai.use(chaiHttp)
chai.use(sinonChai)

let data = null

describe('Test API', function() {

  let tagRepository = new TagRepository()
  let subscriptionRepository = new SubscriptionRepository()

  before(async function() {
    return await models.sequelize.sync()
  })

  beforeEach(async function() {
    try {
      await subscriptionRepository.create(
        {
          'id': 'subscriptionId1',
          'title': 'Subscription Title 1',
          'url': 'http://www.subscription1.com',
          'thumbnail_url': 'http://thumbnail1.com'
        }
      )
    } catch (error) {
      console.log('Erreur pendant création sub: ' + error.message)
    }
  })

  afterEach(async function() {
    let subTruncatePromise = subscriptionRepository.truncate()
    let tagTruncatePromise = tagRepository.truncate()
    await Promise.all([subTruncatePromise, tagTruncatePromise])
  })

  it('should create all tags for one subscription', function(done) {
    chai.request(app)
      .post('/api/tags')
      .send([{
        'subscriptionId': 'subscriptionId1',
        'tags': ['tag1', 'tag2', 'tag3']
      }])
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.headers
        expect(res).to.be.json
        expect(res.body).to.have.lengthOf(3)
        expect(res.body[0]).to.have.property('id')
        expect(res.body[0].id).to.be.above(0)
        expect(res.body[0]).to.have.property('title')
        expect(res.body[0].title).to.be.equal('tag1')
        expect(res.body[1]).to.have.property('id')
        expect(res.body[1].id).to.be.above(0)
        expect(res.body[1]).to.have.property('title')
        expect(res.body[1].title).to.be.equal('tag2')
        expect(res.body[2]).to.have.property('id')
        expect(res.body[2].id).to.be.above(0)
        expect(res.body[2]).to.have.property('title')
        expect(res.body[2].title).to.be.equal('tag3')
        done()
      })
  })

  it('should create one tag for one subscription', function(done) {
    chai.request(app)
      .post('/api/tags')
      .send([{
        'subscriptionId': 'subscriptionId1',
        'tags': ['tag4']
      }])
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.headers
        expect(res).to.be.json
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0]).to.have.property('id')
        expect(res.body[0].id).to.be.above(0)
        expect(res.body[0]).to.have.property('title')
        expect(res.body[0].title).to.be.equal('tag4')
        done()
      })
  })
})

describe('Test services', function() {
  let youtubeStub = null
  let response = readJson(__dirname + '/files/subs.json')
  let nextResponse = readJson(__dirname +'/files/subs2.json')
  
  beforeEach(function() {
    youtubeStub = sinon.stub(youtubeService, 'querySubscriptions')
    youtubeStub.withArgs(undefined).resolves(response)
    youtubeStub.withArgs('CAUQAA').resolves(nextResponse)
  })

  it('should extract data from youtube api', async function() {
    let extractedData = await youtubeManagerService.getExtractedData(undefined)
    
    expect(extractedData.items.length).to.be.equal(10)
    expect(extractedData.items[0].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[0].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[0].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[0].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[1].id).to.be.equal('Iy1499R-3VEo6r52o4zsr2f_ovQj5T0P6T2F8E0NSJI')
    expect(extractedData.items[1].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[1].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[1].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[2].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[2].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[2].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[2].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[3].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[3].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[3].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[3].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[4].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[4].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[4].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[4].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[5].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[5].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[5].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[5].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[6].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[6].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[6].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[6].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[7].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[7].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[7].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[7].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[8].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[8].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[8].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[8].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[9].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[9].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[9].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[9].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
  })

  afterEach(function() {
    youtubeStub.restore()
  })
})

describe('Misc', function() {
  
  it('should give 404 with bad url', function(done) {
    chai.request(app)
      .get('/bad_url')
      .end(function (err, res) {
        expect(err).to.be.not.null
        expect(res).to.have.status(404)
        done()
      })
  })
})
