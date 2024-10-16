require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware to parse JSON request bodies (if you need it in other parts of the app)
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:1234", "https://checkout.stripe.com"],
  })
);

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
          name: product.card?.info?.name, 
        },
        unit_amount: Math.round(
          product.card?.info?.price || product.card?.info?.defaultPrice
        ),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`
    });

    res.send({clientSecret: session.client_secret});

  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
