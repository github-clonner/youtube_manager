let models = require('../server/models')
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

let TagRepository = require('../server/repositories/TagRepository')
let tagRepository = new TagRepository.TagRepository()

let server = require('../server/bin/www')

chai.use(chaiHttp)

describe('Test API', function() {
  before(() => {
    models.sequelize.sync()
  })

  beforeEach(function() {
    tagRepository.truncate()
  })

  it('should create tag', function(done) {
    chai.request(server)
      .post('/api/tags/create')
      .send({ "title": "testTag" })
      .end((err, res) => {
        res.should.have.status(200)        
        res.body.should.be.xml
        res.body.id.should.be.above(1)
        expect(res.body.title).to.equal('testTtg')
        done()
      })
  })
})
