import { categories } from "../../support/utils/utils";

describe("Product Page functionality", () => {
  beforeEach(() => {
    cy.mockCommonApis();
    cy.visit("/products");
  });

  context("Top Category Navigation", () => {
    it("TC_CAT_001-004:Verify all category tabs are displayed in the top navigation bar and navigable and dropdown is visible.", () => {
      //only 11 categories are displayed in the top nav bar
      let displayedCategories = categories.slice(0, 11);
      displayedCategories.forEach((category) => {
        cy.contains("a", category).should("be.visible").within(() => {
          cy.get("svg[data-testid='ExpandMoreIcon']").should("be.visible").click();
          cy.url().should("include", `products?category=${encodeURIComponent(category)}`);
        });
      });
    });
  });

  context("Filter Functionality", () => {

    it("TC_CAT_006:Verify Filters panel is displayed on the left side of the category page", () => {
      cy.contains("Filters").should("be.visible");
      cy.contains("clear all").should("be.visible").and("not.be.disabled");
    });

    it("TC_CAT_007-008:Verify [CLEAR ALL] button resets all applied filters.", () => {
      // Apply filters
      cy.get("span").contains("Bakery").click().then(() => {
        cy.contains("Baked bun").should("be.visible");
      });
      cy.contains("clear all").should("be.visible").click();
      cy.contains("Baked bun").should("not.exist");
    });

    it("TC_CAT_009:Verify PRICE filter section is displayed with a range slider", { retries: 2 }, () => {
      cy.contains("PRICE").should("be.visible").parent().within(() => {
        cy.get("input[aria-label='Price range slider']").should("be.visible").and("have.attr", "type", "range");
      });
    });

    // it.only("TC_CAT_010:Verify that adjusting the price range slider updates the product listings accordingly.", () => {
    //   cy.intercept("GET", "products?keyword=&price[gte]=1182&price[lte]=20000&ratings[gte]=0&page=1",
    //     { statusCode: 200,
    //       body: { products: [], productsCount: 0, resultPerPage: 10, filteredProductsCount: 0 }}
    //   ).as("getProducts");
    //   cy.wait('@getProducts').then((interception) => {
    //     expect(interception.request.url).to.include("price[gte]=1182");
    //     expect(interception.request.url).to.include("price[lte]=20000");
    //   });
    //   cy.get("input[type='range']").first().invoke("val", 500).trigger("input").trigger("change");
    // });

    it("TC_CAT_016:Verify CATEGORY filter section displays all category options.", () => {
      cy.contains("Category").should("be.visible");
      categories.forEach((category) => {
        if (category === "Bakery") {
          cy.contains("Baked bun").should("be.visible");
        }
        cy.contains("label", category)
          .scrollIntoView()
          .should("be.visible").click()
      });
      cy.contains("ratings").should("be.visible");
      {
        [4, 3, 2, 1].forEach((rating) => {
          cy.get('input[name="ratings-radio-buttons"]')
            .check(`${rating}`, { force: true });
        })
      };
    });

    it("TC_CAT_020:Verify [CATEGORY] and [RATING] filter section can be collapsed and expanded using the arrow icon.", () => {
      cy.contains("Category").should("be.visible").parent().within(() => {
        cy.get("svg[data-testid='ExpandLessIcon']").should("be.visible").click();
      });
      cy.contains("ratings").should("be.visible").parent().within(() => {
        cy.get("svg[data-testid='ExpandLessIcon']").should("be.visible").click();
      })
    })
    
    it("TC_CAT_021:Verify no products are shown when a category with no products is selected.", () => {
      cy.contains("label", "Grocery Staples")
        .scrollIntoView()
        .should("be.visible").click()
      cy.get("h1").contains("Sorry, no results found!").should("be.visible"); // assertion
      cy.contains("Please check the spelling or try searching for something else").should("be.visible");
    });

    it("TC_CAT_022:Verify RATINGS filter section displays all rating options and can be selected.", () => {
      [4, 3, 2, 1].forEach((rating) => {
        cy.get(`input[name="ratings-radio-buttons"][value="${rating}"]`)
          .check({ force: true }).then(() => {
            cy.get(`input[name="ratings-radio-buttons"][value="${rating}"]`).should("be.checked");
            cy.contains("Please check the spelling or try searching for something else").should("be.visible");
          });
      })
    });

    it("TC_CAT_026: Verify only one rating option can be selected at a time.", () => {
      [4, 3, 2, 1].forEach((rating) => {
        cy.get(`input[name="ratings-radio-buttons"][value="${rating}"]`)
          .check({ force: true }).then(() => {
            cy.get(`input[name="ratings-radio-buttons"][value="${rating}"]`).should("be.checked");
            // Verify that all other rating options are unchecked
            [4, 3, 2, 1].filter(r => r !== rating).forEach(otherRating => {
              cy.get(`input[name="ratings-radio-buttons"][value="${otherRating}"]`).should("not.be.checked");
            });
          });
      });
    });
  });
});