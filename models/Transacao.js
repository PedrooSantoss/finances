export default class Transacao {
    constructor(descricao, valor, tipo) {
        this.id = this.gerarid();
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
    }
    gerarid() {
        return Math.floor(Math.random() * 1000);
    }
}
