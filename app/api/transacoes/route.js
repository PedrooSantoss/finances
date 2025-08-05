import { NextResponse } from 'next/server'

let transacoes = [
  { id: 1, descricao: 'Salário', valor: 0, tipo: 'RECEITA' },
  { id: 2, descricao: 'Aluguel', valor: 0, tipo: 'DESPESA' },
]

export async function GET() {
  return NextResponse.json(transacoes)
}

export async function POST(request) {
  const dados = await request.json()
  const id = transacoes.length ? transacoes[transacoes.length - 1].id + 1 : 1

  if (!dados.descricao || !dados.valor || !dados.tipo) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const novaTransacao = {
    id,
    descricao: dados.descricao,
    valor: dados.valor,
    tipo: dados.tipo,
  }
  transacoes.push(novaTransacao)
  return NextResponse.json(novaTransacao)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))

  transacoes = transacoes.filter(t => t.id !== id)

  return NextResponse.json({ message: 'Excluído' })
}

export async function PUT(request) {
  const dados = await request.json()
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))

  const idx = transacoes.findIndex(t => t.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  }

  transacoes[idx] = { ...transacoes[idx], descricao: dados.descricao, valor: dados.valor }
  return NextResponse.json(transacoes[idx])
}
