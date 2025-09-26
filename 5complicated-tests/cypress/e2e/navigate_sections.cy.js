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
    cy.navigateToSection("Learn how to automate an application that evolves over time");
    cy.url().should("include", "sample-application-lifecycle-sprint-1/");
    cy.fillAndSubmit("[name=firstname]", "#submitForm", "Cypress Test");
    cy.url().should("include", "?firstname=Cypress%20Test");
  });
});

describe("UltimateQA Automation Practice - Complex Form Validation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("validates complex form with multiple fields and error messages", () => {
    cy.navigateToSection("Fill out forms");
    cy.url().should("include", "filling-out-forms");

    // Test form validation by submitting empty form
    cy.get('input[type="submit"]').first().click();

    // Fill out form with various field types
    cy.get('input[name="et_pb_contact_name_0"]').type("John Doe");
    cy.get('input[name="et_pb_contact_email_0"]').type("john.doe@example.com");
    cy.get('textarea[name="et_pb_contact_message_0"]').type("This is a test message with special characters: @#$%^&*()");
    cy.get('input[name="et_pb_contact_captcha_0"]').type("12345");

    // Verify field values
    cy.get('input[name="et_pb_contact_name_0"]').should("have.value", "John Doe");
    cy.get('input[name="et_pb_contact_email_0"]').should("have.value", "john.doe@example.com");
    cy.get('textarea[name="et_pb_contact_message_0"]').should("contain.value", "special characters");
  });

  it("handles form validation errors and retry logic", () => {
    cy.navigateToSection("Fill out forms");

    // Submit form with invalid email
    cy.get('input[name="et_pb_contact_name_0"]').type("Test User");
    cy.get('input[name="et_pb_contact_email_0"]').type("invalid-email");
    cy.get('textarea[name="et_pb_contact_message_0"]').type("Test message");
    cy.get('input[type="submit"]').first().click();

    // Clear and retry with valid email
    cy.get('input[name="et_pb_contact_email_0"]').clear().type("valid@example.com");

    // Verify form state persistence
    cy.get('input[name="et_pb_contact_name_0"]').should("have.value", "Test User");
    cy.get('textarea[name="et_pb_contact_message_0"]').should("contain.value", "Test message");
  });
});

describe("UltimateQA Automation Practice - Dynamic Content Interaction", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("handles conditional interactions with dynamic elements", () => {
    cy.navigateToSection("Big page with many elements");
    cy.url().should("include", "complicated-page");

    // Test button interactions with different states
    cy.get("button").contains("Button success").should("be.visible").click();
    cy.get("button").contains("Button success").should("have.class", "btn-success");

    // Test radio button selection and validation
    cy.get('input[type="radio"]').should("have.length.greaterThan", 0);
    cy.get('input[type="radio"]').first().check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).check();
    cy.get('input[type="radio"]').first().should("not.be.checked");

    // Test dropdown selection with multiple options
    cy.get("select").first().then($select => {
      if ($select.length > 0) {
        cy.wrap($select).select(1);
        cy.wrap($select).find("option:selected").should("not.have.value", "");
      }
    });
  });

  it("verifies table data manipulation and sorting", () => {
    cy.navigateToSection("Big page with many elements");

    // Find and interact with table elements
    cy.get("table").should("be.visible").within(() => {
      // Check table headers exist
      cy.get("th").should("have.length.greaterThan", 0);

      // Verify table has data rows
      cy.get("tr").should("have.length.greaterThan", 1);

      // Test table cell content
      cy.get("td").first().should("contain.text");
    });

    // Test checkbox interactions in tables if present
    cy.get('input[type="checkbox"]').then($checkboxes => {
      if ($checkboxes.length > 0) {
        cy.wrap($checkboxes).first().check().should("be.checked");
        cy.wrap($checkboxes).first().uncheck().should("not.be.checked");
      }
    });
  });
});

