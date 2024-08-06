describe('Users_id_posts endpoint API tests - happy path test cases', () => {
  let body;

  before(() => {
    // Load the fixture data
    cy.fixture('postData.json').then((postData) => {
      body = postData;
    })
  });

  it('should create a new user post on sending a POST request with a valid user id and return a 201 status', () => {
    const userPost = body.userPost;

    cy.apiPost(`/users/${Cypress.env('userId')}/posts`, userPost)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('user_id');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
  });

  it('should get exsisting posts made with a userid by sending a GET request and return a 200 status', () => {

    cy.apiGet(`/users/${Cypress.env('userId')}/posts`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });
});

describe('Users_id_posts endpoint API tests - Negative test cases', () => {
  let body;

  before(() => {
    // Load the fixture data
    cy.fixture('postData.json').then((postData) => {
      body = postData;
    })
  });

  it('should return a data validation error 422, on creating a user post by sending a POST request with an invalid json body', () => {
    const userPostInvalid = body.userPostInvalid;

    cy.apiPost(`/users/${Cypress.env('userId')}/posts`, userPostInvalid)
      .then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.an('array');
        response.body.forEach((error) => {
          expect(error).to.have.property('field');
          expect(error).to.have.property('message');
        });
      });
  });
  
  it('should return 404 or bad request on sending a GET request for post with a nonexistent user id', () => {

    cy.apiGet('/users//posts')
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message');
      });
  });

  //this test was expected to fail but passed. This endpoint can be called with an empty array as id
  it('should return 404 or bad request if user id parameter is an empty object or null', () => {

    cy.apiGet('/users/{}/posts')
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message');
      });
  });

  //this test was expected to fail but passed. This endpoint can be called without an authentication
  it('should return an unauthorized 401 on sending a GET request with an invalid auth-token', () => {

    cy.apiGet(`/users/${Cypress.env('userId')}/posts`)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message');
      });
  });

  it('should return an unathorized 401 response on creating a post with an invalid auth-token', () => {
    const userPost = body.userPost;

    cy.apiPostNoAuth(`/users/${Cypress.env('userId')}/posts`, userPost)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message');
      });
  });
});
