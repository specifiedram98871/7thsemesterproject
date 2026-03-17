
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
 
