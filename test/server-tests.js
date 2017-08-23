let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect

let { TagRepository } = require('../server/repositories/TagRepository')
let { SubscriptionRepository } = require('../server/repositories/SubscriptionRepository')

let tagRepository = new TagRepository()
let subscriptionRepository = new SubscriptionRepository()

process.env.NODE_ENV = 'test'
let app = require('../server/app')

chai.use(chaiHttp)

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

  it('should create all tags', function(done) {
    chai.request(app)
      .post('/api/tags/create')
      .send([{
        subscriptionId: 'subscriptionId1',
        tags: ['tag1', 'tag2', 'tag3']
      }])
      .end(function (err, res) {
        if (err !== null) {
          console.log(err.message)
        }
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.headers
        expect(res).to.be.json
        expect(res.body).to.have.lengthOf(3)
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
