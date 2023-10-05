import Link from 'next/link'
import React from 'react'


function page() {
  return (
    <div>
      <h1>Aperte abaixo para entrar nas suas finanças</h1>
        <Link href="/finances">Finanças</Link>
    </div>
  )
}

export default page