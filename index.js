const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(bodyParser.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhub4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send(`<h3>Hello Node js.....!!</h3>`)
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER_COLLECTION}`);
  
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
        console.log(result)
        res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })


  app.post('/productsByKeys', (req, res) => {
      const productsKey = req.body;
      productCollection.find({key: {$in: productsKey} })
      .toArray((err, documents) => {
          res.send(documents)
      }) 
  })



  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
    })
  })


  console.log('Database connected')
});


app.listen( process.env.PORT || 5000)