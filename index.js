
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


  //--------logged user created----------Post by database-----------?
 
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


  //-----Cart-------Cullection------Post User by go database -------?
 

   //-----Cart-------Cullection------Delete User by go database -------?

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
