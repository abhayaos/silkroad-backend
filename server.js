const express = require('express')
const app = express()
const PORT = 5000


app.get("/", (req, res) => {
  console.log("Someone hit the root route /");
  res.send("Backend working 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;