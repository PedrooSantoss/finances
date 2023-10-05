export default class ListaTransacoes{
    constructor(){
        this.transacoes = [];
        this.saldo = 0;
        this.receitas = 0;
        this.despesas = 0;
    }
    adicionarTransacao(transacao){
        this.transacoes.push(transacao);

        this.atualizarvalores();

    }
    
    getTodasTransacoes(){
        return this.transacoes;
    }

    
    getTransacaoporId(id){
        return this.transacoes.find((transacao) => transacao.id == id);
    }

    
    excluirTransacao(id){
        const listaTransacoes = (this.transacoes = this.transacoes.filter((transacao) => transacao.id != id
        ));
       

        this.atualizarvalores();
        
        return listaTransacoes;
    }

    updateTransacao(id, descricao, valor){
        const transacao = this.getTransacaoporId(id);
        
        transacao.descricao = descricao;
        transacao.valor = valor;

        this.atualizarvalores();

        return transacao;
    }


    atualizarvalores(){
        this.saldo = 0;
        this.receitas = 0;
        this.despesas = 0;

        this.transacoes.map((transacao =>{
            if(transacao.tipo == 'Receita'){
                this.receitas = Number(transacao.valor) + Number(this.receitas)
            }else{
                this.despesas = Number(transacao.valor) + Number(this.despesas)
            }
        }))
        this.saldo = this.receitas - this.despesas;
    }
}