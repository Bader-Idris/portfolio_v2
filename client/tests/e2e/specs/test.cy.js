describe('My First Test', function () {
  it('Visits the app root url', function () {
    cy.visit('/')
    cy.contains('#container', 'Inbox')
  })
})
