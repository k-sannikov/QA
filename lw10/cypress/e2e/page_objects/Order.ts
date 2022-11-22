export default class Order {

  orderForm() {
    return cy.get('form[action="cart/checkout"]');
  } 

  textareaDescription() {
    return cy.get('textarea');
  }

}