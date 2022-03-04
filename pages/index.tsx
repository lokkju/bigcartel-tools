import Link from "next/link"
import { Paper, SimpleGrid } from '@mantine/core';

export default function Home() {
  return (
    <SimpleGrid cols={2}>
      <Paper
        padding="xl"
        shadow="xl"
      >
        <Link href="/tools/inventoryReport">
          <a className=''>
            <h2>Inventory Report &rarr;</h2>
            <p>An inventory report of your products</p>
          </a>
        </Link>
      </Paper>
      <Paper
        padding="xl"
        shadow="xl"
      >
        <Link href="/contact">
          <a className=''>
            <h2>Request Tools</h2>
            <p>
              Request a custom BigCartel tool!
            </p>
          </a>
        </Link>
      </Paper>
    </SimpleGrid>
  )
}
