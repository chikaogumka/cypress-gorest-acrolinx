describe('Users endpoint API tests - happy path test cases', () => {
  let usersData;

  before(() => {
    // Load the fixture data
    cy.fixture('userData.json').then((data) => {
      usersData = data;
    })
  });

  it('should create a new user on sending a POST request and return a 201 status', () => {
    const user1 = usersData.user1;

    cy.apiPost('/users', user1)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('gender');
        expect(response.body).to.have.property('status');
      });
  });

  it('should create a new user and set userId as a variable for DELETE request', () => {
    const user2 = usersData.user2;

    cy.apiPost('/users', user2)
      .then((response) => {
        expect(response.status).to.eq(201);
        console.log('Response Body:', response.body);
        cy.log('Response Body:', JSON.stringify(response.body));
        expect(response.body).to.have.property('id');
        const userId = response.body.id;
        Cypress.env('userId', userId);
      });
  });

  it('should delete an exsisting user on sending a DELETE request with a valid user Id and return a 204 status', () => {

    cy.apiDelete(`/users/${Cypress.env('userId')}`)
      .then((response) => {
        expect(response.status).to.eq(204);
      });
  });

  it('should get exsisting users on sending a GET request and return a 200 status', () => {

    cy.apiGet('/users/')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });
});

describe('Users endpoint API tests - Negative test cases', () => {
  let usersData;

  before(() => {
    // Load the fixture data
    cy.fixture('userData.json').then((data) => {
      usersData = data;
    })
  });

  it('should return a data validation error 422, on creating a user using POST with an invalid json body', () => {
    const user3 = usersData.user3;

    cy.apiPost('/users', user3)
      .then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.an('array');
        response.body.forEach((error) => {
          expect(error).to.have.property('field');
          expect(error).to.have.property('message');
        });
      });
  });

  it('should return a 404 resource not found error on sending a DELETE request for a resoucre that has been deleted', () => {
    cy.apiDelete(`/users/${Cypress.env('userId')}`)
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
    const user4 = usersData.user4;

    cy.apiPostNoAuth('/users', user4)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message');
      });
  });

  it('should return an unauthorized 401 response on sending a DELETE request with an invalid auth-token', () => {
    cy.apiDeleteNoAuth(`/users/${Cypress.env('userId')}`)
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('message', "Authentication failed");
      });
  });

  it('should not create a duplicate user with the same email using a POST request', () => {
    const user1 = usersData.user1;

    cy.apiPost('/users', user1)
      .then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.have.property('field')
        expect(response.body[0]).to.have.property('message', "has already been taken");
      });
  });
});
