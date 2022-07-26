// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//commands para as funções do USUARIO
Cypress.Commands.add('postUsuario', function (payload) {
    cy.api({
        method: 'POST',
        url: '/usuarios',
        body: payload,
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getUsuario', function () {
    cy.api({
        method: 'GET',
        url: '/usuarios',
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getUsuarioID', function (usuarioID) {
    cy.api({
        method: 'GET',
        url: '/usuarios/' + usuarioID,
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('alterarUsuarioID', function (usuarioID) {
    cy.api({
        method: 'PUT',
        url: '/usuarios/' + usuarioID,
        body: {
            nome: 'zekinha alterado',
            email: 'carlosfelino8@qa.com.br',
            password: 'teste22',
            administrador: 'true'
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('alterarUsuarioIdDuplicado', function (usuarioID) {
    cy.api({
        method: 'PUT',
        url: '/usuarios/' + usuarioID,
        body: {
            nome: 'zekinha alterado',
            email: 'fulano@qa.com',
            password: 'teste22',
            administrador: 'true'
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('deleteUsuarioID', function (usuarioID) {
    cy.api({
        method: 'DELETE',
        url: '/usuarios/' + usuarioID,
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getUsuarioPorAtributo', function (nomeCampo, atributo) {

    switch (nomeCampo) {
        case '_id':
            cy.api({
                method: 'GET',
                url: '/usuarios',
                qs: { _id: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'nome':
            cy.api({
                method: 'GET',
                url: '/usuarios',
                qs: { nome: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'email':
            cy.api({
                method: 'GET',
                url: '/usuarios',
                qs: { email: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'password':
            cy.api({
                method: 'GET',
                url: '/usuarios',
                qs: { password: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'administrador':
            cy.api({
                method: 'GET',
                url: '/usuarios',
                qs: { administrador: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
    }
})

//commands para as funções de login
Cypress.Commands.add('realizarLogin', function (emailUsuario, senhaUsuario) {
    cy.api({
        method: 'POST',
        url: '/login',
        body: {
            email: emailUsuario,
            password: senhaUsuario
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})

//commands para as funções de produto
Cypress.Commands.add('getProduto', function () {
    cy.api({
        method: 'GET',
        url: '/produtos',
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getProdutosPorAtributo', function (nomeCampo, atributo) {

    switch (nomeCampo) {
        case '_id':
            cy.api({
                method: 'GET',
                url: '/produtos',
                qs: { _id: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'nome':
            cy.api({
                method: 'GET',
                url: '/produtos',
                qs: { nome: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'preco':
            cy.api({
                method: 'GET',
                url: '/produtos',
                qs: { preco: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'descricao':
            cy.api({
                method: 'GET',
                url: '/produtos',
                qs: { descricao: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'quantidade':
            cy.api({
                method: 'GET',
                url: '/produtos',
                qs: { quantidade: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
    }
})
Cypress.Commands.add('postProduto', function (payload, authToken) {
    cy.api({
        method: 'POST',
        url: '/produtos',
        body: payload,
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false,
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getProdutoID', function (produtoID) {
    cy.api({
        method: 'GET',
        url: '/produtos/' + produtoID,
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('alterarPorudotoID', function (produtoID, authToken) {
    cy.api({
        method: 'PUT',
        url: '/produtos/' + produtoID,
        body: {
            nome: 'Redragon k62-red',
            preco: 260,
            descricao: 'teclado',
            quantidade: 10
        },
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('alterarPorudotoIdDuplicado', function (produtoID, authToken) {
    cy.api({
        method: 'PUT',
        url: '/produtos/' + produtoID,
        body: {
            nome: 'Logitech pop - amarelo',
            preco: 470,
            descricao: 'teacldo',
            quantidade: 3
        },
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('deletarProdutoID', function (produtoID, authToken) {
    cy.api({
        method: 'DELETE',
        url: '/produtos/' + produtoID,
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})

//commands para as funções do carrinho
Cypress.Commands.add('getCarrinho', function () {
    cy.api({
        method: 'GET',
        url: '/carrinhos',
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
})
Cypress.Commands.add('getCarrinhosPorAtributo', function (nomeCampo, atributo) {

    switch (nomeCampo) {
        case '_id':
            cy.api({
                method: 'GET',
                url: '/carrinhos',
                qs: { _id: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'precoTotal':
            cy.api({
                method: 'GET',
                url: '/carrinhos',
                qs: { precoTotal: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'quantidadeTotal':
            cy.api({
                method: 'GET',
                url: '/carrinhos',
                qs: { quantidadeTotal: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
        case 'idUsuario':
            cy.api({
                method: 'GET',
                url: '/carrinhos',
                qs: { idUsuario: atributo },
                failOnStatusCode: false
            }).then(function (response) {
                return response
            })
            break;
    }
})
Cypress.Commands.add('postCarrinho', function (arrayProdutos, authToken) {

    cy.api({
        method: 'POST',
        url: '/carrinhos',
        body: {
            produtos: arrayProdutos
        },
        headers: {
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })

})
Cypress.Commands.add('concluirCarrinho',function(authToken){
    
    cy.api({
        method: 'DELETE',
        url: '/carrinhos/concluir-compra',
        headers:{
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })

})

Cypress.Commands.add('cancelarCarrinho',function(authToken){
    
    cy.api({
        method: 'DELETE',
        url: '/carrinhos/cancelar-compra',
        headers:{
            Authorization: authToken
        },
        failOnStatusCode: false
    }).then(function (response) {
        return response
    })
    
})