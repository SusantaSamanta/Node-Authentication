import mongoose from "mongoose";

const verifyEmailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "userDetail",  /// link with user in userTable
    },
    token: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{8}$/.test(v),
        message: (props) => `${props.value} is not a valid 8-digit token!`
      }
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 day
    }
  },
  {
    timestamps: true  // ✅ fixed spelling
  }
);




export const verifyEmailTable = mongoose.model("verifyEmailData", verifyEmailSchema);