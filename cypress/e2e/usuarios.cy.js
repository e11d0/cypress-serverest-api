///<reference types ='Cypress'/>

import geradorusuario from '../factories/geradorusuario'

describe('Validar ações com o usuario', function () {

    context('Cadastro', function () {
        var umUsuario = geradorusuario.usuarioAdm();

        it('de usuario não cadastrado', function () {

            cy.postUsuario(umUsuario).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.message).to.eql('Cadastro realizado com sucesso')
                expect(response.body._id.length).to.eql(16)
            })

        })

        it('de usuario já cadastrado', function () {

            cy.postUsuario(umUsuario).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Este email já está sendo usado')
            })

        })

    })

    context('Pelo ID', function () {

        var umUsuario = geradorusuario.usuarioAdm();

        before(() => {

            cy.postUsuario(umUsuario).then(function (response) {
                Cypress.env('usuarioID', response.body._id)
            })

        })

        it('pesquisar usuario', function () {

            const id = Cypress.env('usuarioID')

            cy.getUsuarioID(id).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.nome).to.eql(umUsuario.nome)
            })

        })

        it('pesquisar usuario não cadsatrado', function () {

            const id = "s2283wPq69ReQkT13C"

            cy.getUsuarioID(id).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Usuário não encontrado")
            })

        })

        it('alterar usuario quando cadastrado', function () {

            const id = Cypress.env('usuarioID')

            cy.alterarUsuarioID(id).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro alterado com sucesso')
            })

        })

        it('alterar quando usuario não cadastrado', function () {
            var umUsuario = geradorusuario.usuarioAdm();
            const id = "1usuPY0cbmWhsaz1"
            cy.api({
                method: 'PUT',
                url: '/usuarios/' + id,
                body: umUsuario,
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.message).to.eql('Cadastro realizado com sucesso')
                expect(response.body._id.length).to.eql(16)
            })
        })

        it('alterar usuario com informações de outros usuario', function () {
            const id = Cypress.env('usuarioID')

            cy.alterarUsuarioIdDuplicado(id).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Este email já está sendo usado')
            })

        })

        it('deletar usuario', function () {

            const id = Cypress.env('usuarioID')

            cy.deleteUsuarioID(id).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro excluído com sucesso')
            })
        })

        after(function () {
            const id = Cypress.env('usuarioID')
            cy.deleteUsuarioID(id).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Nenhum registro excluído')
            })
        })
        

    })
    context('Pesquisar usuario',function(){

        it('todos os usuarios', function () {
            cy.getUsuario().then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.quantidade).greaterThan(0)
                expect(response.body.usuarios).to.be.a('array')
                expect(response.body.usuarios.length).greaterThan(0)
            })
        })

        it('pelo nome', function(){
            cy.getUsuarioPorAtributo("nome","Fulano da Silva").then(function(response){
                expect(response.status).to.eql(200)
            })
        })

        it('pelo email', function(){
            cy.getUsuarioPorAtributo("email","fulano@qa.com").then(function(response){
                expect(response.status).to.eql(200)
            })
        })

        it('pelo password', function(){
            cy.getUsuarioPorAtributo("password","teste").then(function(response){
                expect(response.status).to.eql(200)
            })
        })

        it('pelo administrador quando false', function(){
            cy.getUsuarioPorAtributo("administrador","false").then(function(response){
                expect(response.status).to.eql(200)
            })
        })

        it('pelo administrador quando true', function(){
            cy.getUsuarioPorAtributo("administrador","true").then(function(response){
                expect(response.status).to.eql(200)
            })
        })
        
        it('pelo id', function(){
            cy.getUsuarioPorAtributo("_id","0uxuPY0cbmQhpEz1").then(function(response){
                expect(response.status).to.eql(200)
            })
        })
    })
})