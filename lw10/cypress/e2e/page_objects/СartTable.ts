export default class СartTable {

  table() {
    return cy.get('table.table-striped');
  }

  cell(row: number, col: number) {
    return cy.get(`tr:nth-child(${row}) > td:nth-child(${col})`);
  }

  totalPrice() {
    return cy.get('.text-right.cart-sum')
  }

}