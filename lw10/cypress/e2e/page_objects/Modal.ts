export default class Modal {

  modalMain() {
    return cy.get('.modal-content');
  }

  modalFooter() {
    return cy.get('.modal-footer')
  }

  executeOrderBtn() {
    return cy.get('[type="button"]').contains('Оформить заказ')
  }

}