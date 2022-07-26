///<reference types ='Cypress'/>

import geradorcarrinho from '../factories/geradorCarrinho'
import geradorusuario from '../factories/geradorusuario'

describe('Carrinho', function () {

    context('Cadsatrar', function () {

        var umUsuarioAdmin = geradorusuario.usuarioAdm()
        var umUsuarioAdmin2 = geradorusuario.usuarioAdm()


        before(() => {

            cy.postUsuario(umUsuarioAdmin)
            cy.realizarLogin(umUsuarioAdmin.email, umUsuarioAdmin.password).then(function (response) {
                Cypress.env('tokenAdmin', response.body.authorization)
            })
            cy.getProduto().then(function (response) {
                Cypress.env('getdosprodutos', response.body)
            })

            cy.postUsuario(umUsuarioAdmin2)
            cy.realizarLogin(umUsuarioAdmin2.email, umUsuarioAdmin2.password).then(function (response) {
                Cypress.env('tokenadm2', response.body.authorization)
            })

        })

        it('quando produtos e token valido', function () {

            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.gerarCarrinho(produto)

            const tokenadmin = Cypress.env('tokenAdmin')

            cy.postCarrinho(gerarCarrinho, tokenadmin).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.message).to.eql('Cadastro realizado com sucesso')
                expect(response.body.message).to.be.a('string')
                expect(response.body._id.length).to.eql(16)
                //expect(response.body._id.length).to.be.a('string')

            })
        })

        it('quando carrinho já existente', function () {

            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.gerarCarrinho(produto)
            const tokenadmin = Cypress.env('tokenAdmin')

            cy.postCarrinho(gerarCarrinho, tokenadmin).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Não é permitido ter mais de 1 carrinho')
                expect(response.body.message).to.be.a('string')

            })
        })

        it('quando produto fora do formato e token valido', function () {

            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.gerarCarrinho(produto)
            const tokenadmin = Cypress.env('tokenAdmin')

            cy.postCarrinho(gerarCarrinho[0], tokenadmin).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.produtos).to.eql('produtos deve ser um array')
                expect(response.body.produtos).to.be.a('string')

            })
        })

        it('quando produtos duplicados e token valido', function () {


            const tokenadmin2 = Cypress.env('tokenadm2')
            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.carrinhoProdutos()

            cy.postCarrinho(gerarCarrinho, tokenadmin2).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Não é permitido possuir produto duplicado')
                expect(response.body.message).to.be.a('string')

            })
        })

        it('quando produto existente e token invalido', function () {

            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.gerarCarrinho(produto)
            const tokenadmin = "asdsadsadas"

            cy.postCarrinho(gerarCarrinho, tokenadmin).then(function (response) {
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                expect(response.body.message).to.be.a('string')

            })
        })

        it('quando produto inexistente e token invalido', function () {
            
            var produto = Cypress.env('getdosprodutos')
            var gerarCarrinho = geradorcarrinho.carrinhoInexistente()
            const tokenadmin2 = Cypress.env('tokenadm2')

            cy.postCarrinho(gerarCarrinho, tokenadmin2).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Produto não encontrado')
                expect(response.body.message).to.be.a('string')

            })
        })

    })

    context('Pesquisar', function () {

        it('todos os carrinhos', function () {
            cy.getCarrinho().then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.quantidade).greaterThan(0)
                expect(response.body.carrinhos).to.be.a('array')
                expect(response.body.carrinhos.length).greaterThan(0)

                //criando as 'variveis' a partir da resposta

                Cypress.env('carrinhoId', response.body.carrinhos[0]._id)
                Cypress.env('carrinhoPrecoTotal', response.body.carrinhos[0].precoTotal)
                Cypress.env('carrinhoQuantTotal', response.body.carrinhos[0].quantidadeTotal)
                Cypress.env('carrinhoIdUsuario', response.body.carrinhos[0].idUsuario)

            })
        })
        it('pelo id', function () {
            const id = Cypress.env('carrinhoId')
            cy.getCarrinhosPorAtributo("_id", id).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pelo precoTotal', function () {
            const precoT = Cypress.env('carrinhoPrecoTotal')
            cy.getCarrinhosPorAtributo("quantidadeTotal", precoT).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pela quantidadeTotal', function () {
            const quantiT = Cypress.env('carrinhoQuantTotal')
            cy.getCarrinhosPorAtributo("quantidadeTotal", quantiT).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pela idUsuario', function () {
            const idUsuario = Cypress.env('carrinhoIdUsuario')
            cy.getCarrinhosPorAtributo("idUsuario", 382).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })

    })

    context('Delete , concluir compra', function(){
        var umUsuarioAdmin = geradorusuario.usuarioAdm()


        before(() => {

            cy.postUsuario(umUsuarioAdmin)

            cy.realizarLogin(umUsuarioAdmin.email, umUsuarioAdmin.password).then(function (response) {
                Cypress.env('tokenAdmin', response.body.authorization)
            })

            cy.getProduto().then(function (response) {

                var tokenadmin = Cypress.env('tokenAdmin')
                var gerarCarrinho = geradorcarrinho.gerarCarrinho(response.body)

                cy.postCarrinho(gerarCarrinho, tokenadmin)

            })

        })

        it('concluir carrinho quando usuario e token invalido', function () {

            const tokenadmin = "asdsadasdasdas"

            cy.concluirCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                expect(response.body.message).to.be.a('string')
            })

        })

        it('concluir carrinho quando usuario e token validos', function () {

            const tokenadmin = Cypress.env('tokenAdmin')

            cy.concluirCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro excluído com sucesso')
                expect(response.body.message).to.be.a('string')
            })

        })

        it('concluir quando carrinho nao existente para o usuario', function () {

            const tokenadmin = Cypress.env('tokenAdmin')

            cy.concluirCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Não foi encontrado carrinho para esse usuário')
                expect(response.body.message).to.be.a('string')
            })
            
        })

    })

    context('Delete , cancelar compra', function(){
        var umUsuarioAdmin = geradorusuario.usuarioAdm()


        before(() => {

            cy.postUsuario(umUsuarioAdmin)

            cy.realizarLogin(umUsuarioAdmin.email, umUsuarioAdmin.password).then(function (response) {
                Cypress.env('tokenAdmin', response.body.authorization)
            })

            cy.getProduto().then(function (response) {

                var tokenadmin = Cypress.env('tokenAdmin')
                var gerarCarrinho = geradorcarrinho.gerarCarrinho(response.body)

                cy.postCarrinho(gerarCarrinho, tokenadmin)

            })

        })

        it('cancelar carrinho quando usuario e token invalido', function () {

            const tokenadmin = "asdsadasdasdas"

            cy.cancelarCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                expect(response.body.message).to.be.a('string')
            })

        })

        it('cancelar carrinho quando usuario e token validos', function () {

            const tokenadmin = Cypress.env('tokenAdmin')

            cy.cancelarCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro excluído com sucesso. Estoque dos produtos reabastecido')
                expect(response.body.message).to.be.a('string')
            })

        })

        it('cancelar quando carrinho nao existente para o usuario', function () {

            const tokenadmin = Cypress.env('tokenAdmin')

            cy.cancelarCarrinho(tokenadmin).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Não foi encontrado carrinho para esse usuário')
                expect(response.body.message).to.be.a('string')
            })
            
        })

    })
})