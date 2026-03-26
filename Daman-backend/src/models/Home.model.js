import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
    {
        section_name: {
            type: String,
            required: [true, "Quantity required!"],
            default: false,
        },
        products: [
            {
                productId: {
                    type: String,
                    required: [false, "Product id required!"],
                    trim: true,
                },
                prd_Name: {
                    type: String,
                    required: [false, "Product Name required!"],
                    trim: true,
                },
            },
        ],
        
    },
    {
        timestamps: true,
    }
);

const Home = mongoose.model("colHome", HomeSchema);

export default Home;
