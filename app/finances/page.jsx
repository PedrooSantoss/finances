"use client"
import { useState, useEffect } from 'react'
import styles from './finances.module.css'
import Link from 'next/link'

function Finances() {
  // Inputs
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')

  // Edição
  const [flag, setFlag] = useState(null) // id da transação para editar
  const [editButton, setEditButton] = useState(false)

  // Dados da API
  const [lista, setLista] = useState([])
  const [saldo, setSaldo] = useState(0)
  const [receitas, setReceitas] = useState(0)
  const [despesas, setDespesas] = useState(0)
  const [loading, setLoading] = useState(true)

  // Busca todas as transações da API e atualiza estados de resumo
  async function carregarTransacoes() {
    setLoading(true)
    try {
      const res = await fetch('/api/transacoes')
      if (!res.ok) throw new Error('Erro ao buscar transações')
      const dados = await res.json()
      if (!Array.isArray(dados)) throw new Error('Resposta não é array')

      setLista(dados)

      // Calcular saldo, receitas e despesas
      let r = 0, d = 0
      dados.forEach(t => {
        if (t.tipo === 'RECEITA') r += t.valor
        else if (t.tipo === 'DESPESA') d += t.valor
      })
      setReceitas(r.toFixed(2))
      setDespesas(d.toFixed(2))
      setSaldo((r - d).toFixed(2))
    } catch (err) {
      console.error(err)
      setLista([])
      setReceitas(0)
      setDespesas(0)
      setSaldo(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarTransacoes()
  }, [])

  // Criar nova transação
  async function adicionarTransacao(tipo) {
    if (!description || !value) return alert('Preencha descrição e valor')

    await fetch('/api/transacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descricao: description,
        valor: parseFloat(value),
        tipo: tipo === 'Receita' ? 'RECEITA' : 'DESPESA',
      }),
    })

    setDescription('')
    setValue('')
    carregarTransacoes()
  }

  // Excluir transação
  async function excluir(id) {
    await fetch(`/api/transacoes/${id}`, { method: 'DELETE' })
    carregarTransacoes()
  }

  // Editar: buscar dados da transação para preencher inputs
  function editar(id) {
    const t = lista.find(item => item.id === id)
    if (t) {
      setDescription(t.descricao)
      setValue(t.valor)
      setFlag(id)
      setEditButton(true)
    }
  }

  // Atualizar transação (PUT)
  async function atualizar() {
    if (!description || !value) return alert('Preencha descrição e valor')

    await fetch(`/api/transacoes/${flag}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descricao: description,
        valor: parseFloat(value),
      }),
    })

    setDescription('')
    setValue('')
    setFlag(null)
    setEditButton(false)
    carregarTransacoes()
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <Link href="/" className={styles.homeButton}>Home</Link>
        <p className={styles.welcome}>Olá, Pedro</p>
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
                placeholder="Descrição"
                onChange={e => setDescription(e.target.value)}
              />
              <input
                className={styles.inputdescription}
                value={value}
                type="number"
                placeholder="Valor (R$)"
                onChange={e => setValue(e.target.value)}
              />
            </div>
            <div className={styles.type}>
              {editButton ? (
                <button className={styles.buttonAtualizar} onClick={atualizar}>Atualizar</button>
              ) : (
                <>
                  <button className={styles.buttonreceita} onClick={() => adicionarTransacao('Receita')}>Receita</button>
                  <button className={styles.buttondespesa} onClick={() => adicionarTransacao('Despesa')}>Despesa</button>
                </>
              )}
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
            {loading ? (
              <p>Carregando receitas...</p>
            ) : (
              <div className={styles.registrosreceitaslist}>
                {lista
                  .filter(t => t.tipo === 'RECEITA')
                  .map(transacao => (
                    <div key={transacao.id} className={styles.registrosreceitasitem}>
                      <p className={styles.registrosreceitasitemdescription}>{transacao.descricao}</p>
                      <p className={styles.registrosreceitasitemvalue}>R$: {transacao.valor}</p>
                      <div className={styles.actions}>
                        <button className={styles.actionsbutton} onClick={() => excluir(transacao.id)}>Excluir</button>
                        <button className={styles.actionsbutton} onClick={() => editar(transacao.id)}>Editar</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className={styles.registrosdespesas}>
            <p className={styles.registrosdespesastitle}>Despesas Registradas</p>
            {loading ? (
              <p>Carregando despesas...</p>
            ) : (
              <div className={styles.registrosdespesaslist}>
                {lista
                  .filter(t => t.tipo === 'DESPESA')
                  .map(transacao => (
                    <div key={transacao.id} className={styles.registrosdespesasitem}>
                      <p className={styles.registrosreceitasitemdescription}>{transacao.descricao}</p>
                      <p className={styles.registrosdespesasitemvalue}>R$: {transacao.valor}</p>
                      <div className={styles.actions}>
                        <button className={styles.actionsbutton} onClick={() => excluir(transacao.id)}>Excluir</button>
                        <button className={styles.actionsbutton} onClick={() => editar(transacao.id)}>Editar</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Finances