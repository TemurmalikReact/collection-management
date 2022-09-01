const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  theme: { type: String, required: true },
  owner_id: { type: String, required: true },
  // image (optional): image,
  required_number: { type: [String], required: true },
  required_title: { type: [String], required: true },
  required_description: { type: [String], required: true },
  required_date: { type: [String], required: true },
  required_checkbox: { type: [String], required: true },
  // items: {
  //   type: [
  //     {
  //       name: { type: String, required: true },
  //       tags: { type: [String], required: true },
  //       addition_number: {
  //         type: [
  //           {
  //             name: String,
  //             value: Number,
  //           },
  //         ],
  //         required: true,
  //       },
  //       addition_title: {
  //         type: [
  //           {
  //             name: String,
  //             value: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //       addition_description: {
  //         type: [
  //           {
  //             name: String,
  //             value: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //       addition_date: {
  //         type: [
  //           {
  //             name: String,
  //             value: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //       addition_checkbox: {
  //         type: [
  //           {
  //             name: Boolean,
  //             value: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //       comments: {
  //         type: [
  //           {
  //             owner_id: String,
  //             text: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //       likes: {
  //         type: [
  //           {
  //             owner_id: String,
  //           },
  //         ],
  //         required: true,
  //       },
  //     },
  //   ],
  //   required: true,
  // },
});

module.exports = model("Collection", schema);
