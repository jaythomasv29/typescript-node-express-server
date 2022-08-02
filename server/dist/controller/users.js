var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/Users.js';
export const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(400).json({ message: "Error occured fetching users" });
    }
});
export const editUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: "Error occured while updating users" });
    }
});
export const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.findByIdAndDelete(req.params.userId);
        res.json("Delete Successful");
    }
    catch (err) {
        res.status(400).json({ message: "Error occured while deleting users" });
    }
});
