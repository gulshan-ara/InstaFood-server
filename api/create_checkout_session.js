// api/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      // Assuming you send the products array in the request body
      const products = req.body;

      const lineItems = products.map((product) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.card?.info?.name, // Assuming product info is nested like this
          },
          unit_amount: product.card?.info?.price || product.card?.info?.defaultPrice,
        },
        quantity: product.quantity, // Make sure the product has a `quantity` property
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://your-success-url.com", // Update this with your success URL
        cancel_url: "https://your-cancel-url.com",   // Update this with your cancel URL
      });

      // Return the session ID to the frontend
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Stripe session creation failed:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
