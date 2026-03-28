describe("Admin Dashboard", () => {

  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  context("UI Flow to Admin Dashboard", () => {
    
    it("TC_ADM_001:Verify that admin can successfully log in and access the dashboard.", () => {
      cy.visit("/");
      cy.contains("admin").should("be.visible").click();
      cy.contains("Admin Dashboard").should("be.visible").click();
      cy.url().should("include", "/admin/dashboard");
      cy.contains("admin").should("be.visible").click();
      cy.get('h4').contains("Total Sales").should("be.visible");
    });
  });
});