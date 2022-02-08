import btoa from "btoa-lite";
import { Parser } from 'json2csv';
import date from 'date-and-time';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  let authToken = btoa(req.body.sitename + ':' + req.body.password)

  let accountsResponse = await fetch('https://api.bigcartel.com/v1/accounts', {
    method:'GET',
    headers: {
      'Authorization': 'Basic ' + authToken,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'User-Agent': 'bigcartel-inventory-report'
    }
  });
  let accounts = await accountsResponse.json();
  if(accounts.error || accounts.errors) {
    res.status(500).json(accounts)
  }

  let productResponse = await fetch('https://api.bigcartel.com/v1/accounts/' + accounts.data[0].id + '/products', {
    method:'GET',
    headers: {
      'Authorization': 'Basic ' + authToken,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'User-Agent': 'bigcartel-inventory-report'
    }
  });
  let products = await productResponse.json();
  if(products.error || products.errors) {
    res.status(500).json(products)
  }
  let items = products.data.filter(word => word.type == "products").flatMap(product => product.relationships.options.data.map(item_rel => {
  let item = products.included.find(i => i.id == item_rel.id);
    return {
      // 'product_id': product.id,
      // 'option_id': item.id,
      'product_name': product.attributes.name,
      'option_name': item.attributes.name,
      'status': product.attributes.status,
      'quantity': item.attributes.quantity,
      'peak_quantity': item.attributes.peak_quantity,
      'sold': item.attributes.sold
    }
  }));

  const parser = new Parser();
  let csv = parser.parse(items)
  let filename = 'bigcartel-inventory-report_' + accounts.data[0].id + '_' + date.format(new Date(),'YYYY-MM-DD-HH-mm-ss') + '.csv'
  res.setHeader('Content-Type', 'application/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.status(200).send(Buffer.from(csv))
}
