export default class SearchResults {

  productContainer() {
    return cy.get('.product-one');
  }

  concreteProduct(name: string) {
    return cy.get(`.product-main:contains("${name}")`);
  }

  addToCartBtn() {
    return cy.get('.add-to-cart-link');
  }

  breadcrumb() {
    return cy.get('.breadcrumb');
  }

}