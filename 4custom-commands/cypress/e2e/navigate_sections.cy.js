describe("UltimateQA Automation Practice - navigateToSection command", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("navigál a 'Big page with many elements' szekcióra", () => {
    cy.navigateToSection("Big page with many elements");
    cy.url().should("include", "complicated-page");
  });

  it("navigál a 'Fake Landing Page' szekcióra", () => {
    cy.navigateToSection("Fake Landing Page");
    cy.url().should("include", "fake-landing-page");
  });

  it("navigál a 'Fill out forms' szekcióra", () => {
    cy.navigateToSection("Fill out forms");
    cy.url().should("include", "filling-out-forms");
  });
});

describe("UltimateQA Automation Practice - fillAndSubmit command", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Fills out form", () => {
    cy.navigateToSection(
      "Learn how to automate an application that evolves over time"
    );
    cy.url().should("include", "sample-application-lifecycle-sprint-1/");
    cy.fillAndSubmit("[name=firstname]", "#submitForm", "Cypress Test");
    cy.url().should("include", "?firstname=Cypress%20Test");
  });
});

describe("Sample Application Lifecycle - Sprint 1 Custom Commands", () => {
  beforeEach(() => {
    cy.navigateToSampleApp();
  });

  it("should verify page elements are present", () => {
    cy.verifyPageElements();
  });

  it("should fill first name field individually", () => {
    cy.fillFirstName("John Doe");
    cy.get('input[name="firstname"]').should("have.value", "John Doe");
  });

  it("should submit form individually", () => {
    cy.fillFirstName("Test User");
    cy.submitForm();
    cy.url().should("include", "firstname=Test%20User");
  });

  it("should fill and submit form in one command", () => {
    cy.fillAndSubmitForm("Complete Test");
  });

  it("should handle special characters in first name", () => {
    const specialName = "János O'Brien-Smith";
    cy.fillAndSubmitForm(specialName);
  });

  it("should handle empty form submission", () => {
    cy.submitForm();
    cy.url().should("include", "firstname=");
  });

  it("should verify page title", () => {
    cy.verifyPageTitle("Sample Application Lifecycle");
  });
});

describe("Sample Application - Navigation and Social Media", () => {
  beforeEach(() => {
    cy.navigateToSampleApp();
  });

  it("should check all social media links exist", () => {
    cy.checkSocialMediaLinks();
  });

  it("should navigate to next sprint", () => {
    cy.navigateToNextSprint();
    cy.url().should("include", "sprint-2");
  });
});

describe("Sample Application - Mobile Responsiveness", () => {
  it("should open mobile menu on small screens", () => {
    cy.navigateToSampleApp();
    cy.openMobileMenu();
    cy.get('.mobile-menu, [data-testid="mobile-menu"]').should("be.visible");
  });

  it("should verify form functionality on mobile", () => {
    cy.viewport("iphone-6");
    cy.navigateToSampleApp();
    cy.fillAndSubmitForm("Mobile Test");
  });
});

describe("Sample Application - Education Dropdown", () => {
  beforeEach(() => {
    cy.navigateToSampleApp();
  });

  it("should select Selenium course from dropdown", () => {
    cy.selectFromEducationDropdown("Selenium");
  });

  it("should select Free courses from dropdown", () => {
    cy.selectFromEducationDropdown("Free courses");
  });
});

describe("Sample Application - Form Validation Edge Cases", () => {
  beforeEach(() => {
    cy.navigateToSampleApp();
  });

  it("should handle very long first name", () => {
    const longName = "A".repeat(100);
    cy.fillAndSubmitForm(longName);
  });

  it("should handle numeric characters in name", () => {
    cy.fillAndSubmitForm("User123");
  });

  it("should handle whitespace in name", () => {
    cy.fillAndSubmitForm("   Trimmed Name   ");
  });

  it("should submit multiple times", () => {
    cy.fillAndSubmitForm("First Submission");
    cy.navigateToSampleApp();
    cy.fillAndSubmitForm("Second Submission");
  });
});
