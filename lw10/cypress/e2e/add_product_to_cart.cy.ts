import Modal from "./page_objects/Modal";
import SearchResults from "./page_objects/SearchResults";
import СartTable from "./page_objects/СartTable";
import data from "../fixtures/test_data.json";
import Verification from "./verification/verification";

describe('Магазин', () => {
  const verification: Verification = new Verification();
  const searchResults: SearchResults = new SearchResults();
  const modal: Modal = new Modal();
  const table: СartTable = new СartTable();

  it('Добавление товара в корзину', () => {
    verification.visitSite(data.base_url, 'macbook-13');

    cy.scrollTo('center', { duration: 100 });

    searchResults.productContainer().within(() => {
      searchResults.concreteProduct(data.watch_1.name).within(() => {
        searchResults.addToCartBtn().click();
      });
    });

    modal.modalMain().within(() => {
      table.cell(1, 2).contains(data.watch_1.name);
      table.cell(1, 4).contains(data.watch_1.price);
      table.totalPrice().contains(data.watch_1.price);
      modal.modalFooter().within(() => {
        modal.executeOrderBtn().click();
      });
    });

    cy.url().should('eq', data.base_url + data.cart_url);

    table.table().within(() => {
      table.cell(1, 2).contains(data.watch_1.name);
      table.cell(1, 4).contains(data.watch_1.price);
      table.totalPrice().contains(data.watch_1.price);
    });

  });
});