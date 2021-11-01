const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whajw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travel");

    const packgesCollection = database.collection("packges");
    const servicesCollection = database.collection("services");
    const galleryCollection = database.collection("gallery");
    const orderCollection = database.collection("book");

    app.get("/packges", async (req, res) => {
      const cursor = packgesCollection.find({});
      const packges = await cursor.toArray();
      res.send(packges);
    });
    // GET Single package
    app.get("/packges/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific package", id);
      const query = { _id: ObjectId(id) };
      const packge = await packgesCollection.findOne(query);
      res.json(packge);
    });
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find({});
      const gallery = await cursor.toArray();
      res.send(gallery);
    });

    //booking
    app.post("/book", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travel server is running");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});
