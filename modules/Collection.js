const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  theme: { type: String, required: true },
  owner_id: { type: String, required: true },
  addition_number: { type: [String], required: true },
  addition_title: { type: [String], required: true },
  addition_description: { type: [String], required: true },
  addition_date: { type: [String], required: true },
  addition_checkbox: { type: [String], required: true },
  // image (optional): image,
});

module.exports = model("Collection", schema);
