import "cypress-real-events";

describe('Login Functionality - ShopEase', () => {
  let testUser;
  before(() => {
    cy.fixture("login/loginData").then((data)=>{
      testUser = data
    })
  })
  beforeEach(() => {
    cy.visit('/login');
  });

  context('Positive Scenarios', () => {
    it('POS_01: Should login successfully with valid credentials', () => {
      // Intercept the API call to verify backend communication
      cy.intercept('POST', '**/api/v1/login').as('loginRequest');

      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.contains('button', 'Login').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 201);
      cy.url().should('include', '/account');
    });

    it('POS_04: Should navigate through form using Tab key', () => {
      cy.get('#email').focus().realPress('Tab'); 
      cy.focused().should('have.attr', 'id', 'password');
    });
  });

  context('Negative Scenarios', () => {
    it('NEG_01: Should show validation error on empty submission', () => {
      cy.contains('button', 'Login').click();
      
      cy.get('#email').then(($el) => {
        expect($el[0].checkValidity()).to.be.false;
        expect($el[0].validationMessage).to.not.be.empty;
      });
    });

    it('NEG_02: Should show error for invalid email format', () => {
      cy.get('#email').type(testUser.invalidEmail);
      cy.get('#password').type(testUser.invalidPassword);
      cy.contains('button', 'Login').click();
      
      cy.get('#email:invalid').should('have.length', 1);
    });

    it('NEG_03: Should handle unauthorized access (401)', () => {
      // Mocking a failed response to test UI resilience
      cy.intercept('POST', '**/api/v1/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('failedLogin');

      cy.get('#email').type(testUser.wrongEmail);
      cy.get('#password').type(testUser.password);
      cy.contains('button', 'Login').click();

      cy.wait('@failedLogin');
      cy.contains('Invalid credentials').should('be.visible');
    });
  });

  context('Security & Links', () => {
    it('Should verify Legal Links are functional', () => {
      cy.contains('Terms of Use')
        .should('have.attr', 'href')
        .and('include', '/pages/terms');
      
      cy.contains('Privacy Policy')
        .should('have.attr', 'href')
        .and('include', '/pages/privacypolicy');
    });
  });
});