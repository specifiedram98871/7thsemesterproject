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
        // it("Verify registered user cannot register again",()=>{
        //    cy.fixture("signedupUser").then((user)={

        //    })
        // })

    })

})