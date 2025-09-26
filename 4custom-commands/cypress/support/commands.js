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

// Custom commands for Sample Application Lifecycle page
Cypress.Commands.add("navigateToSampleApp", () => {
  cy.visit("/sample-application-lifecycle-sprint-1/");
  cy.url().should("include", "sample-application-lifecycle-sprint-1");
});

Cypress.Commands.add("fillFirstName", (firstName) => {
  cy.get('input[name="firstname"]')
    .should("be.visible")
    .clear()
    .type(firstName);
});

Cypress.Commands.add("submitForm", () => {
  cy.get('#submitForm')
    .should("be.visible")
    .click();
});

Cypress.Commands.add("fillAndSubmitForm", (firstName) => {
  cy.fillFirstName(firstName);
  cy.submitForm();
  cy.url().should("include", `firstname=${encodeURIComponent(firstName)}`);
});

Cypress.Commands.add("verifyFormSubmission", (expectedFirstName) => {
  cy.url().should("include", `firstname=${encodeURIComponent(expectedFirstName)}`);
  cy.contains("Form submitted successfully").should("be.visible");
});

Cypress.Commands.add("navigateToNextSprint", () => {
  cy.contains("a", "Go to next sprint")
    .should("be.visible")
    .click();
});

Cypress.Commands.add("checkSocialMediaLinks", () => {
  const socialPlatforms = ["LinkedIn", "Twitter", "Facebook", "Instagram", "YouTube"];

  socialPlatforms.forEach(platform => {
    cy.get(`[aria-label*="${platform}"], [title*="${platform}"], [href*="${platform.toLowerCase()}"]`)
      .should("exist")
      .and("have.attr", "href")
      .and("not.be.empty");
  });
});

Cypress.Commands.add("openMobileMenu", () => {
  cy.viewport("iphone-6");
  cy.get('[data-testid="mobile-menu-toggle"], .mobile-menu-toggle, .hamburger')
    .should("be.visible")
    .click();
});

Cypress.Commands.add("selectFromEducationDropdown", (courseOption) => {
  cy.contains("Education")
    .should("be.visible")
    .trigger("mouseover");

  cy.contains(courseOption)
    .should("be.visible")
    .click();
});

Cypress.Commands.add("verifyPageTitle", (expectedTitle) => {
  cy.title().should("contain", expectedTitle);
});

Cypress.Commands.add("verifyPageElements", () => {
  cy.get('input[name="firstname"]').should("be.visible");
  cy.get('#submitForm').should("be.visible");
  cy.contains("Sample Application Lifecycle - Sprint 1").should("be.visible");
});