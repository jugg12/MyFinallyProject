const faker = require('faker')
const fs = require('fs')

const products = [...Array(30).keys()].map((_, i) => {
  const { productName, productDescription, price } = faker.commerce
  return {
    id: i + 1,
    title: productName(),
    description: productDescription(),
    price: price(),
    imageUrl: 'https://picsum.photos/300/300'
  }
})

const json = { products, orders: [] }

fs.writeFileSync('./db.json', JSON.stringify(json), 'utf-8', function(){
  console.log('File db.json was created')
});