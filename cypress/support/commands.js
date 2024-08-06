//Headers for api requests
Cypress.Commands.add('apiPost', (url, body = {}) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cypress.env('access-token')}`,
  };

  return cy.request({
    method: 'POST',
    url: url,
    body: body,
    headers: headers,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiDelete', (url = {}) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cypress.env('access-token')}`,
  };

  return cy.request({
    method: 'DELETE',
    url: url,
    headers: headers,
    failOnStatusCode: false
  }); 
});

Cypress.Commands.add('apiGet', (url = {}) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cypress.env('access-token')}`,
  };

  return cy.request({
    method: 'GET',
    url: url,
    headers: headers,
    failOnStatusCode: false
  }); 
});

Cypress.Commands.add('apiDeleteNoAuth', (url = {}) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ',
  };

  return cy.request({
    method: 'DELETE',
    url: url,
    headers: headers,
    failOnStatusCode: false
  }); 
});

Cypress.Commands.add('apiPostNoAuth', (url, body = {}) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ',
  };

  return cy.request({
    method: 'POST',
    url: url,
    body: body,
    headers: headers,
    failOnStatusCode: false
  });
});
