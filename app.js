  const express = require("express");
  const cors = require("cors");
  const mongoose = require("mongoose"); // <-- add this
  const app = express();
  // const PORT = 5000;
  // server.js
  const connectDb = require("./config/db");

  connectDb(); // ✅ works

  // Allow only your frontend URL
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173", // frontend dev URL 1
        "https://redpillnetwork.vercel.app", // frontend dev URL 2
        "https://triple6highway.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow request
      } else {
        callback(new Error("Not allowed by CORS")); // block request
      }
    },
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Hello World API
  app.get("/api/hello", (req, res) => {
    res.json({ message: "Yo message backend bata ho hai 🤣🤣!" });
  });
   
  
  app.get("/", (req, res) => {
    res.send("Hello World from Bhoot Wala Website muji!");
  });

app.get("/status", (req, res) => {
  res.json({
    success: true,
    messages: [
      "CHalooooooooo",
      "Backend chalyo mujiiii 🤣🤣!"
    ],
    time: new Date(),
  });
});

  // app.listen(PORT, () => {
  //   console.log(`Server running on http://localhost:${PORT}`);
  // });
  module.exports = app;