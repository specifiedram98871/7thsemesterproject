import { catNav } from "../../support/utils/utils";

describe('Home Page Functionality - ShopEase', { retries: 2 }, () => {
    // let testUser;
    // before(() => {
    //     cy.fixture("login/loginData").then((data) => {
    //         testUser = data
    //         // cy.login(testUser.email, testUser.password);
    //     })
    // })

    beforeEach(() => {
        cy.visit('/login');
        cy.get('a[href="/"]').click();
    });
    context("Header functionality", () => {
        beforeEach(() => {
            cy.getMe();
            cy.mockCommonApis();
        })
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
    })

    context("Category Navigation", () => {
        beforeEach(() => {
            cy.mockCommonApis();
            cy.getMe();
        })
        it('TC_HOME_014:Verify all category icons are displayed on the Home page', () => {
            cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
                catNav.forEach((category) => {
                    cy.contains(category.name).should('be.visible');
                    cy.get(`img[alt="${(category.name)}"]`).should('exist');
                });
            });

        })

        it('TC_HOME_015-022:Verify all category links are navigable', () => {
            cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
                cy.wrap(catNav).each((category) => {
                    cy.contains(category.name).click();
                    cy.url().should('include', `/products?category=${encodeURIComponent(category.name)}`);
                    cy.visit('/');// navigate back home
                });
            })
        })

        it('TC_HOME_023:Verify all category icons load with correct images and labels', () => {
            cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
                cy.wrap(catNav).each((category) => {
                    cy.get(`a[href="/products?category=${category.name}"]`).within(() => {
                        cy.get(`img[alt="${category.name}"]`)
                            .should('be.visible')
                            .and($img => {
                                const src = $img.attr('src');
                                expect(src).to.include(category.icon);
                            })
                        cy.get('span')
                            .should('be.visible')
                            .and('have.text', category.name);
                    });
                    cy.visit('/');
                });
            })
        })

        it('TC_HOME_024-28:Verify the promotional banner is displayed on the Home page and autoslides and [<] [>] buttons are are clickable and present', () => {
            cy.get('section').find('.slick-slider').should('be.visible')

            // 2. Check at least one visible slide image
            cy.get('.slick-slide.slick-active img')
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', 'sale')

            // 3. Verify navigation buttons exist
            cy.get('.slick-prev').should('be.visible')
            cy.get('.slick-next').should('be.visible')

            // 4. Capture current slide index
            cy.get('.slick-current')
                .invoke('attr', 'data-index')
                .then((initialIndex) => {

                    // 5. Wait for autoslide (adjust timing if needed)
                    cy.wait(3000)

                    // 6. Verify slide changed
                    cy.get('.slick-current')
                        .invoke('attr', 'data-index')
                        .should('not.eq', initialIndex)
                })

            // 7. Test NEXT button
            cy.get('.slick-current')
                .invoke('attr', 'data-index')
                .then((currentIndex) => {
                    cy.get('.slick-next').first().click()

                    cy.get('.slick-current')
                        .invoke('attr', 'data-index')
                        .should('not.eq', currentIndex)
                })

            // 8. Test PREV button
            cy.get('.slick-current')
                .invoke('attr', 'data-index')
                .then((currentIndex) => {
                    cy.get('.slick-prev').first().click()

                    cy.get('.slick-current')
                        .invoke('attr', 'data-index')
                        .should('not.eq', currentIndex)
                })
        })
    })

    context("Top Brands Section", () => {
        beforeEach(() => {
            cy.mockCommonApis();
            cy.getMe();
        })
        it('TC_HOME_029:Verify Top Brands section is displayed on the Home page', () => {
            cy.contains('h1', 'Top Brands').should('be.visible');
        })

        it('TC_HOME_030:Verify [VIEW ALL] button in Top Brands section is clickable', () => {
            cy.contains('h1', 'Top Brands').should('be.visible');
            cy.get('a[href="/products?category=Top Brands, Best Price"]').click();
            cy.url().then((url) => {
                const decodedUrl = decodeURIComponent(url);
                expect(decodedUrl).to.include('/products?category=Top Brands, Best Price');
            });
        })
    })

})