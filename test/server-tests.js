let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let readJson = require('r-json')
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
let expect = chai.expect

let { TagRepository } = require('../server/repositories/TagRepository')
let { SubscriptionRepository } = require('../server/repositories/SubscriptionRepository')
let { SubscriptionInfoRepository } = require('../server/repositories/SubscriptionInfoRepository')
let { YoutubeService } = require('../server/services/YoutubeService') 
let { YoutubeManagerService } = require('../server/services/YoutubeManagerService')

let youtubeService = new YoutubeService()
let youtubeManagerService = new YoutubeManagerService(youtubeService)

let app = require('../server/app')

chai.use(chaiHttp)
chai.use(sinonChai)

let data = null

let tagRepository = new TagRepository()
let subscriptionRepository = new SubscriptionRepository()
let subsciptionInfoRepository = new SubscriptionInfoRepository()

async function clearData() {
 
  let subPromise = subscriptionRepository.deleteAll()
  let tagPromise = tagRepository.deleteAll()
  let subInfoPromise = subsciptionInfoRepository.deleteAll()

  try {
    await Promise.all([subPromise, tagPromise, subInfoPromise])
  } catch (error) {
    throw error
  }
}

describe('Test API', function() {

  before(async function() {
    return await models.sequelize.sync()
  })

  beforeEach(async function() {
    try {
      
      await clearData()
      let subscription = await subscriptionRepository.create(
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

  it('should create all unique tags for one subscription', function(done) {
    chai.request(app)
      .post('/api/tags-collection')
      .send({
        'subscriptionId': 'subscriptionId1',
        'tags': ['tag1', 'tag2', 'tag3', 'tag1']
      })
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.headers
        expect(res).to.be.json
        expect(res.body).to.have.property('subscriptionId')
        expect(res.body.subscriptionId).to.be.equal('subscriptionId1')
        expect(res.body).to.have.property('tags')
        expect(res.body.tags).to.have.lengthOf(3)
        expect(res.body.tags[0].title).to.be.equal('tag1')
        expect(res.body.tags[1].title).to.be.equal('tag2')
        expect(res.body.tags[2].title).to.be.equal('tag3')
        done()
      })
  })

  it('should create one tag for one subscription', function(done) {
    chai.request(app)
      .post('/api/tags-collection')
      .send({
        'subscriptionId': 'subscriptionId1',
        'tags': ['tag4']
      })
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.headers
        expect(res).to.be.json
        expect(res.body).to.have.property('subscriptionId')
        expect(res.body.subscriptionId).to.be.equal('subscriptionId1')
        expect(res.body).to.have.property('tags')
        expect(res.body.tags).to.have.lengthOf(1)
        expect(res.body.tags[0].title).to.be.equal('tag4')
        done()
      })
  })
})

describe('Test services', function() {
  let youtubeStub = null
  let response = readJson(__dirname + '/files/subs.json')
  let nextResponse = readJson(__dirname +'/files/subs2.json')
  
  async function createData() {
    let subscription1 = {
      id: 'Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c',
      title: 'subscription1 title',
      url: 'http://fakeurl.com',
      thumbnail_url: 'http://fakethumbnail.com'
    }
    let subscription2 = {
      id: 'Iy1499R-3VEo6r52o4zsr2f_ovQj5T0P6T2F8E0NSJI',
      title: 'subscription2 title',
      url: 'http://fakeurl2.com',
      thumbnail_url: 'http://fakethumbnail2.com'
    }
    let titleTag1 = 'tag1'
    let titleTag2 = 'tag2'

    let sub1 = await subscriptionRepository.create(subscription1)
    let sub2 = await subscriptionRepository.create(subscription2)
    let tag1 = await tagRepository.create({ title: titleTag1 })
    let tag2 = await tagRepository.create({ title: titleTag2 })

    await sub1.addTag(tag1)
    await sub2.addTag(tag2)
  }

  before(async function() {
    return await models.sequelize.sync()
  })

  beforeEach(async function() {
    await clearData()
    await createData()

    youtubeStub = sinon.stub(youtubeService, 'querySubscriptions')
    youtubeStub.withArgs(undefined).resolves(response)
    youtubeStub.withArgs('CAUQAA').resolves(nextResponse)
  })

  it('should extract data from youtube api', async function() {
    let extractedData = await youtubeManagerService.getExtractedData(undefined)
    
    expect(extractedData.items.length).to.be.equal(4)
    expect(extractedData.items[0].id).to.be.equal('Iy1499R-3VEo6r52o4zsr0PpYz8-Mzk9K3088f3sO5c')
    expect(extractedData.items[0].title).to.be.equal('Joueur Du Grenier')
    expect(extractedData.items[0].url).to.be.equal('https://www.youtube.com/channel/UC_yP2DpIgs5Y1uWC0T03Chw')
    expect(extractedData.items[0].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-2eu-eG4PLa8/AAAAAAAAAAI/AAAAAAAAAAA/FZUzswUhAmI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[1].id).to.be.equal('Iy1499R-3VEo6r52o4zsr2f_ovQj5T0P6T2F8E0NSJI')
    expect(extractedData.items[1].title).to.be.equal('Hygiène Mentale')
    expect(extractedData.items[1].url).to.be.equal('https://www.youtube.com/channel/UCMFcMhePnH4onVHt2-ItPZw')
    expect(extractedData.items[1].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-Mz9kNPFR8hw/AAAAAAAAAAI/AAAAAAAAAAA/kw9K-P_0a0c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[2].id).to.be.equal('MpajmvGNexIkHC8F7y2fiW2VbxcyJWQK6zq0cBLTWjg')
    expect(extractedData.items[2].title).to.be.equal('Kurzgesagt – In a Nutshell')
    expect(extractedData.items[2].url).to.be.equal('https://www.youtube.com/channel/UCsXVk37bltHxD1rDPwtNM8Q')
    expect(extractedData.items[2].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-UwENvFjc4vI/AAAAAAAAAAI/AAAAAAAAAAA/04dXvZ_jl0I/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
    expect(extractedData.items[3].id).to.be.equal('MpajmvGNexIkHC8F7y2fiZkZghpXG4wLKeJAwW0Pwq8')
    expect(extractedData.items[3].title).to.be.equal('Firebase')
    expect(extractedData.items[3].url).to.be.equal('https://www.youtube.com/channel/UCP4bf6IHJJQehibu6ai__cg')
    expect(extractedData.items[3].thumbnail_url).to.be.equal('https://yt3.ggpht.com/-IlfNr4Wok4g/AAAAAAAAAAI/AAAAAAAAAAA/K5Ojjvr8o5s/s88-c-k-no-mo-rj-c0xffffff/photo.jpg')
  })

  xit('should refresh youtube subscriptions', async function() {
  
    await youtubeManagerService.refreshData()  
  })

  afterEach(async function() {
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
