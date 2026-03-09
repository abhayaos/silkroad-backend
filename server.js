const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8173;

const allowedOrigins = [
  "http://localhost:5173",   // Vite React
  "http://localhost:3000",   // CRA React
  "https://yourfrontend.vercel.app" // production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / curl

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is running 🚀"
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;