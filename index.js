// This is your test secret API key.
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://instafood-nine.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Check if totalAmount is a valid number and >= 1
  if (!totalAmount || isNaN(totalAmount) || totalAmount < 1) {
    return res.status(400).send({ error: "Invalid or too low total amount" });
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Running on port 4242"));
