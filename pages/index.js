import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>BigCartel Tools</title>
        <meta name="description" content="Analytics Tools for BigCartel Stores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Analytics tools for BigCartel Stores
        </h1>

        <div className={styles.grid}>
          <Link href="/tools/inventoryReport">
            <a className={styles.card}>
              <h2>Inventory Report &rarr;</h2>
              <p>An inventory report of your products</p>
            </a>
          </Link>

          <a
            href="/contact" className={styles.card}>
            <h2>Request Tools</h2>
            <p>
              Request a custom BigCartel tool!
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/lokkju" taget="_blank" rel="noopener noreferrer">Written by lokkju</a>
        {''}
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
