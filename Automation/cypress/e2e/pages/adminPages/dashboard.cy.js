import { adminLabels } from "../../../support/utils/utils";

describe("Admin Dashboard", () => {

  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  context("UI Flow to Admin Dashboard", () => {

    beforeEach(() => {
      cy.visit("/account");
      cy.contains("admin").should("be.visible").click();
      cy.contains("Admin Dashboard").should("be.visible").click();
    });

    it("TC_ADM_001:Verify that admin can successfully log in and access the dashboard.", () => {
      cy.contains("Admin Dashboard").should("be.visible").click();
      cy.url().should("include", "/admin/dashboard");
      cy.contains("admin").should("be.visible").click();
      cy.get('h4').contains("Total Sales").should("be.visible");
    });

    it.only("TC_ADM_002:Verify that the dashboard displays accurate sales data and order statistics.", () => {
      adminLabels.forEach(label => {
        cy.contains(label).should("be.visible").and("not.be.disabled");
      });
    });
  });
});