const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/users', require('./routes/users.routes'))
app.use('/api/collections', require('./routes/collection.routes'))
app.use('/api/items', require('./routes/item.routes'))

const PORT = process.env.PORT || config.get("port") || 5000;

async function start() { 
  try {
    await mongoose.connect(config.get("mongoUri"));
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
    
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
