import mongoose from 'mongoose';
const { Schema, Document, model, connect } = mongoose

interface IUserVerification extends Document{
  _doc: any;
  userId: string;
  uniqueString: string;
  createdAt: Date;
  expiresAt: Date;
}

const UserVerificationSchema = new Schema<IUserVerification>({

  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date


},
{ timestamps: true }
)

export default model("UserVerification", UserVerificationSchema)