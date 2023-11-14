const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3002;
app.use(express.json());
// Create Product schema

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Create product model

const product = mongoose.model("products", productsSchema);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB");
    console.log("Db is  connected");
  } catch (error) {
    console.log("Db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

//route

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/products", async (req, res) => {
  try {
    const products = await product.find();
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send({
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const productItem = await product.findOne({ _id: id });

    // const productItem = await product
    //   .findOne({ _id: id })
    //   .select({ title: 1, _id: 0 });

    //   select diya mane hoitese je ki ki dekhte chai amra 1 mane dekhabe r 0 mane dekhabe nah

    if (productItem) {
      res.status(200).send(productItem);
    } else {
      res.status(404).send({
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = new product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });

    const productData = await newProduct.save();
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }

  res.send("hello");
});

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});
