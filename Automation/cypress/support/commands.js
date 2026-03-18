
Cypress.Commands.add('login', (email, password) => { 
    cy.request({
        method:"POST",
        url:`${Cypress.env('backendUrl')}/api/v1/login`,
        body:{
            email:email,
            password:password
        }
    }).then((res)=>{
        expect(res.status).to.eq(201)
        expect(res.body).to.have.property("token")
        expect(res.body.success).to.eq(true)
    })
 })
 
Cypress.Commands.add('getMe', () => {
    cy.intercept('GET', '/api/v1/me', {
    statusCode: 200,
    body: { user: null },
  }).as('getMe')
})

 Cypress.Commands.add('mockCommonApis', () => {
  cy.intercept('GET', '/api/v1/products/all', {
    statusCode: 200,
    body: { products: [] },
  }).as('getProducts')

  cy.intercept('GET', '/api/v1/recommend/*', {
    statusCode: 200,
    body: { recommendations: [] },
  }).as('getRecommendations')
})
