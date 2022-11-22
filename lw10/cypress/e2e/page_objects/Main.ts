export default class Main {

  topHeader() {
    return cy.get('.top-header');
  }

  bottomHeader() {
    return cy.get('.header-bottom');
  }

  popUpBtnAccount() {
    return cy.get('a').contains('Account');
  }

  popUpBtnLogin() {
    return cy.get('.dropdown-menu').contains('Вход');
  }

  popUpBtnMen() {
    return cy.get('.menu-dropdown-icon').contains('Men');
  }

  popUpBodyMen() {
    return this.popUpBtnMen().next();
  }

  popUpBtnCasio() {
    return this.popUpBodyMen().contains('Casio');
  }

  formSearch() {
    return cy.get('form[action="search"]');
  }

  inputSearch() {
    return cy.get('input#typeahead');
  }

  listSearch() {
    return cy.get('.tt-dataset-products');
  }

}