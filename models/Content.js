const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    content_thumbnail: {
      type: String,
      trim: true,
    },

    content_title: {
      type: String,
      required: [true, "Content title is required."],
      unique: true,
      trim: true,
    },

    content_brief: {
      type: String,
      trim: true,
    },

    content_body: [
      {
        content_body_title: {
          type: String,
          trim: true,
        },

        content_body_paragraph: {
          type: String,
          trim: true,
        },

        content_body_lists: {
          type: [String],
          trim: true,
        },

        content_body_image: {
          type: String,
          trim: true,
        },
      },
    ],

    content_footer: [
      {
        content_footer_title: {
          type: String,
          trim: true,
        },

        content_footer_paragraph: {
          type: String,
          trim: true,
        },

        content_footer_lists: {
          type: [String],
          trim: true,
        },

        content_footer_image: {
          type: String,
          trim: true,
        },
      },
    ],

    content_categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Content must belong to a category."],
    },

    content_subcategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subcategory",
    },

    content_type: {
      type: String,
      enum: {
        values: ["news", "content"],
        message: "Invalid content type.",
      },
      required: [true, "Content type must be specified."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const Content = mongoose.model("Content", Schema);
module.exports = Content;
