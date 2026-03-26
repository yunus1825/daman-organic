import mongoose from "mongoose";

// Counter schema to keep track of order numbers per category
const productOrderCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  }, // format: "categoryOrder_{categoryId}"
  seq: {
    type: Number,
    default: 0,
  },
});

const ProductOrderCounter = mongoose.model(
  "ProductOrderCounter",
  productOrderCounterSchema
);

const ProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: [false, "Category Id required!"],
      trim: true,
      ref: "Categories",
    },
    order: {
      type: Number,
      required: [false, "Order number required!"],
    },
    categoryName: {
      type: String,
      required: [true, "Category required!"],
      trim: true,
      ref: "Categories",
    },
    prd_Name: {
      type: String,
      required: [true, "Product Name required!"],
      trim: true,
    },
    purchase_price: {
      type: Number,
      required: [false, "Purchase Price required!"],
      trim: true,
    },
    display_price: {
      type: Number,
      required: [true, "Display Price required!"],
      trim: true,
    },
    selling_price: {
      type: Number,
      required: [true, "Selling Price required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description required!"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image required!"],
      trim: true,
    },
    quantity: {
      type: Number,
      require: [true, "Quantity required!"],
      trim: true,
    },
    Type: {
      type: String,
      require: [true, "Type required!"],
      trim: true,
    },
    status: {
      type: Boolean,
      required: [true, "status flag required!"],
      default: false,
    },
    hide: {
      type: Boolean,
      required: [true, "status flag required!"],
      default: false,
    },
    customId: {
      type: String,
      unique: true,
    },
    images: [
      {
        image: {
          type: String,
          required: [false, "Product Image required!"],
          trim: true,
        },
      },
    ],
    variants: [
      {
        quantity: {
          type: Number,
          require: [true, "Quantity required!"],
          trim: true,
        },
        Type: {
          type: String,
          require: [true, "Type required!"],
          trim: true,
        },
        selling_Price: {
          type: Number,
          require: [true, "Selling Price required!"],
          trim: true,
        },
        display_price: {
          type: Number,
          required: [true, "Display Price required!"],
          trim: true,
        },
        description: {
          type: String,
          required: [true, "Description required!"],
          trim: true,
        },
        inStock: {
          type: Boolean,
          default: true, // manually controllable through API
        },
      },
    ],
    ratings: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        ordId: {
          type: String,
          required: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    overallRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewscount: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        review: {
          type: String,
          required: true,
          trim: true,
        },
        ordId: {
          type: String,
          required: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-increment customId for products
ProductSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    // Fetch the last product based on customId
    const lastProduct = await this.constructor
      .findOne()
      .sort({ customId: -1 })
      .exec();

    if (lastProduct && lastProduct.customId) {
      // Extract the numerical part and increment by 1
      const lastId = parseInt(lastProduct.customId.replace(/\D/g, ""));
      const newId = lastId + 1;
      this.customId = `PRD${String(newId).padStart(4, "0")}`;
    } else {
      this.customId = "PRD0001";
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Auto-increment order number based on category
ProductSchema.pre("save", async function (next) {
  if (!this.isNew || !this.categoryId) return next();

  try {
    const counterId = `categoryOrder_${this.categoryId}`;

    const counter = await ProductOrderCounter.findByIdAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.order = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

const Products = mongoose.model("colProducts", ProductSchema);

export default Products;
