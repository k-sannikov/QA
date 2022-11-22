export default class Auth {

  loginForm() {
    return cy.get('form#login');
  }

  inputLogin() {
    return cy.get('input#login');
  }

  inputPassword() {
    return cy.get('input#pasword');
  }

  inputName() {
    return cy.get('input#name');
  }

  inputEmail() {
    return cy.get('input#email');
  }

  inputAddress() {
    return cy.get('input#address');
  }

  btnSubmit() {
    return cy.get('button[type=submit]');
  }

}