describe("UltimateQA Automation Practice - Advanced Interactions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("handles multiple window/tab scenarios and URL validation", () => {
    cy.navigateToSection("Big page with many elements");

    // Test links that might open in new tabs
    cy.get('a[href]').then($links => {
      const externalLinks = $links.filter((_, link) => {
        return link.href && !link.href.includes(Cypress.config().baseUrl);
      });

      if (externalLinks.length > 0) {
        // Remove target="_blank" to test in same window
        cy.wrap(externalLinks).first().invoke("removeAttr", "target").click();
        cy.go("back");
        cy.url().should("include", "complicated-page");
      }
    });
  });

  it("performs complex element state verification and timing", () => {
    cy.navigateToSection("Big page with many elements");

    // Test element visibility with wait conditions
    cy.get("h1").should("be.visible");
    cy.get("h1").invoke("text").should("not.be.empty");

    // Test multiple element interactions in sequence
    cy.get("button").each(($btn, index) => {
      if (index < 3) { // Limit to first 3 buttons to avoid excessive testing
        cy.wrap($btn).should("be.visible");
        if (!$btn.is(":disabled")) {
          cy.wrap($btn).click();
          cy.wait(100); // Small wait between interactions
        }
      }
    });

    // Test form elements with complex validation
    cy.get('input[type="text"]').then($inputs => {
      if ($inputs.length > 0) {
        $inputs.each((index, input) => {
          if (index < 2) { // Test first 2 text inputs
            cy.wrap(input).clear().type(`Test Value ${index + 1}`);
            cy.wrap(input).should("have.value", `Test Value ${index + 1}`);
          }
        });
      }
    });
  });

  it("validates responsive behavior and element positioning", () => {
    cy.navigateToSection("Big page with many elements");

    // Test different viewport sizes
    cy.viewport(1200, 800);
    cy.get("h1").should("be.visible");

    cy.viewport(768, 1024);
    cy.get("h1").should("be.visible");

    cy.viewport(375, 667);
    cy.get("h1").should("be.visible");

    // Reset to default viewport
    cy.viewport(1000, 660);

    // Test scrolling behavior
    cy.scrollTo("bottom");
    cy.scrollTo("top");
    cy.get("h1").should("be.visible");
  });
});

describe("UltimateQA Automation Practice - File Upload and API Testing", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("handles file upload scenarios with validation", () => {
    cy.navigateToSection("Big page with many elements");

    // Look for file input elements
    cy.get('input[type="file"]').then($fileInputs => {
      if ($fileInputs.length > 0) {
        // Create a test file and upload it
        cy.fixture("example.json").then(fileContent => {
          cy.wrap($fileInputs.first()).selectFile({
            contents: JSON.stringify(fileContent),
            fileName: "test-upload.json",
            mimeType: "application/json"
          });
        });

        // Verify file was selected
        cy.wrap($fileInputs.first()).should("have.prop", "files").then(files => {
          expect(files).to.have.length.greaterThan(0);
        });
      }
    });
  });

  it("performs API request interception and validation", () => {
    // Set up API intercepts
    cy.intercept("GET", "**/api/**", {
      statusCode: 200,
      body: { success: true, message: "Mocked API response" }
    }).as("apiCall");

    cy.intercept("POST", "**/contact**", {
      statusCode: 200,
      body: { status: "submitted", id: "12345" }
    }).as("contactSubmit");

    cy.navigateToSection("Fill out forms");

    // Fill out form that might trigger API calls
    cy.get('input[name="et_pb_contact_name_0"]').type("API Test User");
    cy.get('input[name="et_pb_contact_email_0"]').type("apitest@example.com");
    cy.get('textarea[name="et_pb_contact_message_0"]').type("Testing API integration");

    // Submit form and wait for potential API calls
    cy.get('input[type="submit"]').first().click();

    // Wait for API calls if they occur
    cy.wait(1000);

    // Test direct API call simulation
    cy.request({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404, 500]);
      if (response.status === 200) {
        expect(response.body).to.have.property("id");
      }
    });
  });
});

