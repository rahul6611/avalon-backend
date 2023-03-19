const { UserModel } = require("../models/UserModel");

const error = require("../config/errors").errors;
const helpers = require("../helpers/validations")

// const createUser = async (req, res) => {
//     let {
//         first_name,
//         last_name,
//         email,
//         password,
//         otp
//     } = req.body

//     let otpData = await VerifyOtpModel.findOne({ email: req.body.email, type: "signUp" });
//     console.log(otpData);

//     let currentDate = new Date();
//     let otpDataTime = new Date(otpData.time)

//     if (otpData.otp !== otp) return res.status(400).send({ error: error.VERIFICATION_FAILURE })
//     if (otpDataTime > currentDate) {
//         if (helpers.isValidEmail(email)) {
//             email = email.toLowerCase();
//             const existingUser = await UserModel.findOne({ email: email });
//             if (existingUser) {
//                 return res.status(400).send({ errorCode: error.EMAIL_ID_USERNAME_ALREADY_EXITS.code, error: error.EMAIL_ID_USERNAME_ALREADY_EXITS });
//             }

//             const obj = new UserModel({
//                 email,
//                 password: helpers.hashPassword(password),
//                 signup_token: new Date().getTime(),
//                 is_confirmed: true,
//                 is_active: true,
//                 role: "USER",
//                 first_name,
//                 last_name
//             });

//             try {
//                 let User = await obj.save();
//                 // await signupEmail(User)
//                 await VerifyOtpModel.deleteMany({ email: email, type: "signUp" });
//                 let token = helpers.generateUserToken(User._id, User.email, User.first_name, User.last_name, User.is_active, User.profile_img, User.role)
//                 // return res.send({ token: token });
//                 let newImg = `https://adventure-store.s3.amazonaws.com/users/${User._id}.png`
//                 let response = await UserModel.findOneAndUpdate({ _id: User._id }, { $set: { profile_img: newImg } }, { new: true });
//                 return res.status(201).send({ status_code: 200, message: "SignUp SuccessFully", token: token, userId: User._id })
//             } catch (error) {
//                 res.status(400).send({ status_code: 400, message: "Error", error })
//             }

//         } else {
//             return res.status(400).send({ error: error.INVALID_EMAIL });
//         }

//     } else {
//         return res.status(400).send({ error: error.OTP_EXPIRED });
//     }
// }

const createUser = async (req, res) => {
    let {
        first_name,
        last_name,
        email,
        password,
    } = req.body

    // try {
    //     let User = await obj.save();
    //     let token = helpers.generateUserToken(User._id, User.email, User.first_name, User.last_name, User.is_active, User.profile_img, User.role)
    //     return res.status(201).send({ status_code: 200, message: "SignUp SuccessFully", token: token, userId: User._id })

    // } catch (error) {
    //     res.status(400).send({ status_code: 400, message: "Error", error })
    // }

    if (helpers.isValidEmail(email)) {
        email = email.toLowerCase();
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ errorCode: error.EMAIL_ID_USERNAME_ALREADY_EXITS.code, error: error.EMAIL_ID_USERNAME_ALREADY_EXITS });
        }

        const obj = new UserModel({
            email,
            password: helpers.hashPassword(password),
            signup_token: new Date().getTime(),
            is_confirmed: true,
            is_active: true,
            role: "USER",
            first_name,
            last_name
        });

        try {
            let User = await obj.save();
            // await signupEmail(User)
            // await VerifyOtpModel.deleteMany({ email: email, type: "signUp" });
            let token = helpers.generateUserToken(User._id, User.email, User.first_name, User.last_name, User.is_active, User.profile_img, User.role)
            // return res.send({ token: token });
            // let newImg = `https://adventure-store.s3.amazonaws.com/users/${User._id}.png`
            // let response = await UserModel.findOneAndUpdate({ _id: User._id }, { $set: { profile_img: newImg } }, { new: true });
            return res.status(201).send({ status_code: 200, message: "SignUp SuccessFully", token: token, userId: User._id })
        } catch (error) {
            res.status(400).send({ status_code: 400, message: "Error", error })
        }

    } else {
        return res.status(400).send({ error: error.INVALID_EMAIL });
    }
}


const getUser = async (req, res) => {
    try {
        let User = await UserModel.find().select(['-password', '-health_status', '-signup_token'])
        User = User.filter((item) => item.role === 'USER')
        res.status(200).send({ User })
    } catch (error) {
        res.status(400).send({ error })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        let User = await UserModel.findById(id)
        if (User == null) {
            return res.json({ status: 204, message: "User Not Found" })
        } else {
            return res.status(200).send({ User })
        }
    } catch (error) {
        res.status(400).send({ error })
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        let User = await UserModel.findOne({ email })
        res.status(200).send({ User })
    } catch (error) {
        res.status(400).send({ error })
    }
}

const updateUser = async (req, res) => {

    const existingUser = await UserModel.findOne({ _id: req.body._id });
    if (!existingUser) {
        return res.status(400).send({ errorCode: error.ENTITY_NOT_PRESENT.code, error: error.ENTITY_NOT_PRESENT });
    }
    try {
        let response = await UserModel.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
        res.status(200).send({ status_code: 200, message: "Ok", response })
    } catch (error) {
        res.status(400).send({ error })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await UserModel.findOne({ _id: id });
        if (!existingUser) {
            return res.status(400).send({ errorCode: error.ENTITY_NOT_PRESENT.code, error: error.ENTITY_NOT_PRESENT });
        }
        let data = await UserModel.findByIdAndDelete({ _id: id });
        data = { status_code: 200, message: "Ok" }
        res.status(200).send({ data, message: `User Deleted Successfully with Id:${id}` })
    } catch (error) {
        res.status(400).send({ error })
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
}