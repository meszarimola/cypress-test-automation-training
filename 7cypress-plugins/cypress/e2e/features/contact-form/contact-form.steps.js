import { Given, When, Then }
  from "@badeball/cypress-cucumber-preprocessor";

// Oldal meglátogatása
Given("I open the contact form page", () => {
  cy.visit("https://ultimateqa.com/filling-out-forms/");
});

// Név mező kitöltése
When("I fill in the name field with {string}", (name) => {
  cy.xpath('//input[@id="et_pb_contact_name_0"]').type(name);
});

// Üzenet mező kitöltése
When("I fill in the message field with {string}", (message) => {
  cy.xpath('//textarea[@id="et_pb_contact_message_0"]').type(message);
});

// Submit gomb megnyomása
When("I click the submit button", () => {
  cy.xpath('//button[@name="et_builder_submit_button"]').first().click();
});

// Ellenőrzés
Then("I should see a confirmation message", () => {
  cy.contains("Thanks for contacting us").should("be.visible");
});
