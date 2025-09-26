describe("UltimateQA - Fill out forms (adatvezérelt)", () => {
  beforeEach(() => {
    cy.visit("https://ultimateqa.com/filling-out-forms/");
  });

  it("elküldi az űrlapot többféle adattal", () => {
    cy.fixture("contact-users").then((users) => {
      users.forEach((user) => {
        cy.log(`Teszt futtatása ezzel a névvel: ${user.name}`);
        cy.get("#et_pb_contact_name_0").clear().type(user.name);
        cy.get("#et_pb_contact_message_0").clear().type(user.message);
        cy.get("[name='et_builder_submit_button']").first().click();
        cy.contains("Thanks for contacting us").should("be.visible");
        cy.reload();
      });
    });
  });
});
