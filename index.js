const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydthzao.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const serviceCollection = client.db("housetoyes").collection("carhouse");
    const toyCollection = client.db("housetoyes").collection("toybooking");

    //
    app.get("/carhouse", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //
    app.get("/carhouse/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
       
        projection: { category_title: 1, price: 1, ratings: 1, img: 1 },
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });

    // toy bookings
    app.get("/toybooking", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/toybooking", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await toyCollection.insertOne(booking);
      res.send(result);
    });

    //Delate

app.patch("/toybooking/:id", async(req, res) =>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const updatedBookingToy = req.body;
  console.log(updatedBookingToy);
  const updateDoc = {
    $set: {
        status: updatedBookingToy.status
    },
};
const result = await toyCollection.updateOne(filter, updateDoc);
  res.send(result);
})



    app.delete("/toybooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result)
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("happy toy house is running");
});

app.listen(port, () => {
  console.log(`happy toy house Server is running on port ${port}`);
});
