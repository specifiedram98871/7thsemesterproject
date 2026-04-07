describe("Account Page functionality", () => {
    context("Account page accessibility without login", () => {

        it("TC_ACC_001:Verify /account page is accessible only to logged-in users.", () => {
            cy.visit("/account");
            cy.url().should("include", "/login");
            cy.wait(1000);
            cy.contains(".SnackbarItem-message", "Please Login to Access").should("be.visible");
        })
    })

    context("Account page functionality for logged-in users", () => {
        beforeEach(() => {
            cy.mockCommonApis();
            cy.fixture('login/loginData').then((data) => {
                const { email, password } = data;
                cy.login(email, password);
            });
            cy.visit("/account");
        })

        it("TC_ACC_002:Verify /account page is accessible only to logged-in users.", () => {
            cy.url().should("include", "/account");
            cy.wait(1000);
            cy.contains("Personal Information").should("be.visible");
        })

        it("TC_ACC_003:Verify user profile avatar/icon is displayed in the sidebar.", () => {
            cy.get("img[alt='Avatar']").should("be.visible");
        })

        it("TC_ACC_005:Verify [MY ORDERS] menu item navigates to the orders page.", () => {
            cy.contains("MY ORDERS").click();
            cy.url().should("include", "/orders");
        })

        it("TC_ACC_006:Verify [MY WISHLIST] menu item navigates to the wishlist page.", () => {
            cy.contains("My Wishlist").click();
            cy.url().should("include", "/wishlist");
        })

        it("TC_ACC_010:Verify [Logout] button logs the user out and redirects to login or home page.", () => {
            cy.contains("Logout").click();
            cy.url().should("not.include", "/account");
            cy.url().should("include", "/login");
        })

        it("TC_ACC_011:Verify [Logout] clears the user session and prevents access to /account.", () => {
            cy.contains("Logout").click();
            cy.url().should("not.include", "/account");
        })

        it("TC_ACC_012:Verify Personal Information section is displayed on the account page.", () => {
            cy.contains("Personal Information").should("be.visible");
            cy.contains("First Name").should("be.visible");
            cy.contains("Last Name").should("be.visible");
            //gender is pre-selected
            cy.get("input[id=male]").should("be.checked");
            cy.contains("Email Address").should("be.visible");
        })

        it("TC_ACC_017:Verify [Edit] button is displayed next to Personal Information heading and clickable.", () => {
            cy.contains("Personal Information").should("be.visible");
            cy.contains("Edit").should("be.visible").click();
            cy.url().should("include", "/account/update");
        })
    })
})