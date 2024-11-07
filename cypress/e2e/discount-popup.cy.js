describe('Sliding Scale Popup', () => {
  beforeEach(() => {
    // Assuming your page is served at localhost:3000
    // Adjust this URL to match your development environment
    cy.visit('http://localhost:4000/workshops/shading/')
  })

  it('opens and closes popup when trigger button is clicked', () => {
    // Get popup trigger button and click it
    cy.get('.openPopup').first().click()

    // Verify the popup is visible
    cy.get('#discountPopup').should('not.have.class', 'hidden')

    cy.get('#discountPopup .close').click()
    cy.get('#discountPopup').should('have.class', 'hidden')
  })

  it('closes the modal when escape key is pressed', () => {
    // Get popup trigger button and click it
    cy.get('.openPopup').first().click()

    // Verify the popup is visible
    cy.get('#discountPopup').should('not.have.class', 'hidden')

    // Press escape key
    cy.get('body').type('{esc}')

    // Verify the popup is hidden
    cy.get('#discountPopup').should('have.class', 'hidden')
  })

  it('closes the popup when clicking outside of it', () => {
    // Get popup trigger button and click it
    cy.get('.openPopup').first().click()

    // Verify the popup is visible
    cy.get('#discountPopup').should('not.have.class', 'hidden')

    // Click outside of the popup
    cy.get('body').click(0, 0)

    // Verify the popup is hidden
    cy.get('#discountPopup').should('have.class', 'hidden')
  })

  // Add more test cases here as needed
})
