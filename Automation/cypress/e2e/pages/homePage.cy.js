import { catNav, offerProducts } from "../../support/utils/utils";

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

        // it('TC_HOME_015-022:Verify all category links are navigable', () => {
        //     cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
        //         cy.wrap(catNav).each((category) => {
        //             cy.contains(category.name).click();
        //             cy.url().should('include', `/products?category=${encodeURIComponent(category.name)}`);
        //             cy.visit('/');// navigate back home
        //         });
        //     })
        // })

        // it('TC_HOME_023:Verify all category icons load with correct images and labels', () => {
        //     cy.get('div.flex.items-center.justify-between.mt-4').within(() => {
        //         cy.wrap(catNav).each((category) => {
        //             cy.get(`a[href="/products?category=${category.name}"]`).within(() => {
        //                 cy.get(`img[alt="${category.name}"]`)
        //                     .should('be.visible')
        //                     .and($img => {
        //                         const src = $img.attr('src');
        //                         expect(src).to.include(category.icon);
        //                     })
        //                 cy.get('span')
        //                     .should('be.visible')
        //                     .and('have.text', category.name);
        //             });
        //             cy.visit('/');
        //         });
        //     })
        // })

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

        it('TC_HOME_035:Verify Home page title and favicon are correct', () => {
            cy.title().should('eq', 'Welcome To ShopEase');
            cy.get('img[alt="ShopEase Logo"]').should('have.attr', 'alt', 'ShopEase Logo');
        })
    })

    context("Login State", () => {
        beforeEach(() => {
            cy.mockCommonApis();
            cy.visit('/login');
            cy.fixture("login/loginData").then((data) => {
                cy.GUIlogin(data.email, data.password);
            });
        })

        it('TC_HOME_036:Verify [Login] button is replaced with user profile info after login', () => {
            cy.get('a[href="/login"]').should('not.exist');
            cy.get('a[href="/account"]').should('be.visible');
        })

        // it('TC_HOME_037:Verify cart item count resets to zero for a new guest session', () => {
        //     cy.reload()
        //     cy.get('a[href="/cart"]').click();
        //     cy.url().should('include', '/cart');
        //     cy.contains('Your cart is empty').should('be.visible');
        //     cy.visit('/');
        // })

    })

    context("Deals Carousel", () => {
        beforeEach(() => {
            cy.mockCommonApis();
        })

        it("TC_HOME_038:Verify Deals carousel section is displayed on scroll.", () => {
            cy.contains('Top Brands, Best Price')
                .scrollIntoView()
                .should('be.visible');
        })

        it("TC_HOME_039:Verify all deal cards display product image, category name, discount label, and action text.", () => {
            cy.contains('Top Brands, Best Price')
                .scrollIntoView();
            cy.get('.slick-slide.slick-active')
                .should('have.length.greaterThan', 0)
                .each(($card) => {

                    cy.wrap($card)
                    // Image 
                    cy.wrap($card)
                        .find('img')
                        .should('exist')
                        .and('have.attr', 'src');

                    // Title
                    cy.get('h2')
                        .should('exist')
                        .and('not.be.empty');

                    // Offer

                    cy.get('.text-primary-green')
                        .should('exist');

                    // Text
                    cy.get('.text-gray-500')
                        .should('exist');
                });

        });

        it("TC_HOME_040-41:Verify [>] and [<] navigates to respective set of deal cards", () => {

            cy.get('.slick-prev').should('be.visible')
            cy.get('.slick-next').should('be.visible')

            // 4. Capture current slide index
            cy.get('.slick-current').eq(1)
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
                    cy.get('.slick-next').eq(1).click()

                    cy.get('.slick-current')
                        .invoke('attr', 'data-index')
                        .should('not.eq', currentIndex)
                })

            // 8. Test PREV button
            cy.get('.slick-current')
                .invoke('attr', 'data-index')
                .then((currentIndex) => {
                    cy.get('.slick-prev').eq(1).click()

                    cy.get('.slick-current')
                        .invoke('attr', 'data-index')
                        .should('not.eq', currentIndex)
                })
        })

        it("TC_HOME_042:Verify clicking on a deal card navigates to the correct product detail page", () => {
            cy.get('.slick-slide.slick-active').eq(1).within(() => {
                cy.get('a').first().click();
            })
            cy.url().should('include', '/products');
        })

    })
    context("Suggestion Section", () => {
        beforeEach(() => {
            cy.mockCommonApis();
        })

        it("TC_HOME_046:Verify Suggested for You section is displayed on Home page scroll and [VIEW ALL] button navigates to product page.", () => {
            cy.contains('Suggested for You')
                .scrollIntoView()
                .should('be.visible');
            cy.contains('Based on Your Activity').should('be.visible');
            cy.contains('view all')
                .parent()
                .find('a')
                .click();
            cy.url().should('include', '/products');
        })

        // it("TC_HOME_049:Verify Suggested for You section shows login prompt for guest users.", () => {
        //     cy.visit('/'); // Ensure we're on the home page
        //     cy.contains('Suggested for You')
        //         .scrollIntoView()
        //         .should('be.visible');
        //     cy.contains('Login to get recommendations').should('be.visible');

        // })

    })

    context("Footer Section", () => {
        let footerLinks;
        before(() => {
            cy.fixture('homePage/footerLinks').then((links) => {
                footerLinks = links;
            })
        })
        beforeEach(() => {
            cy.mockCommonApis();
        })

        it("TC_HOME_058:Verify Footer ABOUT section is displayed at the bottom of the Home page", () => {
            it('Verify footer is displayed at the bottom of the Home page', () => {
                cy.get('footer').should('be.visible');
                cy.get('footer').scrollIntoView();
            });
        })

        // it("TC_HOME_059-71:Verify each link in footer navigates to the correct page", () => {
        //     cy.get('footer').within(() => {
        //         footerLinks.forEach((link) => {
        //             cy.contains(link.label)
        //                 .should('be.visible')
        //                 .and('have.attr', 'href', link.link)
        //                 .click();
        //             cy.url().should('include', link.link);
        //             cy.visit('/');
        //         });
        //     });
        // })

        it("TC_HOME_072:Verify copyright text is displayed correctly in the footer.", () => {
            cy.contains('© 2020-2026 ShopEase.com')
                .should('be.visible');
        })

        it("TC_HOME_073:Verify copyright year is current and not outdated.", () => {
            const currentYear = new Date().getFullYear();
            cy.contains(`© 2020-${currentYear} ShopEase.com`)
                .should('be.visible');
        })

    })

})