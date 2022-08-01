import express from "express";
import { register, login, verify } from '../controller/auth.js';
const router = express.Router();
router.get("/", (req, res) => {
    res.json('auth root');
});
router.post("/register", register);
router.post("/login", login);
router.get("/verify/:userId/:uniqueString", verify);
export default router;
