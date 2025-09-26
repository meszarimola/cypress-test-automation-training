describe('Accessibility checks', () => {
  it('should have no detectable a11y violations on load', () => {
    cy.visit('https://deals.androidauthority.com');

    // axe script betöltése a DOM-ba
    cy.injectAxe();

    // teljes oldal ellenőrzése
    cy.checkA11y();

    // csak egy adott szekció ellenőrzése
    // cy.checkA11y('#main-content');
  });
});
