//fazendo a chamada (importando) a biblioteca do faker para randomizar nomes e e-mails
var faker = require('faker');
//fazendo a chamada(importando) a biblioteca do gerador-validador-cpf para randomizar os cpfs
var cpf = require('gerador-validador-cpf')
//define a exportação como padrão
export default {
    usuarioAdm: function () {
        //criando a instanacia do primeiro nome e gerando 
        var firstName = faker.name.firstName();
        //criando a instancia do sobrenome e gerando
        var lastName = faker.name.lastName();
        var data = {
            nome:`${firstName} ${lastName}`,
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true'
        }
        //retorna data encapsulada no usuario
        return data;
    },
    usuario: function () {
        //criando a instanacia do primeiro nome e gerando 
        var firstName = faker.name.firstName();
        //criando a instancia do sobrenome e gerando
        var lastName = faker.name.lastName();
        var data = {
            nome:`${firstName} ${lastName}`,
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'false'
        }
        //retorna data encapsulada no usuario
        return data;
    }

}