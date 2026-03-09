const express = require('express');
const app = express();

const PORT = process.env.PORT || 8173;

app.get('/', (req, res) => {
  res.send('API running');
});

// 404 handler (works for ALL routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;