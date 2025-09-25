describe("Smoke: Contact form works", () => {
  it("fills and submits the first form", () => {
    cy.visit("/filling-out-forms/");
    cy.get("#et_pb_contact_name_0").type("Cypress Tester");
    cy.get("#et_pb_contact_message_0").type("This is a smoke test message.");
    // nem működik
    // cy.get('[name="et_builder_submit_button"]').click(); 

    // megszámoljuk, hogy hány gomb van és az elsőre klikkelünk - ez instabil
    // eq(0) = első, eq(1) = második
    // cy.get('[name="et_builder_submit_button"]').eq(0).click(); 
    
    // ha mndkettőre rá akarsz kattintani
    // cy.get('[name="et_builder_submit_button"]').click({ multiple: true });

    // ez is olyan, mint az eq(0), vagis instabil
    // cy.get('[name="et_builder_submit_button"]').first().click(); 
    
    // működik - itt a form submitot hívjuk, nem a gombkattintást
    // cy.get('form#contactFormA').submit(); 

    // ez is működik, itt egyedi űrlapelem alapján azonosítjuk a formot
    cy.contains("form", "Submit") 
      .within(() => {
        cy.get('[name="et_builder_submit_button"]').click();
      });

    cy.contains("Thanks for contacting us").should("be.visible");
  });
});
