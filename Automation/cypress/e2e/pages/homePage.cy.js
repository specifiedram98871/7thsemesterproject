import { catNav } from "../../support/utils/utils";

describe('Home Page Functionality - ShopEase', () => {
    let testUser;
    before(() => {
        cy.fixture("login/loginData").then((data) => {
            testUser = data
            cy.login(testUser.email, testUser.password);
        })
    })
    beforeEach(() => {
        cy.visit('/');
    });

    it('TC_HOME_004:Verify [Login] button navigates to the Login page.', () => {
        cy.get('a[href="/login"]').click();
        cy.url().should('include', '/login');
    });

    it('TC_HOME_007:Verify clicking Cart icon navigates to the Cart page', () => {
        cy.get('a[href="/cart"]').click();
        cy.url().should('include', '/cart');
    })

    it('TC_HOME_009:Verify search returns results for a valid product keyword', () => {
        const keyword = "Baked bun";
        cy.get('input[placeholder="Search for products, brands and more"]').type(keyword);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', `/products/${encodeURIComponent(keyword)}`);
        cy.get('h2').contains(keyword).should('be.visible');
    })

    it('TC_HOME_011:Verify search with a keyword that has no matching products', () => {
        const keyword = "NonExistingProduct";
        cy.get('input[placeholder="Search for products, brands and more"]').type(keyword);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', `/products/${keyword}`);
        cy.contains('Sorry, no results found!').should('be.visible');
        cy.contains('Please check the spelling or try searching for something else').should('be.visible');
    })

    it('TC_HOME_014:Verify all category icons are displayed on the Home page', () => {
        cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
            catNav.forEach((category) => {
                cy.contains(category).should('be.visible');
                cy.get(`img[alt="${(category)}"]`).should('exist');
            });
        });

    })

    it('TC_HOME_015-022:Verify all category links are navigable', () => {
        cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
            cy.wrap(catNav).each((category) => {
                cy.contains(category).click();
                cy.url().should('include', `/products?category=${encodeURIComponent(category)}`);
                cy.visit('/');// navigate back home
            });
        })
    })
})