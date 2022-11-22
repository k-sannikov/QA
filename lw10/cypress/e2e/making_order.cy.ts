import Home from "./page_objects/Main";
import Auth from "./page_objects/Auth";
import Modal from "./page_objects/Modal";
import SearchResults from "./page_objects/SearchResults";
import СartTable from "./page_objects/СartTable";
import Order from "./page_objects/Order";
import data from "../fixtures/test_data.json";
import Verification from "./verification/verification";

describe('Магазин', () => {

  const verification: Verification = new Verification();
  const home: Home = new Home();
  const searchResults: SearchResults = new SearchResults();
  const modal: Modal = new Modal();
  const table: СartTable = new СartTable();
  const auth: Auth = new Auth();
  const order: Order = new Order();
  const login:string = Date.now().toString();

  it('Оформление заказа', () => {
    verification.visitSite(data.base_url, 'macbook-13');

    home.bottomHeader().within(() => {
      home.popUpBodyMen().invoke('show');
      home.popUpBtnCasio().click();
    });

    cy.url().should('eq', data.base_url + data.category_casio_url);

    searchResults.productContainer().within(() => {
      searchResults.concreteProduct(data.watch_2.name).within(() => {
        searchResults.addToCartBtn().click();
      });
    });

    modal.modalMain().within(() => {
      table.cell(1, 2).contains(data.watch_2.name);
      table.cell(1, 4).contains(data.watch_2.price);
      table.totalPrice().contains(data.watch_2.price);
      modal.modalFooter().within(() => {
        modal.executeOrderBtn().click();
      });
    });

    cy.url().should('eq', data.base_url + data.cart_url);

    table.table().within(() => {
      table.cell(1, 2).contains(data.watch_2.name);
      table.cell(1, 4).contains(data.watch_2.price);
      table.totalPrice().contains(data.watch_2.price);
    });

    cy.scrollTo('center', { duration: 100 })

    order.orderForm().within(() => {
      auth.inputLogin().type(login);
      auth.inputPassword().type(data.new_user.password);
      auth.inputName().type(data.new_user.name);
      auth.inputEmail().type(`${login}@mail.com`);
      auth.inputAddress().type(data.new_user.address);
      order.textareaDescription().type(data.new_user.description);
      auth.btnSubmit().click();
    });

    cy.contains(data.order_message);
  });
});