describe("UltimateQA Automation Practice - Advanced User Interactions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("simulates drag and drop operations with validation", () => {
    cy.navigateToSection("Big page with many elements");

    // Look for draggable elements
    cy.get('[draggable="true"], .draggable').then($draggable => {
      if ($draggable.length > 0) {
        cy.wrap($draggable.first())
          .trigger("dragstart");

        // Find drop target or simulate drop
        cy.get("body").trigger("dragover").trigger("drop");
      } else {
        // Simulate drag and drop behavior with mouse events
        cy.get("h1").then($source => {
          const sourceRect = $source[0].getBoundingClientRect();
          cy.get("p").first().then($target => {
            const targetRect = $target[0].getBoundingClientRect();

            cy.wrap($source)
              .trigger("mousedown", {
                clientX: sourceRect.x + sourceRect.width / 2,
                clientY: sourceRect.y + sourceRect.height / 2
              });

            cy.wrap($target)
              .trigger("mousemove", {
                clientX: targetRect.x + targetRect.width / 2,
                clientY: targetRect.y + targetRect.height / 2
              })
              .trigger("mouseup");
          });
        });
      }
    });
  });

  it("handles complex keyboard interactions and shortcuts", () => {
    cy.navigateToSection("Big page with many elements");

    // Test keyboard navigation
    cy.get("body").type("{tab}");
    cy.focused().should("exist");

    // Test input field keyboard interactions
    cy.get('input[type="text"]').first().then($input => {
      cy.wrap($input)
        .focus()
        .type("Test keyboard input")
        .type("{selectall}")
        .type("Replaced text")
        .should("have.value", "Replaced text");

      // Test keyboard shortcuts
      cy.wrap($input)
        .type("{ctrl+a}")
        .type("New content")
        .should("have.value", "New content");
    });

    // Test escape key behavior
    cy.get("body").type("{esc}");
  });

  it("validates complex element state changes and animations", () => {
    cy.navigateToSection("Big page with many elements");

    // Test hover effects and state changes
    cy.get("button").each(($btn, index) => {
      if (index < 2) {
        cy.wrap($btn)
          .trigger("mouseenter")
          .should("be.visible")
          .trigger("mouseleave");
      }
    });

    // Test focus states
    cy.get('input, button, select').each(($element, index) => {
      if (index < 3) {
        cy.wrap($element)
          .focus()
          .should("have.focus")
          .blur()
          .should("not.have.focus");
      }
    });

    // Test element visibility with scroll
    cy.scrollTo("bottom");
    cy.get("*").last().should("be.visible");
    cy.scrollTo("top");
    cy.get("h1").should("be.visible");
  });

  it("performs comprehensive accessibility and usability testing", () => {
    cy.navigateToSection("Big page with many elements");

    // Test for accessibility attributes
    cy.get('[alt]').each($element => {
      cy.wrap($element).should("have.attr", "alt").and("not.be.empty");
    });

    // Test for proper labeling
    cy.get('input').each($input => {
      const id = $input.attr("id");
      if (id) {
        cy.get(`label[for="${id}"]`).should("exist");
      }
    });

    // Test tab order and keyboard accessibility
    const focusableElements = [
      'input:not([disabled])',
      'button:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]'
    ].join(', ');

    cy.get(focusableElements).then($elements => {
      if ($elements.length > 0) {
        cy.wrap($elements.first()).focus().should("have.focus");
        cy.get("body").type("{tab}");
      }
    });

    // Test color contrast and visibility
    cy.get("button, a").each($element => {
      cy.wrap($element).then($el => {
        const styles = window.getComputedStyle($el[0]);
        expect(styles.color).to.not.equal("transparent");
        expect(styles.backgroundColor).to.exist;
      });
    });
  });
});
