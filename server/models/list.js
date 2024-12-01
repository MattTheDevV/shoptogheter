const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  done: { type: Boolean, default: false },
});


const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  collaborators: { type: [String], default: [] },
  items: { type: [ItemSchema], default: [] },
  archived: { type: Boolean, default: false },
});

module.exports = mongoose.model("List", ListSchema);
