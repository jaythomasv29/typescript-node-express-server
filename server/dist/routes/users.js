import express from "express";
import { getAllUsers, deleteUserById, editUserById } from '../controller/users.js';
const router = express.Router();
router.get("/", getAllUsers);
router.put("/:userId", editUserById);
router.delete("/:userId", deleteUserById);
export default router;
