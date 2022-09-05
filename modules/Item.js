const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  tags: { type: [String], required: true },
  owner_id: { type: String, required: true },
  parent_id: { type: String, required: true },
  required_number: {
    type: [
      {
        name: String,
        value: String,
      },
    ],
    required: true,
  },
  required_title: {
    type: [
      {
        name: String,
        value: String,
      },
    ],
    required: true,
  },
  required_description: {
    type: [
      {
        name: String,
        value: String,
      },
    ],
    required: true,
  },
  required_date: {
    type: [
      {
        name: String,
        value: String,
      },
    ],
    required: true,
  },
  required_checkbox: {
    type: [
      {
        name: String,
        value: Boolean,
      },
    ],
    required: true,
  },
  comments: {
    type: [
      {
        owner_id: String,
        text: String,
      },
    ],
    required: true,
  },
  likes: {
    type: [
      {
        owner_id: String,
      },
    ],
    required: true,
  },
});

module.exports = model("Item", schema);
