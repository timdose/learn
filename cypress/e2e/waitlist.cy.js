describe('Waitlist Popup', () => {
    beforeEach(() => {
      // Assuming your page is served at localhost:3000
      // Adjust this URL to match your development environment
      cy.visit('http://localhost:4000/workshops/shading/')
    })
  
    it('opens and closes popup when trigger button is clicked', () => {
      // Get popup trigger button and click it
      cy.get('.waitlist-button').first().click()
  
      // Verify the popup is visible
      cy.get('#waitlistPopup').should('not.have.class', 'hidden')
  
      cy.get('[data-test-id="close-waitlist-popup"]').click()
      cy.get('#waitlistPopup').should('have.class', 'hidden')
    })
  
    it('closes the modal when escape key is pressed', () => {
      // Get popup trigger button and click it
      cy.get('.waitlist-button').first().click()
  
      // Verify the popup is visible
      cy.get('#waitlistPopup').should('not.have.class', 'hidden')
  
      // Press escape key
      cy.get('body').type('{esc}')
  
      // Verify the popup is hidden
      cy.get('#waitlistPopup').should('have.class', 'hidden')
    })
    
    it('closes the popup when clicking outside of it', () => {
      // Get popup trigger button and click it
      cy.get('.waitlist-button').first().click()

      // Verify the popup is visible
      cy.get('#waitlistPopup').should('not.have.class', 'hidden')

      // Click outside of the popup
      cy.get('body').click(0, 0)

      // Verify the popup is hidden
      cy.get('#waitlistPopup').should('have.class', 'hidden')
    })

    it('shows the time preference popup after the user has successfully submitted their email', () => {
      // Get popup trigger button and click it
      cy.get('.waitlist-button').first().click()

    // Verify the popup is visible
      cy.get('#waitlistPopup').should('not.have.class', 'hidden')

      // Enter email and click submit
      cy.get('#waitlistEmail').type('test@test.com')
      cy.get('[data-test-id="submit-waitlist-popup"]').click()

      // Verify the popup is hidden
      cy.get('#waitlistPopup').should('have.class', 'hidden')

      // Verify the time preference popup is visible
      cy.get('#timePreferencePopup').should('not.have.class', 'hidden')
    })

    it('passes email to time preference popup hidden field', () => {
      const testEmail = 'test@test.com';
      
      // Get popup trigger button and click it
      cy.get('.waitlist-button').first().click()

      // Enter email and submit
      cy.get('#waitlistEmail').type(testEmail)
      cy.get('[data-test-id="submit-waitlist-popup"]').click()

      // Verify the email was passed to the hidden field
      cy.get('#timePreferencePopup input[name="waitlistEmail"]')
        .should('have.value', testEmail)
    })

    it('shows the time preference popup only for live workshop waitlist submissions', () => {
      // Click the live workshop waitlist button (with data-ask-times attribute)
      cy.get('.waitlist-button[data-ask-times]').first().click()
      
      // Submit email
      cy.get('#waitlistEmail').type('test@test.com')
      cy.get('[data-test-id="submit-waitlist-popup"]').click()
      
      // Verify time preference popup appears
      cy.get('#timePreferencePopup').should('not.have.class', 'hidden')
    })

    it('does not show time preference popup for recordings-only waitlist submissions', () => {
      // Click the recordings waitlist button (without data-ask-times attribute)
      cy.get('.waitlist-button:not([data-ask-times])').first().click()
      
      // Submit email
      cy.get('#waitlistEmail').type('test@test.com')
      cy.get('[data-test-id="submit-waitlist-popup"]').click()
      
      // Verify time preference popup stays hidden
      cy.get('#timePreferencePopup').should('have.class', 'hidden')
    })

    it('passes email to time preference popup hidden field for live workshop', () => {
      const testEmail = 'test@test.com';
      
      // Click the live workshop waitlist button specifically
      cy.get('.waitlist-button[data-ask-times]').first().click()

      // Enter email and submit
      cy.get('#waitlistEmail').type(testEmail)
      cy.get('[data-test-id="submit-waitlist-popup"]').click()

      // Verify the email was passed to the hidden field
      cy.get('#timePreferencePopup input[name="waitlistEmail"]')
        .should('have.value', testEmail)
    })
})
