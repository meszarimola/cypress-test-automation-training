describe('Visual regression – UltimateQA űrlap', () => {
  it('oldal kinézete ne változzon', () => {
    cy.viewport(1366, 768); // determinisztikus méret
    cy.visit('https://ultimateqa.com/filling-out-forms/');

    // animációk/ingadozó elemek várakozása jó ötlet:
    cy.wait(500);

    // teljes oldal snapshot
    cy.matchImageSnapshot('ultimateqa-form-fullpage');

    // csak egy komponens snapshotja:
    cy.get('#et_pb_contact_form_0').matchImageSnapshot('contact-form');
  });
});
