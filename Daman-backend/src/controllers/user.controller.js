import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import querystring from "querystring";
import cache from "../utils/cache.js";

//  OTP Generate Function
function generateOTP() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// User signup API
export const UserSignup = async (req, res) => {
  try {
    const { userImage, name, email, phone, password, country_code } = req.body;

    // Step 1: Check if a user with the same email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        status: "Failure",
        message:
          "User with this email or phone already exists. Please use Login.",
      });
    }

    // Step 2: Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create a new user
    const newUser = new User({
      userImage,
      name,
      email,
      phone,
      password: hashedPassword,
      country_code,
    });

    const response = await newUser.save();

    // Step 6: Respond with success message
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "User Successfully signUp",
      data: { results: response },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};

//   Login with email and password API
export const loginwithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        code: 200,
        status: "Not Found",
        message: "User not Registered",
        data: {},
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Email or Password Incorrect",
        data: {},
      });
    }

    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Login successful!",
      data: user,
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

// USER Update
export const updateUserById = async (req, res) => {
  try {
    const response = await User.findByIdAndUpdate(req.params.UserId, req.body, {
      new: true,
    });
    if (!response) {
      res.status(404).json({ code: 404, status: "User not found", data: {} });
      return;
    }
    cache.del("user_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      data: { results: response },
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
// user List Api
export const getAllUsers = async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json({
      code: 200,
      status: "Success!",
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
//  User Details API
export const getUserById = async (req, res) => {
  const cacheKey = `user_data_${req.params.UserId}`;
  const responseData = cache.get(cacheKey);
  if (responseData) {
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Data fetched successfully",
      data: { length: responseData.length, results: responseData },
    });
  }
  try {
    const response = await User.findById(req.params.UserId);

    cache.set("user_data", response);
    if (!response) {
      res.status(404).json({ code: 404, status: "User not found", data: {} });
      return;
    }
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
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
//  Send Otp API
const sendSMS = async ({ mobile, message, template_id }) => {
  const apiUrl = "https://smslogin.co/v3/api.php";

  const params = {
    username: "Damantrans",
    apikey: "f2c38570e10bb30c2494",
    senderid: "DAMANS",
    mobile: mobile,
    message: message,
    route: "t", // Use 't' if you change to transactional route
    template_id: "1707175024504663095",
  };

  const response = await axios.post(apiUrl, querystring.stringify(params), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const GenerateOtp = async (req, res) => {
  try {
    const { country_code, phone } = req.body;

    if (!country_code || !phone) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "Country code and phone number are required",
      });
    }

    // Check if user exists
    let existingUser = await User.findOne({ phone: phone });

    // if (!existingUser) {
    //   existingUser = new User({ country_code, phone });
    //   await existingUser.save();
    // }

    // Generate OTP
    const otp = generateOTP(); // Or use fixed: const otp = 4444;

    // Send OTP via SMS
    const fullMobile = `${country_code}${phone}`.replace(/\D/g, "");
    const smsMessage = `Your OTP for login is ${otp}. Please do not share with anyone. -Daman Organic`;
    // const smsMessage = `Your OTP for login is ${otp}. Please do not share with anyone. - Daman Organic`;

    const smsResponse = await sendSMS({
      mobile: fullMobile,
      message: smsMessage,
      template_id: "1707175024504663095", // ✅ Your approved template ID
    });

    // Optionally check SMS response status here

    // Generate JWT token with OTP
    const token = jwt.sign({ otp }, "secret_key", { expiresIn: "5m" });

    res.status(200).json({
      code: 200,
      status: "Success!",
      data: {
        token: token,
        // otp: otp,
        sms_response: smsResponse,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// verify with Json Web Tocken and OTP matching
export const Login = async (req, res) => {
  try {
    const { country_code, phone, otp } = req.body;

    if (!/^\d{4}$/.test(otp)) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Invalid OTP format. OTP must be exactly 4 digits.",
      });
    }

    if (!req.headers.authorization) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Authorization header is missing",
      });
    }

    // Extract token from Authorization header
    const authorizationHeader = req.headers.authorization;
    const tokenArray = authorizationHeader.split(" ");
    if (tokenArray.length !== 2 || tokenArray[0] !== "Bearer") {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Invalid Authorization header format",
      });
    }

    const token = tokenArray[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, "secret_key");
    const decodedOtp = decoded.otp;

    // Compare OTP
    // if (otp !== decodedOtp) {
    //   return res.status(400).json({
    //     code: 400,
    //     status: "Failed",
    //     message: "Invalid OTP",
    //   });
    // }

    // Allow default OTP 1111 OR actual OTP
    if (otp !== 1111 && otp !== decodedOtp) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Invalid OTP",
      });
    }

    // Check if the phone number already exists in the user collection
    let existingUser = await User.findOne({ phone });

    // If the user does not exist, create a new user record
    if (!existingUser) {
      // First-time user (created earlier in GenerateOtp)
      existingUser = await User.create({ country_code, phone, otp });

      return res.status(200).json({
        code: 200,
        status: "Success!",
        message: "OTP verified. Please complete your profile.",
        data: existingUser,
        isFirstLogin: true,
      });
    } else {
      // Returning user
      existingUser.otp = otp;
      await existingUser.save();

      return res.status(200).json({
        code: 200,
        status: "Success!",
        message: "Login successful!",
        data: existingUser,
        isFirstLogin: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { phone, email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Email and customer name are required",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { email, name },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "User not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred!",
      data: {},
    });
  }
};

// Update Password or add password
export const updatepasswordById = async (req, res) => {
  try {
    const { password } = req.body;
    const { UserId } = req.params;

    // Check if password is provided
    if (!password) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "Password is required.",
      });
    }

    // Find the user by ID
    const user = await User.findById(UserId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "User not found",
        data: {},
      });
    }

    // Check if the user has an email registered
    if (!user.email) {
      return res.status(400).json({
        code: 400,
        status: "Email not registered",
        message: "User does not have an email associated.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
