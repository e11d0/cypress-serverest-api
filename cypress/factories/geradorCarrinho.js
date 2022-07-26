export default {

    carrinhoProdutos: function () {
        var data = [
            {
                idProduto: 'Fdi3x33cVHTnoo5V',
                quantidade: 1
            },
            {
                idProduto: 'Fdi3x33cVHTnoo5V',
                quantidade: 1
            }
        ]
        return data
    },
    carrinhoAtualizarID:function(arrayProdudos,getDosProdutos){

        var carrinhoprodutos = arrayProdudos

        for (let i = 0; i<carrinhoprodutos.length; i++) {
            carrinhoprodutos[i].idProduto = getDosProdutos.produtos[i]._id;
        }
        return carrinhoprodutos
    },
    gerarCarrinho:function(getDosProdutos){
        var data = this.carrinhoAtualizarID(this.carrinhoProdutos(), getDosProdutos)
        return data
    },
    carrinhoInexistente: function () {
        var data = [
            {
                idProduto: 'Fdi3x33cVHTnoo5V',
                quantidade: 1
            },
        ]
        return data
    }
}
