const mongoose = require("mongoose");
const { CATEGORIES } = require("../../consts/index.consts");
require("../Content");

const Schema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      enum: {
        values: CATEGORIES.map((category) => category.parent_category),
        message: "Invalid category name.",
      },
      required: [true, "Content must belong to at least one category."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    category_subcategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subcategory",
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
Schema.virtual("category_contents", {
  ref: "Content",
  foreignField: "content_categories.parent_category",
  localField: "_id",
});

// * Query Middleware
Schema.pre("findOne", function (next) {
  this.populate("category_contents");

  next();
});

const Category = mongoose.model("Category", Schema);
module.exports = Category;
