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
  let response = readJson('./server/subs.json')
  
  beforeEach(function() {
    youtubeStub = sinon.stub(youtubeService, 'querySubscriptions')
    youtubeStub.withArgs(undefined).resolves(response)
  })

  it('should extract data from youtube api', async function() {
    let extractedData = await youtubeManagerService.getExtractedData(response.nextPageToken)
    
    expect(extractedData.items.length).to.be.equal(5)
    expect(extractedData.nextPage).to.be.equal(response.nextPageToken)
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
