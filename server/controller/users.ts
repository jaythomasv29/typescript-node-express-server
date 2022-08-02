import { Request, Response } from "express";
import User from '../models/Users.js'

export const getAllUsers = async (req: Request, res: Response,) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ message: "Error occured fetching users" })
  }
}

export const editUserById = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: "Error occured while updating users" })
  }
}

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.json("Delete Successful")
  } catch (err) {
    res.status(400).json({ message: "Error occured while deleting users" })
  }
}