describe("Android Authority Deals - User Journey Tests", () => {
  it("comprehensive user journey test for deals website", () => {
    // Initial setup and homepage load
    cy.viewport(1280, 720);
    cy.visit("https://deals.androidauthority.com", {
      failOnStatusCode: false,
      timeout: 30000
    });
    cy.get("body", { timeout: 20000 }).should("exist").and("be.visible");
    cy.wait(1000);

    // Verify homepage basic elements
    cy.get('img[alt*="Android Authority"], img[alt*="Logo"], [class*="logo"]', { timeout: 10000 })
      .should("exist")
      .and("have.attr", "src");

    cy.get('header, nav, main, [role="main"], [class*="header"], [class*="nav"]')
      .should("have.length.greaterThan", 0);

    // Check page title
    cy.title().should("not.be.empty");
    cy.title().then((title) => {
      expect(title.toLowerCase()).to.satisfy((str) => {
        return str.includes("deals") || str.includes("android") || str.includes("authority");
      });
    });

    // Navigation elements test
    cy.get('a[href]', { timeout: 5000 }).should("have.length.greaterThan", 0);

    // Search functionality test
    cy.get("input").then(($inputs) => {
      if ($inputs.length > 0) {
        cy.wrap($inputs.first())
          .should("be.visible")
          .type("test", { delay: 50 })
          .should("have.value", "test");
      }
    });

    // Deal content verification
    cy.get("img").then(($imgs) => {
      if ($imgs.length > 0) {
        cy.wrap($imgs.first()).should("have.attr", "src");
      }
    });

    // Scrolling functionality
    cy.scrollTo("bottom", { duration: 1000 });
    cy.wait(500);
    cy.scrollTo("top", { duration: 1000 });

    // Responsive behavior testing
    cy.viewport(375, 667);
    cy.wait(500);
    cy.get("body").should("be.visible");

    cy.viewport(768, 1024);
    cy.wait(500);
    cy.get("body").should("be.visible");

    cy.viewport(1280, 720);
    cy.wait(500);
    cy.get("body").should("be.visible");

    // User interaction elements
    cy.get("a, button").then(($clickable) => {
      if ($clickable.length > 0) {
        cy.wrap($clickable.first())
          .trigger("mouseover")
          .should("be.visible")
          .trigger("mouseout");
      }
    });

    // Final URL validation
    cy.url().should("include", "deals.androidauthority.com");
  });
});