var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import bcrypt from "bcryptjs";
import User from '../models/Users.js';
import UserVerification from '../models/UserVerification.js';
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import ckey from 'ckey';
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ckey.AUTH_EMAIL,
        pass: ckey.AUTH_PASS
    }
});
transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Email ready for sending");
    }
});
const sendVerificationEmail = (id, email, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "http://localhost:8000/";
    const uniqueString = uuidv4() + id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete registration and login into your acount</p><p><b>This link expires in 6 hours.</b>  Press <a href=${url + "api/auth/verify/" + id + "/" + uniqueString}>Here</a> to proceed.</p>`
    };
    try {
        const newVerificationRecord = new UserVerification({ id, uniqueString, createdAt: Date.now(), expiresAt: Date.now() + 21600000 });
        yield newVerificationRecord.save();
        yield transporter.sendMail(mailOptions);
    }
    catch (err) {
        return res.json(createError(400, 'Error in handling verification email'));
    }
});
export const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    try {
        const userExists = yield User.findOne({ username: req.body.username });
        if (userExists)
            return next(createError(400, 'User already exists, try with different username / email'));
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User(Object.assign(Object.assign({}, req.body), { password: hash }));
        const userDetails = yield newUser.save();
        if (userDetails) {
            const { _id, email, } = userDetails;
            sendVerificationEmail(_id, email, res);
            return res.status(200).json({ message: "User has been created", userDetails, status: "Pending" });
        }
    }
    catch (err) {
        next(err);
    }
});
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user exists
        const user = yield User.findOne({ username: req.body.username });
        if (!user)
            return next(createError(400, "Wrong password or username"));
        // Check if password is valid for user
        const isPasswordCorrect = yield bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong password or username"));
        // Successful password validation provides JWT
        if (!user.isConfirmed) {
            return next(createError(401, "Please confirm your account"));
        }
        const JWT_SECRET = process.env.JWT_SECRET || '';
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, JWT_SECRET);
        // Send JWT to client via cookies
        const _a = user._doc, { password, isAdmin } = _a, otherDetails = __rest(_a, ["password", "isAdmin"]);
        res.cookie("access_token", token, { httpOnly: true })
            .status(200).json({ details: Object.assign(Object.assign({}, otherDetails), { isAdmin }) });
    }
    catch (err) {
        next(err);
    }
});
export const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, uniqueString } = req.params;
    const userVerificationRecord = yield UserVerification.findOne({ id: userId });
    if (!userVerificationRecord || Date.now() > userVerificationRecord.expiresAt.getTime()) {
        return next(createError(400, "Verification of account failed or expired"));
    }
    try {
        //If verification link exists, find the user in User model and change isVerified field to true
        yield User.findByIdAndUpdate(userId, { $set: { isConfirmed: true } });
        return res.json("User verification successful");
    }
    catch (err) {
        return res.status(400).json({ err, message: "Error verifying user" });
    }
});
