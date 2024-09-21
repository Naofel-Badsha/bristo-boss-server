
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config();
//------Stripe-----
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
  //----------Database---name---&-----Collection--------
  const paymentCollection = client.db("bistroDb").collection("payments");


  //--------jwt-------related--------Api-------
  //---------------Created----a----token------
  app.post('/jwt', async(req, res) => {
    const user = req.body;
     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'});
     res.send({token})
  })

   //------Create----a---token--middlewares---&----User----------
   const verifyToken = (req, res, next) => {
    console.log('inside verify token', req.headers.authorization);
    if(!req.headers.authorization){
      return res.status(401).send({message: 'unauthorized access'});
    }
    const token = req.headers.authorization.split(' ')[1];
    //-------VerifyToken-------
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if(err){
        return res.status(401).send({message: 'unauthorized access'});
      }
      req.decoded = decoded;
      next();
    })
   }
   

  //-------User-------Admin-------Related---------Api---------
  //-----use verify admin after verifyToken-----
    const verifyAdmin = async(req, res, next) =>{
    const email = req.decoded.email;
    const query = {email: email};
    const user = await userCollection.findOne(query);
    const isAdmin = user?.role === 'admin';
    if(!isAdmin){
      return res.status(403).send({message: 'forbidden access'});
    }
    next();
  }
  
  
  //------------Get-------All-----Users--------
   app.get('/users', verifyToken, verifyAdmin, async(req, res) => {
    //----token daker jonno------
    // console.log(req.headers);
    const result = await userCollection.find().toArray();
    res.send(result)
   })

  //----User---Admin----email---Get---checked---and---hide---dashboard----
  app.get('/users/admin/:email', verifyToken, async(req, res) => {
    const email = req.params.email;
    if(email !== req.decoded.email){
    return res.status(403).send({message: 'forbidden access'}) 
    }
    const query = {email: email};
    const user = await userCollection.findOne(query);
    let admin = false;
    if(user){
     admin = user?.role === 'admin';
    }
    res.send({admin})
 });

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
  });


  //------Make---User-------Admin-------patch-------
  app.patch('/users/admin/:id', verifyToken, verifyAdmin, async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateDoc = {
      $set: {
        role: 'admin'
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

  //------------Delete-------A-------Users--------
  app.delete('/users/:id', verifyToken, verifyAdmin, async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);
  })
  //----***----User------Cullection--------Api--------End----***------?





  //----***-------Menu--------items--------Start-----------
  //-------see single menu-item----------get by database -------?
   app.get("/menu/:id", async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await menuCollection.findOne(query);
    res.send(result);
  });

   //-------see all menu-item----------get by database -------?
   app.get('/menu',  async(req, res) =>{
      const result = await menuCollection.find().toArray();
      res.send(result);
   });

   //-------menu-item----------Post by database -------?
   app.post('/menu', verifyToken, verifyAdmin, async(req, res) => {
    // const item = req.body;
    const item = req.body;
    const result = await menuCollection.insertOne(item)
    res.send(result)
   })

  //-------menu-item----------Update by database -------?
  app.patch('/menu/:id', async(req, res) => {
    // const item = req.body;
    const item = req.body;
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const updateDoc = {
      $set: {
        name: item.name,
        category: item.category,
        price: item.price,
        recipe: item.recipe,
        image: item.image
      }
    }
    const result = await menuCollection.updateOne(filter, updateDoc)
    res.send(result)
  })



  //------deleted----menu------
  app.delete('/menu/:id', verifyToken, verifyAdmin, async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await menuCollection.deleteOne(query);
    res.send(result)
  })




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



  //------Payment----intent--------Api--------Start-----
  //--------Post------Strip-----payment-intent---------
  app.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    console.log(amount, 'amount inside a payment the intent')
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      payment_method_types: ["card"]
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  //-------payment---details-----Get-by-----database----
  app.get('/payments/:email', verifyToken, async(req, res) => {
    const query = {email: req.params.email}
    if(req.params.email !== req.decoded.email){
      return res.status(403).send({message: 'forbidden access'})
    }
    const result = await paymentCollection.find(query).toArray()
   res.send(result)
  })


  //-------payment---details-----post-by-----database----
  app.post('/payments', async(req, res) =>{
    const payment = req.body;
    const paymentResult = await paymentCollection.insertOne(payment);
    //-------carefully delete each item from the cart--
    console.log('payment complite', payment)
    const query = {_id: {
      $in: payment.cartIds.map(id => new ObjectId(id))
    }};
    const deleteResult = await cartCollection.deleteMany(query);
    res.send({paymentResult, deleteResult});
  })






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
