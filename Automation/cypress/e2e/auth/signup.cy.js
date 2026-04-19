import { generateRandomEmail } from "../../support/utils/utils";

describe("Registration functionality", () => {
    before(() => {
        cy.visit("/login");
    })

    it("Verify click on [New to ShopEase?Create an account] link redirect user to register page ", () => {
        cy.get('a[href="/register"]').click();
        cy.url().should("include", "/register");
        cy.get('h1').should("have.text", "Looks like you're new here!");
    })

    context("On Register page", () => {
        beforeEach(() => {
            cy.visit("/register");
        })

        it("Verify default submit does not register user", () => {
            cy.get('.bg-primary-buttonGreen').click();
            cy.url().should("include", "/register");
            cy.get('h1').should("have.text", "Looks like you're new here!");
        })

        it("Verify registered user cannot register again", () => {
            cy.fixture("signup/signedupUser").then((user) => {
                cy.get('input[name="name"]').type("TestUser");
                cy.get('input[name="email"]').type(user.email);
                cy.get('input[name="password"]').type(user.password);
                cy.get('input[name="cpassword"]').type(user.password);
                cy.get('input[name="gender"][value = "male"]').check().should('be.checked');
                cy.get('input[name="avatar"]').selectFile('assets/test.jpg', { force: true });
                cy.get('button[type="submit"]').contains('Signup').click();
                cy.get('#notistack-snackbar').should('have.text', 'Duplicate email entered');  
            })
        })

        it("Verify password length must be 8 character in length", ()=>{
            cy.fixture("signup/signedupUser").then((user) => {
                cy.get('input[name="name"]').type("TestUser");
                cy.get('input[name="email"]').type(user.email);
                cy.get('input[name="gender"][value = "male"]').check().should('be.checked');
                cy.get('input[name="password"]').type("user");
                cy.get('input[name="cpassword"]').type("user");
                cy.get('button[type="submit"]').contains('Signup').click();
                cy.get('#notistack-snackbar').should('have.text', 'Password length must be atleast 8 characters'); 
            })
        })

        it("Verify user must select avatar for registration", ()=>{
            cy.fixture("signup/signedupUser").then((user) => {
                cy.get('input[name="name"]').type("TestUser");
                cy.get('input[name="email"]').type(user.email);
                cy.get('input[name="gender"][value = "male"]').check().should('be.checked');
                cy.get('input[name="password"]').type(user.password);
                cy.get('input[name="cpassword"]').type(user.password);
                cy.get('button[type="submit"]').contains('Signup').click();
                cy.get('#notistack-snackbar').should('have.text', 'Select Avatar'); 
            })
        })

        it("Verify valid and unique email can be registered", () => {
            cy.fixture("signup/signedupUser").then((user) => {
                cy.get('input[name="name"]').type("TestUser");
                cy.get('input[name="email"]').type(generateRandomEmail());
                cy.get('input[name="password"]').type(user.password);
                cy.get('input[name="cpassword"]').type(user.password);
                cy.get('input[name="gender"][value = "male"]').check().should('be.checked');
                cy.get('input[name="avatar"]').selectFile('assets/test.jpg', { force: true });
                cy.get('button[type="submit"]').contains('Signup').click();
                cy.url().should("include", Cypress.env('frontendUrl'));  
            })
        })
    })

})