const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helpers/index.helpers");

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

    content_body: {
      type: String,
      required: [true, "Content body is required."],
    },

    // content_body: [
    //   {
    //     content_body_title: {
    //       type: String,
    //       trim: true,
    //     },

    //     content_body_paragraphs: {
    //       type: [String],
    //       trim: true,
    //     },

    //     content_body_codes: {
    //       type: [Object],
    //     },

    //     content_body_lists: {
    //       type: [String],
    //       trim: true,
    //     },

    //     content_body_images: {
    //       type: [String],
    //       trim: true,
    //     },

    //     content_body_video: {
    //       type: String,
    //       trim: true,
    //     },
    //   },
    // ],

    // content_categories: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Category",
    //   required: [true, "Content must belong to a category."],
    // },

    // content_subcategories: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Subcategory",
    //   required: false,
    // },

    content_categories: [
      {
        parent_category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: [true, "Content must belong to a category."],
        },

        subcategories: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Subcategory",
        },
      },
    ],

    content_slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content_meta_description: {
      type: String,
      required: [true, "Meta description is required."],
      trim: true,
    },

    content_meta_keywords: {
      type: [String],
      required: [true, "Meta keywords are required."],
      validate: [
        {
          validator: function (keywords) {
            return (
              Array.isArray(keywords) &&
              keywords.every(
                (keyword) =>
                  typeof keyword === "string" && keyword.trim().length > 0
              )
            );
          },
          message: "Meta keywords include invalid keyword(s) or empty strings.",
        },
        {
          validator: function (keywords) {
            return keywords.length > 0;
          },
          message: "Meta keywords cannot be empty.",
        },
      ],
      lowercase: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

// * Document Middleware
Schema.pre("save", function (next) {
  try {
    // Setting slug
    if (this.isModified("content_title"))
      this.content_slug = generateSlug(this.content_title);

    // Converting array to set
    if (this.isModified("content_meta_keywords"))
      this.content_meta_keywords = Array.from(
        new Set(this.content_meta_keywords)
      );

    next();
  } catch (e) {
    next(e);
  }
});

const Content = mongoose.model("Content", Schema);
module.exports = Content;
