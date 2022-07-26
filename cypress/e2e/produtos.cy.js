///<reference types ='Cypress'/>

import geradorproduto from '../factories/geradorProduto'
import geradorusuario from '../factories/geradorusuario'

describe('Produtos', function () {

    context('Cadastro', function () {
        var produtos = geradorproduto.produtosPopular()
        var produto = geradorproduto.produto()
        var umUsuarioAdmin = geradorusuario.usuarioAdm()
        var umUsuario = geradorusuario.usuario()

        before(() => {

            cy.postUsuario(umUsuarioAdmin)
            cy.realizarLogin(umUsuarioAdmin.email, umUsuarioAdmin.password).then(function (response) {
                Cypress.env('tokenAdmin', response.body.authorization)
            })

            cy.postUsuario(umUsuario)
            cy.realizarLogin(umUsuario.email, umUsuario.password).then(function (response) {
                Cypress.env('tokenUsuario', response.body.authorization)
                cy.postProduto(produtos[0], response.body.authorization)
            })

        })

        it('quando token valido', function () {

            var tokenadm = Cypress.env('tokenAdmin')

            cy.postProduto(produto, tokenadm).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.message).to.eql('Cadastro realizado com sucesso')
                expect(response.body._id.length).to.eql(16)
            })

        })

        it('quando token invalido', function () {

            cy.postProduto(produto, "umtokeninvalido").then(function (response) {
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })

        })

        it('de produto ja cadastrado', function () {

            var tokenadm = Cypress.env('tokenAdmin')

            cy.postProduto(produtos[0], tokenadm).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Já existe produto com esse nome')
            })

        })

        it('quando usuario nao administrador', function () {

            var tokenuser = Cypress.env('tokenUsuario')

            cy.postProduto(produto, tokenuser).then(function (response) {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql('Rota exclusiva para administradores')
            })

        })

    })

    context('pesquisa', function () {
        it('todos os produtos', function () {
            cy.getProduto().then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.quantidade).greaterThan(0)
                expect(response.body.produtos).to.be.a('array')
                expect(response.body.produtos.length).greaterThan(0)
                //Cypress.env('produtoId', response.body[0]._id)
            })
        })
        it('pelo nome', function () {
            cy.getProdutosPorAtributo("nome", "Logitech MX Vertical").then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pelo preco', function () {
            cy.getProdutosPorAtributo("preco", "470").then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pela descricao', function () {
            cy.getProdutosPorAtributo("descricao", "Mouse").then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pela quantidade', function () {
            cy.getProdutosPorAtributo("quantidade", 382).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })
        it('pelo id', function () {
            const id = Cypress.env('produtoId')
            cy.getProdutosPorAtributo("_id", id).then(function (response) {
                expect(response.status).to.eql(200)
            })
        })

    })

    context('Pelo ID', function () {

        var produto = geradorproduto.produto()
        var umUsuarioAdmin = geradorusuario.usuarioAdm()
        var umUsuario = geradorusuario.usuario()

        before(() => {

            cy.postUsuario(umUsuarioAdmin)
            cy.realizarLogin(umUsuarioAdmin.email, umUsuarioAdmin.password).then(function (response) {
                Cypress.env('tokenAdmin', response.body.authorization)
                cy.postProduto(produto, response.body.authorization).then(function (response) {
                    cy.log(response)
                    Cypress.env('produtoId', response.body._id)
                })
            })

            cy.postUsuario(umUsuario)
            cy.realizarLogin(umUsuario.email, umUsuario.password).then(function (response) {
                Cypress.env('tokenUsuario', response.body.authorization)
            })

            cy.getCarrinho().then(function (response) {
                Cypress.env('produtoDelID', response.body.carrinhos[0].produtos[0].idProduto)
            })

        })

        it('pesquisar produto', function () {

            const id = Cypress.env('produtoId')

            cy.getProdutoID(id,).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.nome).to.eql(produto.nome)
            })

        })

        it('pesquisar produto não cadsatrado', function () {

            const id = "s2283wPq69ReQkT13C"

            cy.getProdutoID(id).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql("Produto não encontrado")
            })

        })

        it('alterar produto quando cadastrado', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.alterarPorudotoID(id, tokenadm).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro alterado com sucesso')
            })

        })

        it('alterar quando produto não cadastrado', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            var produto = geradorproduto.produto()
            const id = "7TrsLkUTECCKW7ad"

            cy.api({
                method: 'PUT',
                url: '/produtos/' + id,
                body: produto,
                headers: {
                    Authorization: tokenadm
                },
                failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.eql(201)
                expect(response.body.message).to.eql('Cadastro realizado com sucesso')
                expect(response.body._id.length).to.eql(16)
            })
        })

        it('alterar produto com informações produto ja cadastrado', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.alterarPorudotoIdDuplicado(id, tokenadm).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Já existe produto com esse nome')
            })

        })

        it('alterar produto quando token invalido', function () {

            const tokenadmInvalido = 'tokeninvalido' + Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.alterarPorudotoID(id, tokenadmInvalido).then(function (response) {
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })

        })

        it('alterar produto quando token de usuario não adm', function () {

            const tokenusuario = Cypress.env('tokenUsuario')
            const id = Cypress.env('produtoId')

            cy.alterarPorudotoID(id, tokenusuario).then(function (response) {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql('Rota exclusiva para administradores')
            })

        })

        it('deletar produto', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.deletarProdutoID(id, tokenadm).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Registro excluído com sucesso')
            })

        })

        it('deletar produto quando vinculado a carrinho', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoDelID')

            cy.deletarProdutoID(id, tokenadm).then(function (response) {
                expect(response.status).to.eql(400)
                expect(response.body.message).to.eql('Não é permitido excluir produto que faz parte de carrinho')
            })

        })

        it('deletar produto quando token invalido', function () {

            const tokenadmInvalido = 'tokeninvalido' + Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.deletarProdutoID(id, tokenadmInvalido).then(function (response) {
                expect(response.status).to.eql(401)
                expect(response.body.message).to.eql('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })
        })

        it('deletar produto quando token de usuario não adm', function () {

            const tokenusuario = Cypress.env('tokenUsuario')
            const id = Cypress.env('produtoId')

            cy.deletarProdutoID(id, tokenusuario).then(function (response) {
                expect(response.status).to.eql(403)
                expect(response.body.message).to.eql('Rota exclusiva para administradores')
            })
        })

        it('deletar produto que nao existe mais', function () {

            const tokenadm = Cypress.env('tokenAdmin')
            const id = Cypress.env('produtoId')

            cy.deletarProdutoID(id, tokenadm).then(function (response) {
                expect(response.status).to.eql(200)
                expect(response.body.message).to.eql('Nenhum registro excluído')
            })
        })

    })

})