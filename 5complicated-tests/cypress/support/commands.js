// Saját parancs a navigációhoz
Cypress.Commands.add("navigateToSection", (sectionName) => {
  // Megkeresi a linket a szöveg alapján és kattint rá
  cy.contains("a", sectionName)
    .should("be.visible")
    .click();

  // Ellenőrizhetjük, hogy az URL a sectionName-hez kapcsolódik
  cy.location("pathname").then((path) => {
    cy.log("Navigated to:", path);
  });
});

Cypress.Commands.add("fillAndSubmit", (inputSelector, submitSelector, text) => {
  cy.get(inputSelector)
    .should("be.visible")
    .clear()
    .type(text);

  cy.get(submitSelector)
    .should("be.visible")
    .click();
});