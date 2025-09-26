describe('Deals OAuth login', () => {
  it('logs in with Google (via plugin)', () => {
    cy.visit('https://deals.androidauthority.com/');

    // 1. főoldali "Sign In" link
    cy.get('a#signIn').click();

    // 2. a login oldalon "Continue With Google" gomb
    cy.get('button[label="Continue With Google"]').click();

    // plugin meghívása (Google login folyamat + sütik beállítása)
    cy.loginWithGoogle();

    // ellenőrzés, hogy belépett
    cy.visit('https://deals.androidauthority.com/');
    cy.contains(/(My Account|Profile|Logout)/i).should('exist');
  });
});
