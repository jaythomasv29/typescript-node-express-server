import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs"
import User from '../models/Users.js'
import UserVerification from '../models/UserVerification.js'
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import ckey from 'ckey'
import { nextTick } from "process";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ckey.AUTH_EMAIL,
    pass: ckey.AUTH_PASS
  }
})

transporter.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Email ready for sending")
  }
})

const sendVerificationEmail = async (id: string, email: string, res: Response) => {
  const url = "http://localhost:8000/"
  const uniqueString = uuidv4() + id
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete registration and login into your acount</p><p><b>This link expires in 6 hours.</b>  Press <a href=${url + "api/auth/verify/" + id + "/" + uniqueString}>Here</a> to proceed.</p>`
  }
  try {
    const newVerificationRecord = new UserVerification({ id, uniqueString, createdAt: Date.now(), expiresAt: Date.now() + 21600000 })
    await newVerificationRecord.save()
    await transporter.sendMail(mailOptions)
  } catch (err) {
    return res.json(createError(400, 'Error in handling verification email'))
  }

}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body
  try {
    const userExists = await User.findOne({ username: req.body.username })
    if (userExists) return next(createError(400, 'User already exists, try with different username / email'))
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)
    const newUser = new User({ ...req.body, password: hash })
    const userDetails = await newUser.save()
    if (userDetails) {
      const { _id, email, } = userDetails
      sendVerificationEmail(_id, email, res)
      return res.status(200).json({ message: "User has been created", userDetails, status: "Pending" })
    }
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user exists
    const user = await User.findOne({ username: req.body.username })
    if (!user) return next(createError(400, "Wrong password or username"))
    // Check if password is valid for user
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"))
    // Successful password validation provides JWT

    if (!user.isConfirmed) {
      return next(createError(401, "Please confirm your account"))
    }
    const JWT_SECRET: string = process.env.JWT_SECRET || ''
    const token = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
    },
      JWT_SECRET)
    // Send JWT to client via cookies
    const { password, isAdmin, ...otherDetails } = user._doc;
    res.cookie("access_token", token, { httpOnly: true })
      .status(200).json({ details: { ...otherDetails, isAdmin } })

  } catch (err) {
    next(err)
  }
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, uniqueString } = req.params
  const userVerificationRecord = await UserVerification.findOne({ id: userId })
  if (!userVerificationRecord  || Date.now() > userVerificationRecord.expiresAt.getTime()) {
    return next(createError(400, "Verification of account failed or expired"))
  }
  try {
    //If verification link exists, find the user in User model and change isVerified field to true
    await User.findByIdAndUpdate(
      userId,
      { $set: { isConfirmed: true } }
    )
    return res.json("User verification successful")
  } catch (err) {
    return res.status(400).json({err, message: "Error verifying user"})
  }

}
