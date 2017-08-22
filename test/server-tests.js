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
      await subscriptionRepository.truncate()
      let subscription = await subscriptionRepository.create(
        {
          'id': 'mySub',
          'title': 'mon titre d\'abonnement',
          'url': 'http://www.totosubscription.com',
          'thumbnail_url': 'http://thumbnail.com'
        }
      )

      await tagRepository.truncate()
      let tag = await tagRepository.create('myTag') 

      await subscription.addTag(tag)
    } catch (error) {
      console.log(error.message)
    }
  })

  it('should give 404 with bad url', function(done) {
    chai.request(app)
      .get('/toto')
      .end((err, res) => {
        expect(res).to.have.status(404)
        done()
      })
  })


  /*it('should create tag', function(done) {
    chai.request(app)      
      .post('/api/tags/create')
      .set('Content-Type', 'application/json')
      .send({ "title": "testTag" })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.have.headers        
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.id).to.be.above(0)
        
        done()
      })
  })*/
})
