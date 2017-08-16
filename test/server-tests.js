let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

let TagRepository = require('../server/repositories/TagRepository')
let tagRepository = new TagRepository.TagRepository()

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
        res.should.have.status(200)        
        res.body.should.be.json
        res.body.id.should.be.above(1)
        expect(res.body.title).to.equal('testTtg')
        done()
      })
  })
})
