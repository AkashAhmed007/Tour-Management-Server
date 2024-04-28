const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Tourism Management Server is Running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jp6bbe4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const addSpot = client.db('addSpotDB').collection('addedSpot')

    app.get('/addspot', async(req,res)=>{
      const cursor = addSpot.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/addspot/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addSpot.findOne(query)
      res.send(result)
    })
    app.post('/addspot', async(req,res)=>{
      const addspot = req.body
      const result = await addSpot.insertOne(addspot)
      res.send(result)
    })
    app.get('/updatespot', async(req,res)=>{
      const cursor = addSpot.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/updatespot/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addSpot.findOne(query)
      res.send(result)
    })

  app.put('/updatespot/:id',async(req,res)=>{
      const id = req.params.id
      const places = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedPlace = {
        $set:{
          countryName:places.countryName,
          spotName:places.spotName,
          location:places.location,
          cost:places.cost,
          season:places.season,
          time:places.time,
          visitor:places.visitor,
          email:places.email,
          image:places.image
        }
      }

      const result = await addSpot.updateOne(filter,updatedPlace,options)
      res.send(result)
  })


    app.delete('/addspot/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addSpot.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`Server is Running on port ${port}`)
})

