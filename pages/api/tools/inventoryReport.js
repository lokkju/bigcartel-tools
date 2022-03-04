import btoa from "btoa-lite";
import { Parser } from 'json2csv';
import date from 'date-and-time';

const bigcartelFetch = async (authToken, url) => {
  let res = await fetch(url, {
    method:'GET',
    headers: {
      'Authorization': 'Basic ' + authToken,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'User-Agent': 'bigcartel-inventory-report'
    }
  });
  let data = await res.json();
  if(data.error || data.errors) {
    console.error(data)
    throw(data)
  }
  return data;
}

const getAllProducts = async (authToken, url) => {
  let allItems = [];
  while (url) {
    console.log(url)
    let data = await bigcartelFetch(authToken, url)
    let items = data.data.filter(word => word.type == "products").flatMap(product => product.relationships.options.data.map(item_rel => {
      let item = data.included.find(i => i.id == item_rel.id);
      return {
        // 'product_id': product.id,
        // 'option_id': item.id,
        product_name: product.attributes.name,
        option_name: item.attributes.name,
        status: product.attributes.status,
        quantity: item.attributes.quantity,
        peak_quantity: item.attributes.peak_quantity,
        sold: item.attributes.sold
      }
    }));
    Array.prototype.push.apply(allItems, items);
    if(data.links && data.links.next) {
      url = data.links.next
    } else {
      url = null
    }
  }
  return allItems;
}
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed', method: req.method })
    return
  }

  let authToken = btoa(req.body.sitename + ':' + req.body.password)
  try {
    let accounts = await bigcartelFetch(authToken, 'https://api.bigcartel.com/v1/accounts')
    let items = await getAllProducts(authToken, 'https://api.bigcartel.com/v1/accounts/' + accounts.data[0].id + '/products')

    if (req.body.soldOnly) {
      items = items.filter(x => x.sold > 0 )
    }
    if (items.length == 0) {
      res.status(500).json({message: 'No products matching your filters found'})
    }

    if (req.headers.accept === "application/json") {
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(items))
      res.end()
    } else {
      const parser = new Parser();
      let csv = parser.parse(items)
      let filename = 'bigcartel-inventory-report_' + accounts.data[0].id + '_' + date.format(new Date(),'YYYY-MM-DD-HH-mm-ss') + '.csv'
      res.setHeader('Content-Type', 'application/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.status(200).send(Buffer.from(csv))
      res.end()
    }
  } catch (ex) {
    console.error(ex)
    res.status(500).json(ex)
  }
}
