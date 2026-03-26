import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        ordId: { type: String, unique: true },
        userId: {
            type: mongoose.Types.ObjectId,
            required: [false, "User Id required!"],
            trim: true,
        },
        product_json: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    required: [false, "Product Id required!"],
                    trim: true,
                },
                prd_Name: {
                    type: String,
                    required: [false, "Prodcut Category required!"],
                    trim: true,
                },
                categoryId: {
                    type: mongoose.Types.ObjectId,
                    required: [false, "Prodcut Category Id required!"],
                    trim: true,
                    ref: 'Categories',
                },
                categoryName: {
                    type: String,
                    required: [false, "Prodcut Category required!"],
                    trim: true,
                    ref: 'Categories',
                },
                productPrice: {
                    type: Number,
                    required: [false, "Quantity required!"],
                    default: false,
                },
                quantity: {
                    type: Number,
                    required: [false, "Quantity required!"],
                    default: false,
                },
                variantId: {
                    type: mongoose.Types.ObjectId,
                    required: false,
                    trim: true,
                },
                isAccepted: {
                    type: Boolean,
                    default: false
                },
            },
        ],
        addressId: {
            type: mongoose.Types.ObjectId,
            required: [false, "Address Id required!"],
            trim: true,
        },
        customer_address: {
            userId: {
                type: mongoose.Types.ObjectId,
                required: [false, "User Id required!"],
                trim: true,
            },
            customer_name: {
      type: String,
      required: [false, "Name required!"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: false,
      trim: true,
      required: [false, "Email required!"],
      validate: {
        validator: function (v) {
          if (v && v.length > 0) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          }
          return true;
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
            addressType: {
                type: String,
                required: [false, "Address Type required!"],
                trim: true,
            },
            flatNo: {
                type: String,
                required: [false, "Flat No required!"],
            },
            phoneNo: {
                type: Number,
                required: [false, "Phone No required!"],
            },
            address: {
                type: String,
                required: [false, "Address required!"],
            },
            city: {
                type: String,
                required: [false, "City required!"],
            },
            area: {
                type: String,
                required: [false, "Area required!"],
            },
            street: {
                type: String,
                required: [false, "Area required!"],
            },
            appartment_name: {
                type: String,
                required: [false, "Area required!"],
            },
            landmark: {
                type: String,
                required: [false, "LandMark required!"],
                // default: false,
            },
            pincode: {
                type: Number,
                required: [false, "Pincode required!"],
                // default: false,
            },
            mapLink: {
                type: String,
                required: [false, "Map Link required!"],
                // default: false,
            },
            latitude: {
                type: Number,
                required: [false, "latitude required!"],
                default: null,
            },
            longitude: {
                type: Number,
                required: [false, "longitude required!"],
                default: null,
            },
        },
        cancelReason: {
            type: String,
            required: [false, "Cancel Reason Type required!"],
            trim: true,
        },
        paymentType: {
            type: String,
            required: [false, "Payment Type required!"],
            trim: true,
        },
        payment_status: {
            type: String,
            required: [false, "Payment Status required!"],
            enum: ['PENDING', 'PAID', 'FAILED'],
            trim: true,
        },
        paymentId: {
            type: String,
            required: [false, "Payment ID required!"],
            default: "null",
        },
        paymentStatus: {
            type: String,
            required: [false, "Payment Status required!"],
            trim: true,
        },

        totalPrice: {
            type: Number,
            required: [false, "Total Price required!"],
            trim: true,
        },
        refundamount: {
            type: Number,
            required: [false, "Total Price required!"],
            trim: true,
        },
        coupon_code: {
            type: String,
            required: [false, "Coupon Code required!"],
            trim: true,
        },
        discount_price: {
            type: Number,
            required: [false, "Discount Price required!"],
            trim: true,
        },
        deliveryCharge: {
            type: Number,
            required: [false, "Delivery Charges Price required!"],
            trim: true,
        },
        storeId: {
            type: mongoose.Types.ObjectId,
            required: [false, "Store Id required!"],
            trim: true,
        },
        ordStatus: {
            type: String,
            required: [true, "Order Status required!"],
            trim: true,
            default: "Open",
        },
        orderedDate: {
            type: Date,
            required: false,
            // default: null,
        },
        accepted_by: {
            type: mongoose.Types.ObjectId,
            required: [false, "Admin User Id required!"],
            trim: true,
        },
        acceptedDate: {
            type: Date,
            required: false,
            // default: null,
        },
        assign_by: {
            type: mongoose.Types.ObjectId,
            required: [false, "Admin User Id required!"],
            trim: true,
        },
        assignDate: {
            type: Date,
            required: false,
            // default: null,
        },
        cancel_by: {
            type: mongoose.Types.ObjectId,
            required: [false, "Admin User Id required!"],
            trim: true,
        },
        cancelDate: {
            type: Date,
            required: false,
            // default: null,
        },
        cancel_reason: {
            type: String,
            required: [false, "Cancel Message required!"],
            trim: true,
        },
        deliver_by: {
            type: mongoose.Types.ObjectId,
            required: [false, "Admin User Id required!"],
            trim: true,
        },
        deliveredDate: {
            type: Date,
            required: false,
            // default: null,
        },
        ordmessage: {
            type: String,
            required: [false, "Order Message required!"],
            trim: true,
        },
        scheduleDate: {
            type: Date,
            required: false,
            // default: null,
        },
        scheduleTime: {
            type: String,
            required: false,
            // default: null,
        },
        status: {
            type: Boolean,
            required: [true, "status flag required!"],
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


OrderSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    try {
        // Fetch the last order based on ordId
        const lastOrder = await this.constructor.findOne().sort({ ordId: -1 }).exec();

        if (lastOrder && lastOrder.ordId) {
            // Extract the numerical part and increment by 1
            const lastId = parseInt(lastOrder.ordId.replace(/\D/g, "")); // Remove non-numeric characters
            const newId = lastId + 1;
            this.ordId = `ORD${String(newId).padStart(5, "0")}`; // Format the new ID with leading zeros
        } else {
            // If no orders found, start with ORD00001
            this.ordId = "ORD00001";
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Error handling middleware for MongoDB duplicate key errors
OrderSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new Error("Duplicate Order ID detected. Please try again."));
    } else {
        next(error);
    }
});


const Orders = mongoose.model("colOrder", OrderSchema);

export default Orders;
