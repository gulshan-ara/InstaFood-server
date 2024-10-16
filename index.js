require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware to parse JSON request bodies (if you need it in other parts of the app)
app.use(express.json());
app.use(cors());

// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create_checkout_session", async (req, res) => {
  try {
    const products = req.body.products;
    console.log(products);

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.card?.info?.name, // Assuming product info is nested like this
        },
        unit_amount:
          Math.round(product.card?.info?.price || product.card?.info?.defaultPrice),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://your-success-url.com", // Update this with your success URL
      cancel_url: "https://your-cancel-url.com", // Update this with your cancel URL
    });

    // Return the session ID to the frontend
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;