import Link from 'next/link'
import React from 'react'
import styles from './page.module.css'

function page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Aperte abaixo para entrar nas suas finanças</h1>
      <Link href="/finances" className={styles.button}>
        Finanças
      </Link>
    </div>
  )
}

export default page
