
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000

//--------middelware---
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8tunxxp.mongodb.net/?retryWrites=true&w=majority`;
//const uri = "mongodb+srv://<username>:<password>@cluster0.8tunxxp.mongodb.net/?retryWrites=true&w=majority";

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

  //----------Database---name---&-----Collection--------
  const userCollection = client.db("bistroDb").collection("users");
  //----------Database---name---&-----Collection--------
  const menuCollection = client.db("bistroDb").collection("menu");
  //----------Database---name---&-----Collection--------
  const reviewCollection = client.db("bistroDb").collection("reviews");
  //----------Database---name---&-----Collection--------
  const cartCollection = client.db("bistroDb").collection("carts");

  //------jwt-----related------Api-------
  





   

  //----***----User------Cullection--------Api--------Start----***------?
  //--------logged user Admin----------Patch/Update to database-----------?
  // VerifyToken, verifyAdmin,


  //--------logged user created----------Delete to database-----------?
  // VerifyToken, verifyAdmin,


  

  //--------logged user created----------Get to database-----------?
  // VerifyToken, verifyAdmin,



  //-------User-------Admin-------Related---------Api---------
  //------------Get-------All-----Users--------
   app.get('/users', async(req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result)
   })

  //--------logged user created----------Post by database-----------?
  app.post('/users', async(req, res) => {
    const user = req.body;
    //-----insert email if user doesnt exists:
    //------you can do this many ways (1. email unique, 2.upsert 3. siple checking)
     const query = {email: user.email}
     const existingUser = await userCollection.findOne(query);
     if(existingUser){
      return res.send({message: 'user already existing', insertedId: null})
     }
    const result = await userCollection.insertOne(user);
    res.send(result)
  })
 
  //----***----User------Cullection--------Api--------End----***------?





  //----***-------Menu--------items--------Start-----------
  //-------see all menu-item----------get by database -------?
   app.get('/menu', async(req, res) =>{
      const result = await menuCollection.find().toArray();
      res.send(result);
   });

  //-------see all Client-reviews----------get by database -------?
  app.get('/reviews', async(req, res) =>{
    const result = await reviewCollection.find().toArray();
    res.send(result);
 });


  //----***-------Menu--------items--------End-----------



  //----***----Cart------Cullection--------Api--------Start-----***-----?
  //-----Cart-------Cullection------Get User & user product add cart  by see database -------?
   app.get('/carts', async(req, res) => {
    const email = req.query.email;
    const query = {email: email}
    const result = await cartCollection.find(query).toArray();
    res.send(result)
   })

  //-----Cart-------Cullection------Post User by go database -------?
  app.post('/carts', async(req, res) => {
    const cartItem = req.body;
    const result = await cartCollection.insertOne(cartItem);
    res.send(result);
  })

  //-----Cart-------Cullection------Delete User by go database -------?
  app.delete('/carts/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await cartCollection.deleteOne(query);
    res.send(result)
  })
  //---***-----Cart------Cullection--------Api--------End----***------?



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send(' Bristo  boss is Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/** 
 * ---------------------------------
 *       Naming  Convention
 * ---------------------------------
 * app.get('/users')cartCollection.find().toArray();
 * app.get('/users/:id')
 * app.post('/users')cartCollection.insertOne();
 * app.put('/users/:id')
 * app.patch('/users/:id')userCollection.updateOne(filter, updateDoc)
 * app.delete('/users/:id')cartCollection.deleteOne(query)
*/
