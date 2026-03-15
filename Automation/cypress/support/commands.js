
Cypress.Commands.add('login', (email, password) => { 
    cy.request({
        method:"POST",
        url:"http://localhost:3000/api/v1/login",
        body:{
            email:"admin@gmail.com",
            password:"admin123"
        }
    }).then((res)=>{
        expect(res.status).to.eq(201)
        expect(res.body).to.have.property("token")
        expect(res.body.success).to.eq(true)
    })
 })
