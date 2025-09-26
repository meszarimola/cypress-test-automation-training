describe('XPath példa', () => {
  it('keres XPath segítségével', () => {
    cy.visit('https://ultimateqa.com/filling-out-forms/');

    // Név mező kiválasztása XPath alapján
    cy.xpath('//input[@id="et_pb_contact_name_0"]').type('Teszt Elek');

    // Üzenet mező
    cy.xpath('//textarea[@id="et_pb_contact_message_0"]').type('Ez egy teszt üzenet.');

    // Submit gomb
    cy.xpath('//button[@name="et_builder_submit_button"]').first().click();

    // Ellenőrzés
    cy.contains('Thanks for contacting us').should('be.visible');
  });
});