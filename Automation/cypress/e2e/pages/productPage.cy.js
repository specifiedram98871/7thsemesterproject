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
      cy.contains("PRICE").should("be.visible");
      cy.get(".MuiSlider-valueLabel").should("be.visible");
      cy.get(".MuiSlider-valueLabelCircle").should("be.visible");
    });
  });
});