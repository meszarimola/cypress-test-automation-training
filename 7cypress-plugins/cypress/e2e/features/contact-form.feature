Feature: Contact form submission with XPath

  Scenario: User submits the contact form successfully
    Given I open the contact form page
    When I fill in the name field with "Teszt Elek"
    And I fill in the message field with "Ez egy teszt üzenet."
    And I click the submit button
    Then I should see a confirmation message
