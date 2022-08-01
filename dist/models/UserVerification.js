import mongoose from 'mongoose';
const { Schema, Document, model, connect } = mongoose;
const UserVerificationSchema = new Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
}, { timestamps: true });
export default model("UserVerification", UserVerificationSchema);
