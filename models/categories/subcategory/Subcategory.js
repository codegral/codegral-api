const mongoose = require("mongoose");
require("../../Content");

const Schema = new mongoose.Schema(
  {
    subcategory_parents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Parent caregory id is required."],
    },

    subcategory_name: {
      type: String,
      required: [true, "Subcategory is required."],
      lowercase: true,
      unique: true,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

Schema.virtual("subcategory_contents", {
  ref: "Content",
  foreignField: "content_subcategory",
  localField: "_id",
});

Schema.pre("findOne", function (next) {
  this.populate("subcategory_contents");

  next();
});

const Subcategory = mongoose.model("Subcategory", Schema);
module.exports = Subcategory;
