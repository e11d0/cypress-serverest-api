///<reference types ='Cypress'/>


import geradorusuario from '../factories/geradorusuario'

describe('Login', function () {

    var usuario = geradorusuario.usuario()
    var usuarioAdm = geradorusuario.usuarioAdm()

    before(() => {

        cy.postUsuario(usuario)
        cy.postUsuario(usuarioAdm)

    })

    it('com sucesso usuario admin', function () {


        cy.realizarLogin(usuarioAdm.email,usuarioAdm.password).then(function (response) {
            expect(response.status).to.eql(200)
            expect(response.body.message).to.eql('Login realizado com sucesso')
            expect(response.body.authorization).to.contains('Bearer')
        })
    })
    it('com sucesso usuario', function () {

        cy.realizarLogin(usuario.email, usuario.password).then(function (response) {
            expect(response.status).to.eql(200)
            expect(response.body.message).to.eql('Login realizado com sucesso')
            expect(response.body.authorization).to.contains('Bearer')
        })
    })
    it('com senha errada', function () {
        cy.realizarLogin(usuarioAdm.email, "teste22").then(function (response) {
            expect(response.status).to.eql(401)
            expect(response.body.message).to.eql('Email e/ou senha inválidos')
        })
    })
    it('com email não existente', function () {
        cy.realizarLogin("fulaniasiuu88o@ql.com",usuarioAdm.password).then(function (response) {
            expect(response.status).to.eql(401)
            expect(response.body.message).to.eql('Email e/ou senha inválidos')
        })
    })

})