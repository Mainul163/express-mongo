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
    required: [true, "product title is required"],
  },
  price: {
    type: Number,
    required: true,
  },
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

// post data

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

app.get("/products", async (req, res) => {
  try {
    const products = await product.find();

    // const products = await product.find({ price: { $gt: 400 } });

    // multiple value
    // const products = await product.find({ price: { $in: [400,200,900] } });

    //and operator
    // const products = await product.find({$and:[{ price: { $gt: 400 } }, { rating: { $gt: 300 } }]})

    // const products =await product.find().countDocuments();[ koyta document ase ]
    // const products =await product.find().sort({ price: 1});[ascending order =choto theke boro, -1 decending ]
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

// delete

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productDelete = await product.deleteOne({ _id: id }); //findByIdAndDelete({})
    if (productDelete) {
      res.status(200).send({
        success: true,
        message: "deleted single product",
        data: productDelete,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});
// update

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateProduct = await product.updateOne(
      //findByIdAndUpdate({})
      { _id: id },
      {
        $set: {
          price: req.body.price,
        },
      },
      { new: true }
    );

    if (updateProduct) {
      res.status(200).send({
        success: true,
        message: "updated single product",
        data: updateProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "products not updated with this id",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});
