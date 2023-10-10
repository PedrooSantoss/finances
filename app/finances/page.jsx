"use client"
import { useState } from 'react'
import styles from './finances.module.css'
import Transacao from '/models/Transacao'
import ListaTransacoes from '/models/ListaTransacoes'
import Link from 'next/link'
const listaTransacoes = new ListaTransacoes();

function Finances() {
    // Inputs
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');

    // Edição
    const [flag, setFlag] = useState(0);
    const [editButton, setEditButton] = useState(false);

    //dados da classe
    const [lista, setLista] = useState(listaTransacoes.getTodasTransacoes());
    const [saldo, setSaldo] = useState(listaTransacoes.saldo);
    const [receitas, setReceitas] = useState(listaTransacoes.receitas);
    const [despesas, setDespesas] = useState(listaTransacoes.despesas);
    //adicionar receita
    
    const addReceita = () => {
        //console.log("receita")
        const transacao = new Transacao(description, value, "Receita");
        // console.log(transacao);

        listaTransacoes.adicionarTransacao(transacao);
        atualizarValores();

    }

    const addDespesa = () => {
        // console.log("despesa");
        const transacao = new Transacao(description, value, "Despesas");
        // console.log(transacao);

        listaTransacoes.adicionarTransacao(transacao);
        atualizarValores();
    }
    const atualizarValores = () => {
        setLista(listaTransacoes.getTodasTransacoes());
        setSaldo(listaTransacoes.saldo);
        setReceitas(listaTransacoes.receitas);
        setDespesas(listaTransacoes.despesas);
        setDescription('');
        setValue('');
    }

    const exclude = (id) => {
        listaTransacoes.excluirTransacao(id);
        atualizarValores();
    }

    const edit = (id) => {
        const transacao = listaTransacoes.getTransacaoporId(id);

        if (transacao) {
            setDescription(transacao.descricao);
            setValue(transacao.valor);

            setFlag(id);
            setEditButton(true);
        }
    }

    const atualizar = () => {
        listaTransacoes.updateTransacao(flag, description, value);

        setDescription('');
        setValue('');
        
        atualizarValores();
        setEditButton(false);
        setFlag(0);
    }
    return (
        <>
        <div>

        </div>
            <div className={styles.container}>
            
                <div className={styles.profile}>
                <Link href="/">Home</Link>
                    
                    <p className={styles.welcome}>Olá, Pedro</p>
                    <p className={styles.useremail}>pedro.miguel@aluno.senai.br</p>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.mainheader}>
                    <p className={styles.title}>Dashboard</p>
                    <div className={styles.transaction}>
                        <div className={styles.description}>
                            <input
                                className={styles.inputdescription}
                                value={description}
                                type="text"
                                name='description'
                                placeholder='Descrição'
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input className={styles.inputdescription}
                                value={value}
                                type="number"
                                name='description'
                                placeholder='Valor (R$)'
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className={styles.type}>
                            {
                                editButton ? (
                                    <button className={styles.buttonAtualizar} onClick={atualizar} >Atualizar</button>
                                ) : (
                                    <>
                                        <button className={styles.buttonreceita} onClick={addReceita}>Receita</button>
                                        <button className={styles.buttondespesa} onClick={addDespesa}>Despesa</button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.infos}>
                    <div className={styles.cardSaldo}>
                        <p className={styles.cardTitle}>Saldo</p>
                        <p className={styles.cardValue}>R$ {saldo}</p>
                    </div>
                    <div className={styles.cardReceitas}>
                        <p className={styles.cardTitle}>Receitas</p>
                        <p className={styles.cardValue}>R$ {receitas}</p>
                    </div>
                    <div className={styles.cardDespesas}>
                        <p className={styles.cardTitle}>Despesas</p>
                        <p className={styles.cardValue}>R$ {despesas}</p>
                    </div>
                </div>
                <div className={styles.registros}>
                    <div className={styles.registrosreceitas}>
                        <p className={styles.registrosreceitastitle}>Receitas Registradas</p>
                        <div className={styles.registrosreceitaslist}>
                        {
                lista.map((transacao, index) => (
                  transacao.tipo == "Receita" && (
                    <div key={transacao.id} className={styles.registrosreceitasitem}>
                      <p className={styles.registrosreceitasitemdescription}>{transacao.descricao}</p>
                      <p className={styles.registrosreceitasitemvalue}>R$: {transacao.valor}</p>

                      <div className = {styles.actions}> 
                      <button className = {styles.actionsbutton} onClick={() => exclude(transacao.id)}> Excluir </button>
                      <button className = {styles.actionsbutton} onClick={() => edit(transacao.id)}> Editrar </button>
                    </div>
                    
                    </div>
                  )
                ))
              }
                        </div>

                    </div>
                    <div className={styles.registrosdespesas}>
                        <p className={styles.registrosdespesastitle}>Despesas Registradas</p>
                        <div className={styles.registrosdespesaslist}>
                        {
                lista.map((transacao, index) => (
                  transacao.tipo == "Despesas" && (
                    <div key={transacao.id} className={styles.registrosdespesasitem}>
                      <p className={styles.registrosreceitasitemdescription}>{transacao.descricao}</p>
                      <p className={styles.registrosdespesasitemvalue}>R$: {transacao.valor}</p>
                  
                  <div className = {styles.actions}> 
                      <button className = {styles.actionsbutton} onClick={() => exclude(transacao.id)}> Excluir </button>
                      <button className = {styles.actionsbutton} onClick={() => edit(transacao.id)}> Editrar </button>
                  </div>
                    
                    </div>


                  )
                ))
              }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Finances