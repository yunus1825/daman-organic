import AdminUser from "../models/Adminuser.model.js";
import bcrypt from "bcryptjs";

// Default Admin User function
export const createDefaultAdminUser = async () => {
    try {
        const existingAdmin = await AdminUser.findOne({ email: 'admin@damanorganic.com' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('123456', 10);

            const newAdminUser = new AdminUser({
                phone: 1234567890, // Default phone number
                name: 'Admin', // Default name
                gender: 'Other', // Default gender
                email: 'admin@damanorganic.com',
                password: hashedPassword,
                country_code: '+91', // Default country code
                Address: 'Default Address', // Default address
            });

            await newAdminUser.save();
            console.log('Default admin user created successfully.');
        } else {
            console.log('Default admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
};
// Create Admin User
export const createAdminUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdminUser = new AdminUser({
            ...rest,
            password: hashedPassword,
        });

        const response = await newAdminUser.save();

        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "User Created successfully",
            data: { results: response },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: { error: error.message },
        });
    }
};
// Get All Admin Users 
export const getAllAdminUser = async (req, res) => {
    try {

        const response = await AdminUser.find();

        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "Data fetched successfully",
            data: { length: response.length, results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status:
                "An error occurred! Check server logs for more info is the error.",
            data: {},
        });
    }
};
// Get Admin Users By Id 
export const getAdminUserById = async (req, res) => {
    try {
        const response = await AdminUser.findById(req.params.AdminUserId);
        if (!response) {
            res
                .status(404)
                .json({ code: 404, status: "Admin User not found", data: {} });
            return;
        }
        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "User Data fetched successfully",
            data: { length: response.length, results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};
// Delete Admin User 
export const deleteAdminUserById = async (req, res) => {
    try {
        const response = await AdminUser.findByIdAndDelete(
            req.params.AdminUserId
        );
        if (!response) {
            // console.log(res);
            res
                .status(404)
                .json({ code: 404, status: "Admin user not found", data: {} });
            return;
        }
        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "User Data Deleted successfully",
            data: { results: response },
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};
// Update Admin User
export const updateAdminUserById = async (req, res) => {
    try {
        // Check if the password field is being updated
        if (req.body.password) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }

        const response = await AdminUser.findByIdAndUpdate(
            req.params.AdminUserId,
            req.body,
            { new: true }
        );

        if (!response) {
            return res.status(404).json({
                code: 404,
                status: "Admin User not found",
                data: {}
            });
        }

        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "User Updated successfully",
            data: { results: response }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {}
        });
    }
};
// Login Email and password 
export const AdminloginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminuser = await AdminUser.findOne({ 'email': email });

        if (!adminuser) {
            return res.status(400).json({
                code: 400,
                status: 'Failure!',
                message: 'Invalid email or password',
                data: {}
            });
        }


        const isMatch = await bcrypt.compare(password, adminuser.password);

        if (!isMatch) {
            return res.status(400).json({
                code: 400,
                status: 'Failure!',
                message: 'Invalid email or password',
                data: {}
            });
        }
        // Update login datetime
        adminuser.LoginDateTime = new Date();
        await adminuser.save();

        return res.status(200).json({
            code: 200,
            status: 'Success!',
            message: 'Login successful!',
            data: adminuser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: 'An error occurred! Check server logs for more info.',
            data: {}
        });
    }
};