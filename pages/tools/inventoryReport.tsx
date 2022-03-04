import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import date from 'date-and-time'
import { useState } from 'react';
import { useForm } from '@mantine/hooks';
import {
  Container,
  Table,
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
  useMantineTheme,
} from '@mantine/core';
import { toCsv } from '@iwsio/json-csv-core'

export default function InventoryReport() {

  const [loading, setLoading] = useState(false);
  const [items,setItems] = useState(null);
  const [error, setError] = useState<string>(null);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      sitename: '',
      password: '',
      soldOnly: false,
    },

    validationRules: {
      sitename: (value) => /^\S+[^\.]$/.test(value),
    },

    errorMessages: {
      sitename: 'Invalid Site Name',
    },
  });

  const ths = (
      <tr>
        <th>Product Name</th>
        <th>Option Name</th>
        <th>Quantity</th>
        <th>Sold</th>
      </tr>
  );

  const itemsToRows = (items) => items.map((item) => (
    <tr key={item.product_name + item.option_name}>
      <td>{item.product_name}</td>
      <td>{item.option_name}</td>
      <td>{item.quantity}</td>
      <td>{item.sold}</td>
    </tr>
  ));

  const resetForm = () => {
    setLoading(true);
    setError(null);
    setItems(null);
    setLoading(false);
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  };

  const exportToJson = e => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(items),
      fileName: 'bigcartel_item_export.json',
      fileType: 'text/json',
    })
  }

  const exportToCsv = e => {
    e.preventDefault()
    const options = {
      fields: [
        {name: 'product_name'},
        {name: 'option_name'},
        {name: 'status'},
        {name: 'quantity'},
        {name: 'peak_quantity'},
        {name: 'sold'}
      ]
    }
    console.log(toCsv(items,options))
    downloadFile({
      data: toCsv(items,options),
      fileName: 'bigcartel_item_export.csv',
      fileType: 'text/csv',
    })
}
  const handleSubmit = async (values: typeof form['values']) => {
    setLoading(true);
    setError(null);
    setItems(null);

    const data = {
      sitename: values.sitename,
      password: values.password,
      soldOnly: values.soldOnly
    }
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/tools/inventoryReport'

    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }
    try {
      const response = await fetch(endpoint, options)
      const result = await response.json()
      if(result.error) {
        setError(result.error)
      } else if (result.message) {
        setError(result.message)
      } else {
        setItems(result)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false);
  };

  return (
    <Group position="center" direction="column">
      { (!items || items.length == 0) && <Paper
        padding="lg"
        shadow="sm"
        style={{
          position: 'relative',
          minWidth: '400px',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        }}
      >
        <Head>
          <title>BigCartel Tools - Inventory Report</title>
          <meta name="description" content="Analytics Tools for BigCartel Stores" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

          <h3>
            Store Inventory Report
          </h3>

          <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={loading} />
          <TextInput
            mt="md"
            required
            label="sitename"
            placeholder="bigcartel_site_name"
            {...form.getInputProps('sitename')}
          />
          <PasswordInput
            mt="md"
            required
            label="password"
            placeholder="password"
            {...form.getInputProps('password')}
          />
          <Checkbox
            mt="xl"
            label="Sold Only"
            {...form.getInputProps('soldOnly', { type: 'checkbox' })}
          />

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

           <Group position="apart" mt="xl">
             <Button color="blue" type="submit">
               Generate Report
             </Button>
           </Group>
          </form>
      </Paper>}

    { items && items.length > 0 &&
        <Group style={{ display: "inline-flex", marginRight: 0, marginLeft: "auto"}}>
          <Container>Total Items: {items.length}</Container>
          <Button color="blue" onClick={(e) => exportToCsv(e)}>Download as CSV</Button>
          <Button color="blue" onClick={(e) => exportToJson(e)}>Download as JSON</Button>
          <Button color="red" onClick={() => resetForm()}>Reset</Button>
        </Group>
    }
    { items && items.length > 0 &&
      <Table captionSide="bottom" striped highlightOnHover>
      <caption>Items</caption>
      <thead>{ths}</thead>
      <tbody>{itemsToRows(items)}</tbody>
      <tfoot>{ths}</tfoot>
    </Table>
  }
    </Group>
  )
}
