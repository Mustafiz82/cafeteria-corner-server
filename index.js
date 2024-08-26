const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5144;
// import express
// import cors
// create app  
// create port


app.use(cors());
app.use(express.json());




// use cors for middleware without using you can't access server
// The express.json() middleware is used to parse incoming JSON requests


app.get("/", (req, res) => {
    res.send("simple crud is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mustafiz8260:zUYG6Jz3Ppr0riQS@cluster0.beztx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        const database = client.db("CafeteriaDB");
        const foodCollection = database.collection("Food");
        const orderCollection = database.collection("Order");



        app.post("/foods", async (req, res) => {
            const food = req.body;
            console.log(food);
            const result = await foodCollection.insertOne(food);
            res.send(result);
          });


        app.post("/orders", async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
          });


        app.get("/foods" , async(req , res ) => {
            
            const result = await foodCollection.find().toArray()
            res.send(result)
        })

        app.get("/orders" ,async(req , res) => {

            const email = req?.query?.email
            
            const query = {email : email}

            const orderData = await orderCollection.find(query).toArray()

            console.log(orderData)


            const result = await Promise.all(
                orderData.map(async (item) => {
                  const productQuery = { _id: new ObjectId(item?.ProductID) };
                  const object = await foodCollection.findOne(productQuery);
                  return { date:item?.date , quantity: item?.quantity ,...object };
                })
              );

           res.send(result)
        })
          



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// server will respond with this text


app.listen(port, () => {
    console.log(`simple crud is running on ${port}`);
});


// start the server in the provided port
// mustafiz8260
// zUYG6Jz3Ppr0riQS