import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/Home.module.css'
import localStyles from '../../styles/InventoryReport.module.css'

export default function InventoryReport() {
  return (
    <div className={styles.container}>
      <Head>
        <title>BigCartel Tools - Inventory Report</title>
        <meta name="description" content="Analytics Tools for BigCartel Stores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form className={styles.main} action="/api/tools/inventoryReport" method="POST" target="_blank">
        <h1 className={styles.title}>
          Store Inventory Report
        </h1>

        <div className={styles.grid}>
          <formGroup className={localStyles.inputGroup}>
            <label htmlFor="sitename">Site Name</label>
            <input id="sitename" name="sitename" type="text" autoComplete="sitename" required />
          </formGroup>
          <formGroup className={localStyles.inputGroup} >
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </formGroup>
          <button type="submit">Generate Report</button>
        </div>
      </form>

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
