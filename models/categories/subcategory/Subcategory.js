const mongoose = require("mongoose");
const {
  isSubcategoryValid,
} = require("../../../utils/helpers/category.helpers");
require("../../Content");

const Schema = new mongoose.Schema(
  {
    subcategory_name: {
      type: String,
      required: [true, "Subcategory is required."],
      lowercase: true,
      unique: true,
      trim: true,
    },

    subcategory_parents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Parent caregory id is required."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

// * Virtual Populating
Schema.virtual("subcategory_contents", {
  ref: "Content",
  foreignField: "content_subcategory",
  localField: "_id",
});

// * Query Middleware
Schema.pre("findOne", function (next) {
  this.populate("subcategory_contents");

  next();
});

const Subcategory = mongoose.model("Subcategory", Schema);
module.exports = Subcategory;
