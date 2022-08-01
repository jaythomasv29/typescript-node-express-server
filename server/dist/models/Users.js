import mongoose from 'mongoose';
const { Schema, Document, model, connect } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
    },
    coordinates: {
        type: [Number],
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
export default model("User", UserSchema);
