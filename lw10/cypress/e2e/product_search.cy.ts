import Home from "./page_objects/Main";
import SearchResults from "./page_objects/SearchResults";
import data from "../fixtures/test_data.json";
import Verification from "./verification/verification";

describe('Магазин', () => {

  const verification: Verification = new Verification();
  const home: Home = new Home();
  const searchResults: SearchResults = new SearchResults();

  it('Поиск товара', () => {
    verification.visitSite(data.base_url, 'macbook-13');

    home.formSearch().within(() => {
      home.inputSearch().type(data.search_query);
      home.listSearch().contains(data.watch_2.name).click();
    });

    cy.url().should('eq', data.base_url + data.search_casio_mq_24_7bul_url);

    searchResults.breadcrumb().contains(data.search_notification_watch_2);

    home.bottomHeader().within(() => {
      home.popUpBtnMen().click();
    });

    cy.url().should('eq', data.base_url + data.category_men_url);

    cy.scrollTo(0, 350, { duration: 100 });

    searchResults.productContainer().contains(data.watch_3.name);

  });
});