const express = require("express");
const app = express();
const port = 3000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/create-checkout-session", async (req, res) => {
  const products = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.card?.info?.name,
      },
      unit_amount:
        product.card?.info?.price || product.card?.info?.defaultPrice,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    successUrl: "",
    cancelUrl: "",
  });

  res.json({ id: session.id });

  res.send({
    message: "New user was added to the list",
  });
});
