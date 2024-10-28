describe('Sliding Scale Popup', () => {
  beforeEach(() => {
    // Assuming your page is served at localhost:3000
    // Adjust this URL to match your development environment
    cy.visit('http://localhost:4000/workshops/shading/')
  })

  it('opens popup when trigger button is clicked', () => {
    // Get popup trigger button and click it
    cy.get('.openPopup').first().click()

    // Verify the popup is visible
    cy.get('#discountPopup').should('not.have.class', 'hidden')
  })

  // Add more test cases here as needed
})
