describe('Posts endpoint API tests - happy path test cases', () => {
  let body;

  before(() => {
    // Load the fixture data
    cy.fixture('postData.json').then((postData) => {
      body = postData;
    })
  });

  it('should create a new post on sending a POST request with valid body and return a 201 status', () => {
    const validPost = body.validPost;

    cy.apiPost('/posts', validPost)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('user_id');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
  });

  it('should create a new post and set id as a variable for DELETE request and return 201', () => {
    const validPost = body.validPost;

    cy.apiPost('/posts', validPost)
      .then((response) => {
        expect(response.status).to.eq(201);
        console.log('Response Body:', response.body);
        cy.log('Response Body:', JSON.stringify(response.body));
        expect(response.body).to.have.property('id');
        const postId = response.body.id;
        Cypress.env('postId', postId);
      });
  });

   it('should delete an exsisting post on sending a DELETE request with a valid post Id and return a 204 status', () => {

    cy.apiDelete(`/posts/${Cypress.env('postId')}`)
      .then((response) => {
        expect(response.status).to.eq(204);
      });
  });

  it('should get exsisting posts on sending a GET request and return a 200 status', () => {

    cy.apiGet('/posts/')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });
});

describe('Posts endpoint API tests - Negative test cases', () => {
  let body;

  before(() => {
    // Load the fixture data
    cy.fixture('postData.json').then((postData) => {
      body = postData;
    })
  });

  it('should return a data validation error 422, on creating a new post using POST with an invalid json body', () => {
    const invalidPost = body.invalidPost;

    cy.apiPost('/posts', invalidPost)
      .then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.an('array');
        response.body.forEach((error) => {
          expect(error).to.have.property('field');
          expect(error).to.have.property('message');
        });
      });
  });

  it('should return a 404 resource not found error on sending a DELETE request for a post that has been deleted', () => {
    cy.apiDelete(`/posts/${Cypress.env('postId')}`)
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message', "Resource not found");
      });
  });

  it('should return 404 0n sending a GET request for a non existent user', () => {

    cy.apiGet('/users/0000000')
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('message');
      });
  });

  it('should return an unathorized 401 response on creating a user using POST with an invalid auth-token', () => {
    const validPost = body.validPost;

    cy.apiPostNoAuth('/posts', validPost)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message', "Authentication failed");
      });
  });

  it('should return an unauthorized 401 response on sending a DELETE request with an invalid auth-token', () => {
    cy.apiDeleteNoAuth(`/posts/${Cypress.env('postId')}`)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message', "Authentication failed");
      });
  });
});
