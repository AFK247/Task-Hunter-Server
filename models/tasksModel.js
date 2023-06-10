const mongoose = require("mongoose");

const tasksSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "new",
      enum: ["new", "complete", "canceled", "pending"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tasks", tasksSchema);
