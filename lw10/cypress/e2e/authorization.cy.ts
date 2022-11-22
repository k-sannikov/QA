import Main from './page_objects/Main';
import Auth from './page_objects/Auth';
import data from "../fixtures/test_data.json";
import Verification from "./verification/verification";

describe('Магазин', () => {
  const verification: Verification = new Verification();
  const main: Main = new Main();
  const auth: Auth = new Auth();

  it('Авторизация', () => {
    verification.visitSite(data.base_url, 'macbook-13');

    main.topHeader().within(() => {
      main.popUpBtnAccount().click();
      main.popUpBtnLogin().click();
    });

    cy.url().should('eq', data.base_url + data.login_url);

    auth.loginForm().within(() => {
      auth.inputLogin().type(data.user.login);
      auth.inputPassword().type(data.user.password);
      auth.btnSubmit().click();
    });

    cy.url().should('eq', data.base_url + data.login_url);
    cy.contains(data.authorization_message);
  });
});