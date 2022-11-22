export default class Verification {

  visitSite(url: string, device: any) {
    cy.visit(url);
    cy.url().should('eq', url);
    cy.viewport(device);
  }

}