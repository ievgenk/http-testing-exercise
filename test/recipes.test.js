const chai = require('chai');
const chaiHttp = require('chai-http')
const {
  app,
  closeServer,
  runServer
} = require('../server')

const expect = chai.expect;
chai.use(chaiHttp)


describe('Testing for the Recipes Router', function () {

  before(function () {
    return runServer()
  })
  after(function () {
    return closeServer()
  })

  it('should return all of the recipes when recieve GET call', function () {
    return chai.request(app)
      .get('/recipes')
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.be.json
        expect(response.body).to.be.a('array')
        const expKeys = ['name', 'id', 'ingredients']
        response.body.forEach(item => {
          expect(item).to.be.a('object')
          expect(item).to.have.all.keys(expKeys)
        })
      })
  })

  it('should add a new recipe via POST request', function () {
    const newRecipe = {
      name: 'Cocoa',
      ingredients: ['milk', 'cocoa powder']
    }
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function (response) {
        const expectedProps = ['id', 'name', 'ingredients']
        expect(response).to.have.status(201);
        expect(response).to.be.json;
        expect(response.body).to.be.a('object')
        expect(response.body.id).not.to.be.null;
        expect(response.body).to.have.all.keys(expectedProps)
      })
  })

  it('should modify an existing recipe via PUT request', function () {
    const updatedRecipe = {
      name: 'Matcha-Latte',
      ingredients: ['milk', 'matcha-powder']
    }

    return chai.request(app)
      .get('/recipes')
      .then(function (response) {
        updatedRecipe.id = response.body[0].id
        return chai.request(app)
          .put(`/recipes/${updatedRecipe.id}`)
          .send(updatedRecipe)
      })
      .then(function (response) {
        expect(response).to.have.status(204);
        expect(response.body).to.be.a('object');
      })

    it('should delete a recipe with ID provide when DELETE request sent', function () {
      const itemToDelete = {}
      return chai.request(app)
        .get('/recipes')
        .then(function (response) {
          return chai.request(app)
            .delete(`/recipes/${response.body[0].id}`)
        })
        .then(function (response) {
          expect(response).to.have.status(204);
          expect(response).to.be.json
          expect(response.body).to.be.a('object')
        })
    })
  })



})