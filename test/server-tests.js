let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect

let { TagRepository } = require('../server/repositories/TagRepository')
let tagRepository = new TagRepository()

process.env.NODE_ENV = 'test'
let app = require('../server/app')

chai.use(chaiHttp)

describe('Test API', function() {
  beforeEach(() => {
    return models.sequelize.sync()
  })

  it('should create tag', function(done) {
    chai.request(app)      
      .post('/api/tags/create')
      .set('Content-Type', 'application/json')
      .send({ "title": "testTag" })
      .end((err, res) => {
        expect(res).to.status(200)
        expect(res).to.have.headers        
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.id).to.be.above(0)
        
        done()
      })
  })
})
