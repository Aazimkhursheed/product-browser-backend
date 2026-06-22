const express = require("express");
require("dotenv").config();

const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Browser API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});