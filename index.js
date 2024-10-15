const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies (if you need it in other parts of the app)
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
