import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId, 
      ref: "userDetail",
      required: true,                      
    },
    valid: {
      type: Boolean,
      default: true,
    },
    ip: {
      type: String, // to store user ipaddress 
      default: "",                         
    },
    userAgent: {
      type: String,
      default: "",                        
    },
  },
  {
    timestamps: true,                     
  }
);

export const sessionTable = mongoose.model("sessionDetail", sessionSchema);
