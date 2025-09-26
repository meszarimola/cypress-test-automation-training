/// <reference types="cypress" />

describe("Android Authority Deals – Hook demo (before / after)", () => {
  before(() => {
    // 1) gyors sanity check: az oldal elérhető-e? (nem kötelező, de jó oktatási példa)
    cy.request("/").its("status").should("eq", 200);

    // viewport méretének beállítása
    cy.viewport(1366, 768);
  });

  beforeEach(() => {
    cy.visit("/");
  });

  after(function () {
    //takarítás – hogy a következő suite tiszta állapotból induljon
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("The title of the page is Tech Deals", () => {
    // oldal címének ellenőrzése
    cy.title().should("eq", "Tech Deals");
  });

  it("Clicks on Apps and Software and the URL is correct", () => {
    cy.get('a[href="/collections/apps-software"]').click();

    // Ez a sor azt ellenőrzi, hogy a böngésző éppen azon a domainen van, mint a baseUrl, azaz nem navigált át valamilyen külső oldalra.
    cy.location("origin", { timeout: 10000 }).should(
      "eq",
      new URL(Cypress.config("baseUrl")).origin
    );

    cy.location("pathname", { timeout: 10000 }).should(
      "eq",
      "/collections/apps-software"
    );
  });

  it("Clicks on Apps and Software only if link is visible, and checks the URL", () => {
    cy.get('a[href="/collections/apps-software"]').then(($link) => {
      if ($link.is(":visible")) {
        cy.wrap($link).click();
        // Ellenőrizzük, hogy a domain maradt a baseUrl origin-jén
        cy.location("origin", { timeout: 10000 }).should(
          "eq",
          new URL(Cypress.config("baseUrl")).origin
        );

        // Ellenőrizzük az elvárt útvonalat
        cy.location("pathname", { timeout: 10000 }).should(
          "eq",
          "/collections/apps-software"
        );
      } else {
        cy.log(
          'The "Apps and Software" link is not visible, skipping click'
        );
      }
    });
  });

  it("Clicks on Apps and Software and the title is correct", () => {
    cy.contains("a.chakra-link", "Apps & Software").click();
    // ez itt flaky lesz, mert tartalmazza a September szót
    cy.title().should(
      "eq",
      "Android Authority | Best Category: Apps & Software, Discounts & Sales - September 2025"
    );
  });

  it("Clicks on the Apps and Software and the title is correct dynamically", () => {
    cy.contains('a[href="/collections/apps-software"]', "Apps & Software", {
      matchCase: false,
    }).click();

    // Dinamikus: "Android Authority | Best Category: Apps & Software, Discounts & Sales - <Month> <Year>"
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();
    const expected = `Android Authority | Best Category: Apps & Software, Discounts & Sales - ${month} ${year}`;

    cy.title().should("eq", expected);
    // Ha inkább lazább ellenőrzést szeretnél:
    // cy.title().should('include', 'Android Authority').and('include', 'Apps & Software');
  });
});
