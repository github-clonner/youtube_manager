let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let chaiFs = require('chai-fs')
let expect = chai.expect


let { TagRepository } = require('../server/repositories/TagRepository')
let { SubscriptionRepository } = require('../server/repositories/SubscriptionRepository')

let tagRepository = new TagRepository()
let subscriptionRepository = new SubscriptionRepository()

process.env.NODE_ENV = 'test'
let app = require('../server/app')

chai.use(chaiFs)
chai.use(chaiHttp)


let data = null



describe('Test API', function() {
  before(async () => {
    return await models.sequelize.sync()
  })

  beforeEach(async () => {
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

  afterEach(async () => {
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

  it('should give 404 with bad url', function(done) {
    chai.request(app)
      .get('/bad_url')
      .end(function (err, res) {
        expect(err).to.not.null
        expect(res).to.have.status(404)
        done()
      })
  })
})

describe('Test services', function() {
  
    it('should extract data from json', function(done) {
      expect('./server/subs.json').to.not.have.headers
      expect('./server/subs.json').to.be.a.file().with.json
    })
  })
